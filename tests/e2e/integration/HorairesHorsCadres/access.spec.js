import { HEADMASTER, TEACHER, STUDENT, PARENT, SCHOOL_ADMIN, DOYEN, SECRETARY } from '../../support/constants'
import { now, url } from './constants'

const allowedUsers = [HEADMASTER, DOYEN, SCHOOL_ADMIN, SECRETARY, TEACHER]
const disallowedUsers = [STUDENT, PARENT]

describe('Service access', () => {
  beforeEach(() => {
    cy.logout()
    cy.clock(now.toDate().getTime())
  })

  allowedUsers.forEach(user => {
    it('Displays service for ' + user.role, () => {
      cy.login(url, user)

      cy.get('.slot-type-selection').should('be.visible')
    })
  })

  disallowedUsers.forEach(user => {
    it('Displays error for ' + user.role, () => {
      cy.login(url, user)

      cy.get('.slot-type-selection').should('not.exist')
    })
  })

  it('Displays error for non authenticated user', () => {
    cy.visit(url)

    cy.contains('Une authentification est requise pour accéder au service.').should('be.visible')
  })
})
