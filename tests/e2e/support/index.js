// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
// Alternatively you can use CommonJS syntax:
// require('./commands')
import './commands'

// Dayjs global import
import fr from 'dayjs/locale/fr'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'

const dayjs = require('dayjs')

dayjs.extend(LocalizedFormat)
dayjs.locale(fr)

Cypress.dayjs = dayjs
