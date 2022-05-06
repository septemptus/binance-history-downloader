import fs from 'fs';
import { save } from '../src/saver';

jest.mock('fs');
jest.mock('stream/promises');

const writeMock = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
  (fs.createWriteStream as jest.Mock).mockReturnValue({
    write: writeMock,
  });
});

test('should create a write stream in current cwd for given filename', async () => {
  const cwd = process.cwd();
  await save('test.csv', '1');
  expect(fs.createWriteStream).toHaveBeenCalledWith(`${cwd}/test.csv`);
});

test('should write on the stream', async () => {
  await save('test.csv', '1');
  expect(writeMock).toHaveBeenCalledWith('1');
});
