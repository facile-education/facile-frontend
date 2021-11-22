import { now, url } from '../../support/constants/progression'

describe('desktop navigation', () => {
  beforeEach(() => {
    cy.clock(now.toDate().getTime())

    cy.exec('npm run db:loadTables progression_tables.sql')
    cy.clearDBCache()
    cy.login(url)
  })

  it('contains expected data after DB reset', () => {
    cy.contains('Ma progression d\'allemand')
  })
})
