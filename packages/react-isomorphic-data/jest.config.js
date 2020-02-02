const transformers = {
  '\\.(js|jsx|ts|tsx)$': '<rootDir>/babelJestTransformer.js',
};

const config = {
  transform: transformers,
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(ts|js)?(x)',
    '<rootDir>/src/**/?(*.)(spec|test).(ts|js)?(x)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/__tests__/*.{js,jsx,ts,tsx}'
  ],
  setupFiles: ['<rootDir>/src/setupTests.ts'],
  projects: [
    {
      displayName: 'Core',
      testMatch: [
        '<rootDir>/src/common/**/__tests__/*.test.{ts,tsx}',
        '<rootDir>/src/hoc/**/__tests__/*.test.{ts,tsx}',
        '<rootDir>/src/hooks/**/__tests__/*.test.{ts,tsx}',
        '<rootDir>/src/utils/**/__tests__/*.test.{ts,tsx}',
      ],
      setupFiles: ['<rootDir>/src/setupTests.ts'],
      transform: transformers,
    },
    {
      displayName: 'Server-side rendering utilities tests',
      testMatch: ['<rootDir>/src/ssr/**/__tests__/*.test.{ts,tsx}'],
      testEnvironment: 'node',
      transform: transformers,
      setupFiles: ['<rootDir>/src/setupTests.ts'],
    },
  ],
};

module.exports = config;

