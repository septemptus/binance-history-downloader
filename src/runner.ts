import { query } from './inquirer';
import { save } from './saver';
import { fetch } from './fetcher';

export async function run(): Promise<void> {
  try {
    const queryResult = await query();
    const data = await fetch(
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
