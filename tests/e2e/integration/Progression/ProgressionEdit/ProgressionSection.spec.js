import { now, url } from '../../../support/constants/progression'

describe('Section', () => {
  beforeEach(() => {
    cy.clock(now.toDate().getTime())

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
