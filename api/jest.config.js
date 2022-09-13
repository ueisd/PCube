module.exports = {
  preset: 'ts-jest',
  collectCoverageFrom: ['**/*.{js,jsx,ts}', '!**/node_modules/**', '!**/vendor/**'],
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
};
