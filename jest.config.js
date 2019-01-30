module.exports = {
  roots: ['./'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['<rootDir>/__tests__/**/*.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupTestFrameworkScriptFile: '<rootDir>/config/enzyme.js',
};
