import { now, url } from '../../../support/constants/progression'

describe('Items', () => { // TODO Mind how to handle differences between devoirs and séances
  beforeEach(() => {
    cy.clock(now.toDate().getTime())

    cy.exec('npm run db:progressionReset')
    cy.clearDBCache()
    cy.login(url)
  })

  it('can create section, sub-section, item from item', () => {
    cy.log('test')
  })

  it('can update item (name)', () => {
    cy.log('test')
  })

  it('can delete item', () => {
    cy.log('test')
  })
})
