import { now, url } from '../../support/constants/progression'

describe('desktop navigation', () => {
  beforeEach(() => {
    cy.logout()
    cy.clock(now.toDate().getTime())
    cy.login(url)

    cy.exec('npm run db:progressionReset')
  })

  it('contains slot selection', () => {
    // At the beginning (when no slot type is selected), there is no display of calendar and user selection
    cy.log('test')
  })
})
