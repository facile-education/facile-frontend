import { HEADMASTER as user } from '../support/constants'

describe('Authentification tests', () => {
  it('logs user in with correct credentials', () => {
    cy.visit('/')
    cy.get('.guest-connect > span').click()

    cy.get('#guest_connection').within(() => {
      cy.get('#fm1 > [type="text"]').type(user.login)
      cy.get('#fm1 > [type="password"]').type(user.password)
      cy.get('#fm1').submit()
    })

    cy.url().should('eq', Cypress.config().baseUrl + '/user/didiosa/nero#/tableau-de-bord')

    // TODO logout
  })

  it.skip('shows error with wrong credentials', () => {
    // TODO request with bad login/password

    cy.url().should('not.eq', Cypress.config().baseUrl + '/user/didiosa/nero#/tableau-de-bord')
  })
})
