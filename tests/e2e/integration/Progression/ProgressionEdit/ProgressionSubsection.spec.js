import { now, url } from '../../../support/constants/progression'

describe('Sub-section', () => {
  beforeEach(() => {
    cy.clock(now.toDate().getTime())

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
