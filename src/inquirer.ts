import { prompt } from 'enquirer';
import moment from 'moment';
import { KlinePeriod } from './fetcher';

export type RequestParams = {
  currencyPair: string;
  period: KlinePeriod;
  startDate: Date;
  endDate: Date;
  path: string;
};

export async function query(): Promise<RequestParams> {
  const input = await prompt<RequestParams>([
    { type: 'input', name: 'currencyPair', message: 'What currency pair to fetch?' },
    {
      type: 'select',
      name: 'period',
      message: 'Which period should be used?',
      choices: [
        { name: '1m', value: '1m' },
        { name: '3m', value: '3m' },
        { name: '5m', value: '5m' },
        { name: '15m', value: '15m' },
        { name: '30m', value: '30m' },
        { name: '1h', value: '1h' },
        { name: '2h', value: '2h' },
        { name: '4h', value: '4h' },
        { name: '6h', value: '6h' },
        { name: '8h', value: '8h' },
        { name: '12h', value: '12h' },
        { name: '1d', value: '1d' },
        { name: '3d', value: '3d' },
        { name: '1w', value: '1w' },
        { name: '1mo', value: '1mo' },
      ],
    },
    {
      type: 'input',
      name: 'startDate',
      message: 'What should be the start month? (YYYY-MM)',
      validate: (value) => moment(value, 'YYYY-MM').isValid(),
    },
    {
      type: 'input',
      name: 'endDate',
      message: 'What should be the end month? (YYYY-MM)',
      validate: (value) => moment(value, 'YYYY-MM').isValid(),
    },
    {
      type: 'input',
      name: 'path',
      message: 'What should be the filename for the csv file?',
      initial: 'data.csv',
    },
  ]);
  return {
    ...input,
    startDate: moment(input.startDate, 'YYYY-MM').toDate(),
    endDate: moment(input.endDate, 'YYYY-MM').toDate(),
  };
}
