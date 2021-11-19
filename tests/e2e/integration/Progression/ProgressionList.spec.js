import { now, url } from '../../support/constants/progression'
import { GLOBAL_ADMIN } from '../../support/constants'

describe('desktop navigation', () => {
  beforeEach(() => {
    cy.logout()
    cy.clock(now.toDate().getTime())
    cy.login('/', GLOBAL_ADMIN)

    cy.exec('npm run db:progressionReset')
    cy.clearDBCache()

    cy.login(url)
  })

  it('contains slot selection', () => {
    // At the beginning (when no slot type is selected), there is no display of calendar and user selection
    cy.reload()
    cy.log('test')
  })
})
