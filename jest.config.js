module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/packages/**/*.test.ts', '**/packages/**/*.test.tsx'],
  modulePathIgnorePatterns: ['/dist/'],
  moduleNameMapper: {
    '^@quatrain/ux$': '<rootDir>/packages/ux/src/index.ts',
    '^@quatrain/ux-list$': '<rootDir>/packages/ux-list/src/index.ts',
    '^@quatrain/ux-list-react$': '<rootDir>/packages/ux-list-react/src/index.ts',
    '^@quatrain/ux-form-react$': '<rootDir>/packages/ux-form-react/src/index.ts',
    '^@quatrain/core$': '<rootDir>/../Core/packages/core/src/index.ts',
    '^@quatrain/types$': '<rootDir>/../Core/packages/types/src/index.ts',
    '^@quatrain/i18n$': '<rootDir>/../Core/packages/i18n/src/index.ts',
    '^@quatrain/i18n-en$': '<rootDir>/../Core/packages/i18n-en/src/index.ts',
    '^@quatrain/i18n-fr$': '<rootDir>/../Core/packages/i18n-fr/src/index.ts',
    '^@quatrain/log$': '<rootDir>/../Core/packages/log/src/index.ts'
  }
};
