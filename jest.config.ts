import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  coveragePathIgnorePatterns: ['index.ts', 'examples'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testPathIgnorePatterns: ['dist'],
};
export default config;
