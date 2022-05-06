import { parse as csvParse } from 'async-csv';

export async function parse(data: Buffer): Promise<string[][]> {
  return (await csvParse(data.toString())) as string[][];
}
