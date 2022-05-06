import { getBinanceData } from './fetcher';
import { query } from './inquirer';
import { save } from './saver';

export async function run(): Promise<void> {
  try {
    const queryResult = await query();
    const data = await getBinanceData(
      queryResult.currencyPair,
      queryResult.period,
      queryResult.startDate,
      queryResult.endDate
    );
    await save(queryResult.path, data);
  } catch (e) {
    console.error(e);
  }
}
