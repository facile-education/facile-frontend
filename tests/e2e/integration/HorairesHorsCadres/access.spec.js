import { HHCURL } from '../../support/constants/urls'
import { DOYEN, HEADMASTER, PARENT, SCHOOL_ADMIN, SECRETARY, STUDENT, TEACHER } from '../../support/constants/users'

const allowedUsers = [HEADMASTER, DOYEN, SCHOOL_ADMIN, SECRETARY, TEACHER]
const disallowedUsers = [STUDENT, PARENT]

describe('Service access', () => {
  beforeEach(() => {
    cy.loadTables('schoollife/schoollife_tables.sql')
    cy.fixture('hhc.json').as('hhcData').then(data => {
      cy.clock(cy.dayjs(data.now, 'YYYY/MM/DD HH:mm').toDate().getTime())
    })
  })

  allowedUsers.forEach(user => {
    it('Displays service for ' + user.role, () => {
      cy.login(user, HHCURL)

      cy.get('.slot-type-selection').should('be.visible')
    })
  })

  disallowedUsers.forEach(user => {
    it('Displays error for ' + user.role, () => {
      cy.login(user, HHCURL)

      cy.get('.slot-type-selection').should('not.exist')
    })
  })

  it('Displays error for non authenticated user', () => {
    cy.then(Cypress.session.clearCurrentSessionData)
    cy.visit(HHCURL)

    cy.contains('Une authentification est requise pour accéder au service.').should('be.visible')
  })
})
