#!/usr/bin/env node

import { getBinanceData } from './fetcher';
import { run } from './runner';

if (require.main === module) {
  run();
}

export default getBinanceData;
