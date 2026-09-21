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
    '^@quatrain/ux-taxonomy$': '<rootDir>/packages/ux-taxonomy/src/index.ts',
    '^@quatrain/ux-dropzone$': '<rootDir>/packages/ux-dropzone/src/index.ts',
    '^@quatrain/ux-curation$': '<rootDir>/packages/ux-curation/src/index.ts'
  }
};
