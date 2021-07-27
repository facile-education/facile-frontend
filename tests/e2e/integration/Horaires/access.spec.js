// https://docs.cypress.io/api/introduction/api.html

import { HEADMASTER, TEACHER, STUDENT, PARENT } from '../../support/constants'
import { now, url } from './constants'

const allowedUsers = [HEADMASTER, TEACHER]
const disallowedUsers = [STUDENT, PARENT]

describe('Service access', () => {
  beforeEach(() => {
    cy.logout()
    cy.clock(now.toDate().getTime())
  })

  allowedUsers.forEach(user => {
    it('Displays service for ' + user.role, () => {
      cy.login(url, user)

      cy.get('.toolbar .base-dropdown').should('be.visible')
      cy.get('.toolbar .search .base-input').should('be.visible')
      cy.get('.weekly-horizontal-timeline').should('be.visible')
      cy.get('.fc').should('be.visible')
    })
  })

  disallowedUsers.forEach(user => {
    it('Displays error for ' + user.role, () => {
      cy.login(url, user)

      cy.get('.toolbar .base-dropdown').should('not.exist')
      cy.get('.toolbar .search .base-input').should('not.exist')
      cy.get('.weekly-horizontal-timeline').should('not.exist')
      cy.get('.fc').should('not.exist')
      cy.contains('Vous ne possédez pas les droits requis pour accéder à ce service.').should('exist')
    })
  })

  it('Displays error for non authenticated user', () => {
    cy.visit(url)

    cy.get('.toolbar .base-dropdown').should('not.exist')
    cy.get('.toolbar .search .base-input').should('not.exist')
    cy.get('.weekly-horizontal-timeline').should('not.exist')
    cy.get('.fc').should('not.exist')
    cy.contains('Une authentification est requise pour accéder au service.').should('exist')
  })
})
