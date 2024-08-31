const path = require("path");

const buildNextEslintCommand = (filenames) => "";
const checkTypesNextCommand = () => "";

const buildHardhatEslintCommand = (filenames) => "";

module.exports = {
  "packages/nextjs/**/*.{ts,tsx}": [
    buildNextEslintCommand,
    checkTypesNextCommand,
  ],
  "packages/hardhat/**/*.{ts,tsx}": [buildHardhatEslintCommand],
};
