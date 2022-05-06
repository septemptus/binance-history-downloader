import axios from 'axios';
import yauzl from 'yauzl';
import { getBinanceData } from '../src/fetcher';
import { parse } from '../src/parser';

jest.mock('axios');
jest.mock('yauzl', () => ({
  fromBuffer: jest.fn(),
}));
jest.mock('../src/parser');

const openReadStreamMock = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
  (axios.get as jest.Mock).mockResolvedValue({ data: Buffer.from('1') });
  (yauzl.fromBuffer as jest.Mock).mockImplementation((_buffer, _options, callback) => {
    callback(null, {
      readEntry: jest.fn(),
      openReadStream: openReadStreamMock,
      on: jest.fn().mockImplementation((_eventType, callback) => {
        callback({});
      }),
    });
  });
  openReadStreamMock.mockImplementation((_entry, callback) => {
    callback(null, {
      on: jest.fn().mockImplementation((_eventType, callback) => {
        callback(Buffer.from('1'));
      }),
    });
  });
});

test('should send request for each month in range', async () => {
  await getBinanceData('BTCUSDT', '1m', new Date('2020-01-01'), new Date('2020-02-01'));
  expect(axios.get).toHaveBeenCalledTimes(2);
});

test('should call proper URL', async () => {
  await getBinanceData('BTCUSDT', '1m', new Date('2020-01-01'), new Date('2020-01-01'));
  expect((axios.get as jest.Mock).mock.calls[0][0]).toEqual(
    'https://data.binance.vision/data/spot/monthly/klines/BTCUSDT/1m/BTCUSDT-1m-2020-01.zip'
  );
});

test('should ensure that data is in ascending order by timestamp', async () => {
  (axios.get as jest.Mock).mockImplementation((url: string) => ({
    data: Buffer.from(url.endsWith('2020-01.zip') ? '1' : '2'),
  }));
  await getBinanceData('BTCUSDT', '1m', new Date('2020-01-01'), new Date('2020-02-01'));
  expect((yauzl.fromBuffer as jest.Mock).mock.calls[0][0]).toEqual(Buffer.from('1'));
  expect((yauzl.fromBuffer as jest.Mock).mock.calls[1][0]).toEqual(Buffer.from('2'));
});

test('should unzip the contents', async () => {
  await getBinanceData('BTCUSDT', '1m', new Date('2020-01-01'), new Date('2020-02-01'));
  expect(yauzl.fromBuffer).toHaveBeenCalled();
});

test('should call parse on data', async () => {
  await getBinanceData('BTCUSDT', '1m', new Date('2020-01-01'), new Date('2020-02-01'));
  expect(parse).toHaveBeenCalled();
});

test('should throw if there is an issue with buffer', async () => {
  (yauzl.fromBuffer as jest.Mock).mockImplementation((_buffer, _options, callback) => {
    callback(new Error('buffer issue'));
  });

  await expect(
    getBinanceData('BTCUSDT', '1m', new Date('2020-01-01'), new Date('2020-02-01'))
  ).rejects.toThrow(new Error('buffer issue'));
});

test('should throw if there is an issue with read stream', async () => {
  openReadStreamMock.mockImplementation((_entry, callback) => {
    callback(new Error('read stream issue'));
  });

  await expect(
    getBinanceData('BTCUSDT', '1m', new Date('2020-01-01'), new Date('2020-02-01'))
  ).rejects.toThrow(new Error('read stream issue'));
});

test('should throw if axios returns 404', async () => {
  (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);
  (axios.get as jest.Mock).mockRejectedValue({
    response: { status: 404 },
    config: { url: '123' },
  });
  await expect(
    getBinanceData('BTCUSDT', '1m', new Date('2020-01-01'), new Date('2020-01-01'))
  ).rejects.toThrow(new Error('Could not find historical data for URL: 123'));
});

test('should throw if end date is before start date', async () => {
  await expect(
    getBinanceData('BTCUSDT', '1m', new Date('2020-02-01'), new Date('2020-01-01'))
  ).rejects.toThrow(new Error('End date is set before start date'));
});
