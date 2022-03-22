const moment = require('moment');
const axios = require('axios');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const anzip = require('anzip');
const { promisify } = require('util');
const { finished } = require('stream');

const PAIR = 'BTCUSDT';
const PERIOD = '1h';
const SAVE_DIR = 'data';
const TMP_DIR = 'tmp';
const YEARS = 3;
const URL = ({ month, year }) => `https://data.binance.vision/data/spot/monthly/klines/${PAIR}/${PERIOD}/${PAIR}-${PERIOD}-${year}-${month}.zip`;
const RESULT_FILE = `${PAIR}-${PERIOD}.csv`;

async function fetch() {
  const now = moment();
  const currentYear = now.year();
  const currentMonth = now.month();
  const urls = _.range(YEARS).reverse().flatMap((i) => {
    const year = currentYear - i;
    const maxMonths = currentYear === year ? currentMonth : 12;
    return _.range(maxMonths).map((j) => {
      const month = moment().year(year).month(j).format('MM');
      const url = URL({ year, month });
      return url;
    });
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