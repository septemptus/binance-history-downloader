# binance-history-downloader

## Installing

```bash
yarn add binance-history-downloader
```

## Usage
This package can be used either by importing it as module when you want to plug this directly into your processing application:
```ts
import getBinanceData from 'binance-history-downloader';

// will get an array of one minute kline data for BTCUSDT between Jan and Dec 2021
const data = await getBinanceData(
  'BTCUSDT',
  '1m',
  new Date('2021-01-01'),
  new Date('2021-12-01')
);
```
Or directly through `npx` which will then ask you about the query parameters and produce a CSV file
```bash
npx binance-history-downloader@latest
✔ What currency pair to fetch? · BTCUSDT
✔ Which period should be used? · 1h
✔ What should be the start month? (YYYY-MM) · 2020-01
✔ What should be the end month? (YYYY-MM) · 2020-02
✔ What should be the filename for the csv file? · data.csv
```

## API
### getBinanceData
```ts
async function getBinanceData(
  currencyPair: string, // follows binance currency pair format
  period: KlinePeriod, // see below
  startDate: Date, // month in which to start
  endDate: Date // month in which to end
): Promise<KlineData[]>
```

### KlinePeriod
```ts
type KlinePeriod =
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
```

### KlineData
```ts
type KlineData = {
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: number;
  quoteAssetVolume: number;
  numberOfTrades: number;
  takerBuyBaseAssetVolume: number;
  takerBuyQuoteAssetVolume: number;
  ignore: boolean;
};
```