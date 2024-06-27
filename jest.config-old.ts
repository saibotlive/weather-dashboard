export default {
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
  moduleNameMapper: {
    '^@testing-library/react$': '<rootDir>/node_modules/@testing-library/react',
    '^@testing-library/jest-dom$': '<rootDir>/node_modules/@testing-library/jest-dom',
  },
};
