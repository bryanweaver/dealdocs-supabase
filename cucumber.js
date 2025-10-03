export default {
  default: {
    paths: ['src/tests/*.feature'],
    import: ['src/tests/steps/**/*.ts'],
    loader: ['ts-node/esm'],
    format: [
      'progress-bar',
      'json:test-results/cucumber-report.json',
      'html:test-results/cucumber-report.html'
    ],
    parallel: 1
  }
};