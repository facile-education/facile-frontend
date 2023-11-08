module.exports = {
  plugins: [
    'cypress'
  ],
  env: {
    mocha: true,
    'cypress/globals': true
  },
  extends: [
    'plugin:cypress/recommended'
  ],
  rules: {
    strict: 'off'
    // 'cypress/no-assigning-return-values': 'error',
    // 'cypress/no-unnecessary-waiting': 'error'
    // 'cypress/assertion-before-screenshot': 'warn',
    // 'cypress/no-force': 'warn',
    // 'cypress/no-async-tests': 'error',
    // 'cypress/no-pause': 'error'
  }
}
