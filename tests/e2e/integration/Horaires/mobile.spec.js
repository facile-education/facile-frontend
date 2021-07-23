// https://docs.cypress.io/api/introduction/api.html

describe('Desktop tests', () => {
  beforeEach(() => {
    const now = new Date(Date.UTC(2021, 4, 5)).getTime()
    cy.clock(now)
    cy.connection('/nero/horaires')
  })

  it('Check initial view', () => {
    cy.get('.toolbar .base-dropdown').should('be.visible')
    cy.get('.toolbar .search .base-input').should('be.visible')
    cy.get('.weekly-horizontal-timeline').should('be.visible')
    cy.get('.fc').should('be.visible')

    // cy.get('iframe').should('be.visible')
  })
})
