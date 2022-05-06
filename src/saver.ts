import fs from 'fs';
import path from 'path';
import { finished } from 'stream/promises';

export async function save(fileName: string, data: string): Promise<void> {
  const stream = fs.createWriteStream(path.join(process.cwd(), fileName));
  stream.write(data);
  await finished(stream);
}
