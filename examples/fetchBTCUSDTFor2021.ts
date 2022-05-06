import { getBinanceData } from '../src/fetcher';

/*
  This will fetch parsed kline data for BTCUSDT in 24 hours klines starting from January 2021 ending in December 2021
*/
export default async function fetchBTCUSDTFor2021(): Promise<void> {
  const data = await getBinanceData(
    'BTCUSDT',
    '1d',
    new Date('2021-01-01'),
    new Date('2021-12-01')
  );

  data.forEach((kline) => {
    console.log(kline.open, kline.close);
  });
}
