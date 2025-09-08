module.exports = {
  default: {
    paths: ['src/tests/*.feature'],
    require: ['src/tests/steps/*.ts'],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'json:test-results/cucumber-report.json',
      'html:test-results/cucumber-report.html'
    ],
    parallel: 1,
    publishQuiet: true
  }
};