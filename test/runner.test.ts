import { getRawBinanceData } from '../src/fetcher';
import { query } from '../src/inquirer';
import { run } from '../src/runner';
import { save } from '../src/saver';

jest.mock('../src/fetcher');
jest.mock('../src/inquirer');
jest.mock('../src/saver');

beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
  (query as jest.Mock).mockResolvedValue({
    currencyPair: 'BTCUSDT',
    period: '1m',
    startDate: '2020-01',
    endDate: '2020-02',
    path: 'data.csv',
  });
});

test('should query', async () => {
  await run();
  expect(query).toHaveBeenCalled();
});

test('should get raw data', async () => {
  await run();
  expect(getRawBinanceData).toHaveBeenCalled();
});

test('should save the fetched data', async () => {
  await run();
  expect(save).toHaveBeenCalled();
});

test('should log exceptions', async () => {
  jest.spyOn(console, 'error').mockImplementation(() => void 0);
  (query as jest.Mock).mockRejectedValue(new Error());
  await run();
  expect(console.error).toHaveBeenCalled();
});
