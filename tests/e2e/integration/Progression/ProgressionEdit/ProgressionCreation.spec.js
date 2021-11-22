import { now, url } from '../../../support/constants/progression'
import { GLOBAL_ADMIN } from '../../../support/constants'

describe('Progression creation', () => {
  beforeEach(() => {
    cy.logout()
    cy.clock(now.toDate().getTime())
    cy.login('/', GLOBAL_ADMIN)

    cy.exec('npm run db:progressionReset') // TODO pass arg to script to load a particular .db file (to load an empty progression dump)
    cy.clearDBCache()

    cy.login(url)
  })

  it('Test placeholder, and section creation', () => {
    cy.log('test')

    // Once the section will created, test if the section is selected by default when we load the view
  })
})
