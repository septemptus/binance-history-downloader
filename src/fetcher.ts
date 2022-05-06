import axios, { AxiosResponse } from 'axios';
import range from 'lodash/range';
import moment from 'moment';
import yauzl from 'yauzl';
import { KlineData, parse } from './parser';

const URL_BASE = 'https://data.binance.vision/data/spot/monthly/klines/';

export type KlinePeriod =
  | '1m'
  | '3m'
  | '5m'
  | '15m'
  | '30m'
  | '1h'
  | '2h'
  | '4h'
  | '6h'
  | '8h'
  | '12h'
  | '1d'
  | '3d'
  | '1w'
  | '1mo';

const unzip = (buffer: Buffer) =>
  new Promise<Buffer>((resolve, reject) => {
    yauzl.fromBuffer(buffer, { lazyEntries: true }, (err, result) => {
      if (err) {
        return reject(err);
      }
      result.readEntry();
      result.on('entry', async (entry) => {
        result.openReadStream(entry, (err, stream) => {
          if (err) {
            return reject(err);
          }
          const chunks: Buffer[] = [];
          stream.on('data', (data) => {
            chunks.push(data);
          });
          stream.on('end', () => resolve(Buffer.concat(chunks)));
        });
      });
    });
  });

export async function getRawBinanceData(
  currencyPair: string,
  period: KlinePeriod,
  startDate: Date,
  endDate: Date
): Promise<string> {
  try {
    const start = moment(startDate).startOf('month');
    const end = moment(endDate).startOf('month');

    if (end.isBefore(start)) {
      throw new Error('End date is set before start date');
    }

    const urls = range(end.diff(start, 'month') + 1)
      .reverse()
      .map((i) => {
        const date = moment(end).subtract(i, 'month');
        const url = `${URL_BASE}${currencyPair}/${period}/${currencyPair}-${period}-${date.format(
          'YYYY'
        )}-${date.format('MM')}.zip`;
        return url;
      });
    const results: AxiosResponse<Buffer>[] = await Promise.all(
      urls.map((url) => axios.get(url, { responseType: 'arraybuffer' }))
    );
    const unzipped = Buffer.concat(await Promise.all(results.map((r) => unzip(r.data))));
    return unzipped.toString();
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 404) {
      throw new Error(`Could not find historical data for URL: ${e.config.url}`);
    }
    throw e;
  }
}

export async function getBinanceData(
  currencyPair: string,
  period: KlinePeriod,
  startDate: Date,
  endDate: Date
): Promise<KlineData[]> {
  const data = await getRawBinanceData(currencyPair, period, startDate, endDate);
  return parse(data);
}
