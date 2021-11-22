import { now, url } from '../../../support/constants/progression'

describe('Progression creation', () => {

  beforeEach(() => {
    cy.clock(now.toDate().getTime())

    cy.exec('npm run db:progressionReset') // TODO pass arg to script to load a particular .db file (to load an empty progression dump)
    cy.clearDBCache()
    cy.login(url)
  })

  it('Test placeholder, and section creation', () => {
    cy.log('test')

    // Once the section will created, test if the section is selected by default when we load the view
  })
})
