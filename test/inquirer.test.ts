import { prompt } from 'enquirer';
import moment from 'moment';
import { query } from '../src/inquirer';

jest.mock('enquirer', () => ({
  prompt: jest.fn(),
}));
jest.mock('../src/fetcher');

beforeEach(() => {
  jest.resetAllMocks();
  (prompt as jest.Mock).mockResolvedValue({
    currencyPair: 'BTCUSDT',
    period: '1m',
    startDate: '2020-01',
    endDate: '2020-02',
    path: 'data.csv',
  });
});

test('should call enquirer prompt with question for currency pair', async () => {
  await query();
  const prompts = (prompt as jest.Mock).mock.calls[0][0];
  expect(
    !!prompts.find(
      (p: { message: string }) => p.message === 'What currency pair to fetch? (e.g. BTCUSDT)'
    )
  ).toBe(true);
});

test('should call enquirer prompt with question for period', async () => {
  await query();
  const prompts = (prompt as jest.Mock).mock.calls[0][0];
  expect(
    !!prompts.find((p: { message: string }) => p.message === 'Which period should be used?')
  ).toBe(true);
});

test('should call enquirer prompt with question for start date', async () => {
  await query();
  const prompts = (prompt as jest.Mock).mock.calls[0][0];
  expect(
    !!prompts.find(
      (p: { message: string }) => p.message === 'What should be the start month? (YYYY-MM)'
    )
  ).toBe(true);
});

test('should call enquirer prompt with question for end date', async () => {
  await query();
  const prompts = (prompt as jest.Mock).mock.calls[0][0];
  expect(
    !!prompts.find(
      (p: { message: string }) => p.message === 'What should be the end month? (YYYY-MM)'
    )
  ).toBe(true);
});

test('should validate start date format', async () => {
  await query();
  const prompts = (prompt as jest.Mock).mock.calls[0][0];
  const startDatePrompt = prompts.find(
    (p: { message: string }) => p.message === 'What should be the start month? (YYYY-MM)'
  );
  expect(startDatePrompt.validate).toBeDefined();
  expect(startDatePrompt.validate('bad')).toBe(false);
  expect(startDatePrompt.validate('2020-01')).toBe(true);
});

test('should validate end date format', async () => {
  await query();
  const prompts = (prompt as jest.Mock).mock.calls[0][0];
  const startDatePrompt = prompts.find(
    (p: { message: string }) => p.message === 'What should be the end month? (YYYY-MM)'
  );
  expect(startDatePrompt.validate).toBeDefined();
  expect(startDatePrompt.validate('bad')).toBe(false);
  expect(startDatePrompt.validate('2020-01')).toBe(true);
});

test('should convert start date to date', async () => {
  expect((await query()).startDate).toEqual(moment('2020-01-01').toDate());
});

test('should convert end date to date', async () => {
  expect((await query()).endDate).toEqual(moment('2020-02-01').toDate());
});
