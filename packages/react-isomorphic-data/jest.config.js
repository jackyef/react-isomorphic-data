const config = {
  transform: {
    '\\.(js|jsx|ts|tsx)$': '<rootDir>/babelJestTransformer.js',
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(ts|js)?(x)',
    '<rootDir>/src/**/?(*.)(spec|test).(ts|js)?(x)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
  // setupFiles: ['<rootDir>/src/setupTests.ts'],
};

module.exports = config;
