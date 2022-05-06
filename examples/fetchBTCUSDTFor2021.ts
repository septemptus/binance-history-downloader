import { getBinanceData } from '../src/fetcher';
import { KlineData } from '../src/parser';

/*
  This will fetch parsed kline data for BTCUSDT in 24 hours klines starting from January 2021 ending in December 2021
*/
export default async function fetchBTCUSDTFor2021(): Promise<KlineData[]> {
  return await getBinanceData('BTCUSDT', '1d', new Date('2021-01-01'), new Date('2021-12-01'));
}
