const { defineConfig } = require('cypress')
const { rmdir, access } = require('fs').promises

// NB: To directly open the board with all specs and save time, run
// $ cypress open --browser chrome --e2e
// instead of $ cypress open

module.exports = defineConfig({
  fixturesFolder: 'tests/e2e/fixtures',
  downloadsFolder: 'tests/e2e/downloads',
  screenshotsFolder: 'tests/e2e/screenshots',
  videosFolder: 'tests/e2e/videos',
  watchForFileChanges: false,
  video: false,

  e2e: {
    baseUrl: 'https://dev-ent-gve.com',
    setupNodeEvents (on, config) {
      // bind to the event we care about
      on('task', {
        async deleteFolder (folderName) {
          console.log('deleting folder ' + folderName)
          try {
            // Check if the folder exists
            await access(folderName)
            // If the folder exists, proceed to delete
            await rmdir(folderName, { maxRetries: 10, recursive: true })
            console.log('Folder deleted successfully.')
          } catch (err) {
            // Handle the case when the folder doesn't exist
            console.warn(`Folder ${folderName} does not exist. Nothing to delete.`)
          }
          return null
        }
      })
    },
    specPattern: 'tests/e2e/**/*.spec.{js,jsx,ts,tsx}',
    // excludeSpecPattern: import.meta.env.CI ? ['tests/e2e/**/all.spec.js'] : [],
    supportFile: 'tests/e2e/support/index.js',
    experimentalRunAllSpecs: true
  },

  component: {
    supportFile: 'tests/components/support/component.js',
    indexHtmlFile: 'tests/components/support/component-index.html',
    devServer: {
      framework: 'vue',
      bundler: 'vite'
    }
  }
})
