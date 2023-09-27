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
})
