import { url } from '../../support/constants/groups'
import { HEADMASTER } from '../../support/constants'

describe('Group list', () => {
  before(() => {
    cy.login(url, HEADMASTER)
  })

  it('Test group List interface (desktop)', () => {
    // TODO test group list length when we finish to add groups for tests
    cy.contains('[data-test=group-item]', 'groupTest').should('exist')

    // TODO test filter
  })
})
