const jestCoverageConfig = require('@mixmaxhq/jest-coverage-config/typescript');
const jestJunitConfig = process.env.CI && require('@mixmaxhq/jest-junit-config');

module.exports = {
  clearMocks: true,
  ...jestJunitConfig,
  ...jestCoverageConfig,
  collectCoverageFrom: ['**/*.[tj]s'],
  "coveragePathIgnorePatterns": [
        "node_modules",
        "dist",
        "jest.config.js",
        ".huskyrc.js"
    ],
};
