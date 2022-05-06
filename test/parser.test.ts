import { parse as csvParse } from 'async-csv';
import { parse } from '../src/parser';

jest.mock('async-csv');

beforeEach(() => {
  jest.resetAllMocks();
  (csvParse as jest.Mock).mockResolvedValue([
    [
      '1601510340000',
      '4.15070000',
      '4.15870000',
      '4.15060000',
      '4.15540000',
      '539.23000000',
      '1601510399999',
      '2240.39860900',
      '13',
      '401.82000000',
      '1669.98121300',
      '0',
    ],
  ]);
});

test('should call csv parse on the given data', async () => {
  await parse('1');
  expect(csvParse).toHaveBeenCalled();
});

test('should parse the csv entries as expected', async () => {
  const result = await parse('1');
  expect(result).toEqual([
    {
      openTime: 1601510340000,
      open: 4.1507,
      high: 4.1587,
      low: 4.1506,
      close: 4.1554,
      volume: 539.23,
      closeTime: 1601510399999,
      quoteAssetVolume: 2240.398609,
      numberOfTrades: 13,
      takerBuyBaseAssetVolume: 401.82,
      takerBuyQuoteAssetVolume: 1669.981213,
      ignore: false,
    },
  ]);
});
