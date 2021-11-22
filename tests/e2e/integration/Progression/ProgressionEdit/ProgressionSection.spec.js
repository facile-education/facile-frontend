import { now, url } from '../../../support/constants/progression'
import { GLOBAL_ADMIN } from '../../../support/constants'

describe('Section', () => {
  beforeEach(() => {
    cy.logout()
    cy.clock(now.toDate().getTime())
    cy.login('/', GLOBAL_ADMIN)

    cy.exec('npm run db:progressionReset')
    cy.clearDBCache()

    cy.login(url)
  })

  it('can create section, sub-section, item from section', () => {
    cy.log('test')
  })

  it('can update section (name)', () => {
    cy.log('test')
  })

  it('can delete section', () => {
    cy.log('test')
  })
})
