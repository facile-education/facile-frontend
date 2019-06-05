describe('admin general tests', () => {
  before(function () {
    // Connection
    cy.visit('/')
    cy.get(':nth-child(1) > .form-control').type('pentila')
    cy.get(':nth-child(2) > .form-control').type('pentila')
    cy.get('.btn').click()
  })
  it('check connection', () => {
    cy.url().should('include', '/tableau-de-bord')

    // deconnection
    cy.get('[data-test=togglePopoverMenu]').click()
    cy.get('[data-test=logout]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })
})
