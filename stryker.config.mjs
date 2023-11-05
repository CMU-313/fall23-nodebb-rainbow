// @ts-check
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  _comment:
    "This config was generated using 'stryker init'. Please take a look at: https://stryker-mutator.io/docs/stryker-js/configuration/ for more information.",
  packageManager: "npm",
  reporters: ["html", "clear-text", "progress"],
  testRunner: "mocha",
  testRunner_comment:
    "Take a look at (missing 'homepage' URL in package.json) for information about the mocha plugin.",
  coverageAnalysis: "perTest",
  buildCommand: "./nodebb build",
  ignorePatterns: ["build/public/plugins", "node_modules"],
  mutate: ["src/controllers/**/*.js"],
  mochaOptions: {
      spec: [ "test/**/*.js" ],
      config: "node_modules/mocha/lib/mocharc.json",
      package: "./package.json",
      opts: "./test/mocha.opts",
      ui: "bdd",
      "async-only": false,
      grep: ".*"
    }
};
export default config;
