import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  coveragePathIgnorePatterns: ['index.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
export default config;
