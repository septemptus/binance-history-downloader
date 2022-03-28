require('dotenv').config();
const moment = require('moment');
const axios = require('axios');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const anzip = require('anzip');
const { promisify } = require('util');
const { finished } = require('stream');

const { PAIR, PERIOD, MONTHS } = process.env;
const SAVE_DIR = 'data';
const TMP_DIR = 'tmp';
const URL = ({ month, year }) => `https://data.binance.vision/data/spot/monthly/klines/${PAIR}/${PERIOD}/${PAIR}-${PERIOD}-${year}-${month}.zip`;
const RESULT_FILE = `${PAIR}-${PERIOD}.csv`;

async function fetch() {
  const end = moment().startOf('month');
  const start = moment(end).subtract(MONTHS, 'months');
  const urls = _.range(end.diff(start, 'month')).reverse().map((i) => {
    const date = moment(end).subtract(i + 1, 'month');
    const url = URL({ year: date.format('YYYY'), month: date.format('MM') });
    return url;
  });

  const results = await Promise.all(urls.map((url) => axios.get(url, { responseType: 'stream' })));
  const files = results.map((r, i) => _.last(urls[i].split('/')));

  if (fs.existsSync(path.join(__dirname, TMP_DIR))) {
    fs.rmSync(path.join(__dirname, TMP_DIR), { recursive: true, force: true });
  }

  if (!fs.existsSync(path.join(__dirname, SAVE_DIR))) {
    fs.mkdirSync(path.join(__dirname, SAVE_DIR));
  }

  fs.mkdirSync(path.join(__dirname, TMP_DIR));

  await Promise.all(results.map(async (res, i) => {
    const writer = fs.createWriteStream(path.join(__dirname, TMP_DIR, files[i]));
    res.data.pipe(writer);
    await promisify(finished)(writer);
  }));

  await Promise.all(files.map(async (f) => {
    await anzip(path.join(__dirname, TMP_DIR, f), { outputPath: path.join(__dirname, SAVE_DIR)});
  }));


  const concatenated = files.reduce((acc, f) => {
    const csvF = f.replace('zip', 'csv');
    const file = fs.readFileSync(path.join(__dirname, SAVE_DIR, csvF));
    return `${acc}${file.toString()}`;
  }, '');

  const writer = fs.createWriteStream(path.join(__dirname, SAVE_DIR, RESULT_FILE));
  writer.write(concatenated);
  await promisify(finished)(writer);
}

fetch();