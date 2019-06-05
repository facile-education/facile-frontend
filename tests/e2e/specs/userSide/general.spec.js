describe('user general tests', () => {
  beforeEach(function () {
    // Connection
    cy.fixture('profiles.json').then((user) => {
      cy.visit('/')
      cy.get(':nth-child(1) > .form-control').type(user.nonAdmin.login)
      cy.get(':nth-child(2) > .form-control').type(user.nonAdmin.password)
      cy.get('.btn').click()
    })
  })

  it('check connection', () => {
    cy.url().should('include', '/tableau-de-bord')

    // deconnection
    cy.get('[data-test=togglePopoverMenu]').click()
    cy.get('[data-test=logout]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })
})
