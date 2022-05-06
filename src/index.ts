#!/usr/bin/env node

import { fetch, KlinePeriod } from './fetcher';
import { parse } from './parser';
import { run } from './runner';

if (require.main === module) {
  run();
}

export default async function getBinanceData(
  currencyPair: string,
  period: KlinePeriod,
  startDate: Date,
  endDate: Date
): Promise<string[][]> {
  const data = await fetch(currencyPair, period, startDate, endDate);
  return parse(data);
}
