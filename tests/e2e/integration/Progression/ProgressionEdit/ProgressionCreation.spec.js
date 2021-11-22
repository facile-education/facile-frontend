import { now, url } from '../../../support/constants/progression'

describe('Progression creation', () => {
  beforeEach(() => {
    cy.clock(now.toDate().getTime())

    cy.exec('npm run db:loadTables progression_tables_empty.sql')
    cy.clearDBCache()
    cy.login(url)
  })

  it('Test placeholder, and section creation', () => {
    cy.log('test')

    // Once the section will created, test if the section is selected by default when we load the view
  })
})
