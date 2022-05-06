import { parse as csvParse } from 'async-csv';

export type KlineData = {
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

export async function parse(data: string): Promise<KlineData[]> {
  const csv = (await csvParse(data)) as string[][];
  return csv.map((csvRow) => ({
    openTime: Number(csvRow[0]),
    open: Number(csvRow[1]),
    high: Number(csvRow[2]),
    low: Number(csvRow[3]),
    close: Number(csvRow[4]),
    volume: Number(csvRow[5]),
    closeTime: Number(csvRow[6]),
    quoteAssetVolume: Number(csvRow[7]),
    numberOfTrades: Number(csvRow[8]),
    takerBuyBaseAssetVolume: Number(csvRow[9]),
    takerBuyQuoteAssetVolume: Number(csvRow[10]),
    ignore: csvRow[11] === '1',
  }));
}
