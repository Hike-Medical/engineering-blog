const baseConfig = require('../../.prettierrc.js');

/** @type {import("prettier").Config} */
const config = {
  ...baseConfig,
  plugins: ['prettier-plugin-tailwindcss']
};

module.exports = config;
