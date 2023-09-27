const { defineConfig } = require('cypress')

// NB: To directly open the board with all specs and save time, run
// $ cypress open --browser chrome --e2e
// instead of $ cypress open

module.exports = defineConfig({
  fixturesFolder: 'tests/e2e/fixtures',
  screenshotsFolder: 'tests/e2e/screenshots',
  videosFolder: 'tests/e2e/videos',
  watchForFileChanges: false,
  e2e: {
    baseUrl: 'https://dev-ent-gve.com',
    // setupNodeEvents (on, config) {
    //   // bind to the event we care about
    //   on('<event>', (arg1, arg2) => {
    //     // plugin stuff here
    //   })
    // },
    specPattern: 'tests/e2e/**/*.spec.{js,jsx,ts,tsx}',
    // excludeSpecPattern: import.meta.env.CI ? ['tests/e2e/**/all.spec.js'] : [],
    supportFile: 'tests/e2e/support/index.js'
  }
})
