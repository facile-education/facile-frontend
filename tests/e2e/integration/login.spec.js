import { SCHOOL_ADMIN as user } from '../support/constants'

describe('Login page', () => {
  it('logs user in with correct credentials', () => {
    // Test redirection
    cy.visit('/')
    cy.url().should('eq', Cypress.config().baseUrl + '/login')

    cy.contains('Parents / Autres profils').click()

    cy.get('input[placeholder="Identifiant"]').type(user.login)
    cy.get('input[type="password"]').type(user.password)
    cy.get('button[type="submit"]').click()

    cy.url().should('eq', Cypress.config().baseUrl + '/tableau-de-bord')
  })

  it('shows error with wrong credentials', () => {
    cy.visit('/login')
    cy.contains('Parents / Autres profils').click()

    cy.get('input[placeholder="Identifiant"]').type(user.login)
    cy.get('input[type="password"]').type(user.password + '_')
    cy.get('button[type="submit"]').click()

    cy.get('.errorMessage').should('be.visible')
  })

  it.skip('Locks account after 5 unsuccessful attempts', () => { // TODO: Need to clean DB state after
    cy.visit('/login')
    cy.contains('Parents / Autres profils').click()

    // Add a loop to simulate 5 unsuccessful login attempts
    for (let i = 0; i < 5; i++) {
      cy.get('input[placeholder="Identifiant"]').clear()
      cy.get('input[placeholder="Identifiant"]').type(user.login)
      cy.get('input[type="password"]').clear()
      cy.get('input[type="password"]').type(user.password + '_')
      cy.get('button[type="submit"]').click()

      // Check for error message after each attempt
      cy.get('.errorMessage').should('be.visible')
    }

    // After 5 attempts, check that the account is locked
    cy.get('.errorMessage').should('contain', 'Votre compte est bloqué')
  })
})
