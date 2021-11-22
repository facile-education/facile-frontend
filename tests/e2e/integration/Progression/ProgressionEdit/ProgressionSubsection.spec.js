import { now, url } from '../../../support/constants/progression'
import { GLOBAL_ADMIN } from '../../../support/constants'

describe('Sub-section', () => {
  beforeEach(() => {
    cy.logout()
    cy.clock(now.toDate().getTime())
    cy.login('/', GLOBAL_ADMIN)

    cy.exec('npm run db:progressionReset')
    cy.clearDBCache()

    cy.login(url)
  })

  it('can create section, sub-section, item from sub-section', () => {
    cy.log('test')
  })

  it('can update sub-section (name)', () => {
    cy.log('test')
  })

  it('can delete sub-section', () => {
    cy.log('test')
  })
})
