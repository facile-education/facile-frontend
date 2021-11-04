// https://docs.cypress.io/api/introduction/api.html

import { HEADMASTER, TEACHER, DOYEN, SECRETARY ,STUDENT, PARENT } from '../../support/constants'
import { now, url, groupName } from '../../support/constants/horaires'

const toolbarManagerUsers = [HEADMASTER, DOYEN, SECRETARY]
const toolbarUsers = [TEACHER]
const noToolbarUsers = [STUDENT, PARENT]

const waitForRefresh = () => {
  cy.wait(500)
}

describe('Service access', () => {
  beforeEach(() => {
    cy.logout()
    cy.clock(now.toDate().getTime())
  })

  toolbarManagerUsers.forEach(user => {
    it('Displays service for ' + user.role, () => {
      cy.login(url, user)

      cy.get('.toolbar .base-dropdown').should('be.visible')
      cy.get('.toolbar .search .base-input').should('be.visible')
      cy.get('.weekly-horizontal-timeline').should('be.visible')
      cy.get('.fc').should('be.visible')

      // Select group in the list
      cy.get('.toolbar .base-dropdown').click()
      cy.get('.base-dropdown > .base-autocomplete').should('be.visible')

      cy.contains(groupName).click()
      waitForRefresh()

      // Edit button should be visible
      cy.get('[data-cy="05-03_08:45"]').should('exist')
      cy.get('[data-cy="05-03_08:45"] .fa-pencil-alt').should('exist')
    })
  })

  toolbarUsers.forEach(user => {
    it('Displays service for ' + user.role, () => {
      cy.login(url, user)

      cy.get('.toolbar .base-dropdown').should('be.visible')
      cy.get('.toolbar .search .base-input').should('be.visible')
      cy.get('.weekly-horizontal-timeline').should('be.visible')
      cy.get('.fc').should('be.visible')

      // Select group in the list
      cy.get('.toolbar .base-dropdown').click()
      cy.get('.base-dropdown > .base-autocomplete').should('be.visible')

      cy.contains(groupName).click()
      waitForRefresh()

      // Edit button should not be visible
      cy.get('[data-cy="05-03_08:45"]').should('exist')
      cy.get('[data-cy="05-03_08:45"] .fa-pencil-alt').should('not.exist')
    })
  })

  noToolbarUsers.forEach(user => {
    it('Displays error for ' + user.role, () => {
      cy.login(url, user)

      cy.get('.toolbar .base-dropdown').should('not.exist')
      cy.get('.toolbar .search .base-input').should('not.exist')
      cy.get('.weekly-horizontal-timeline').should('be.visible')
      cy.get('.fc').should('be.visible')

      // Edit button should not be visible
      cy.get('[data-cy="05-03_08:45"]').should('exist')
      cy.get('[data-cy="05-03_08:45"] .fa-pencil-alt').should('not.exist')
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
