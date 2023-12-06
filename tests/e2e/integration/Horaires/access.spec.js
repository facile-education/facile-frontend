import { scheduleURL } from '../../support/constants/urls'
import { DOYEN, HEADMASTER, PARENT, SCHOOL_ADMIN, SECRETARY, STUDENT, TEACHER } from '../../support/constants/users'

const toolbarManagerUsers = [HEADMASTER, SCHOOL_ADMIN, DOYEN, SECRETARY]
const toolbarUsers = [TEACHER]
const noToolbarUsers = [STUDENT, PARENT]

const waitForRefresh = () => {
  cy.wait(500)
}

describe.skip('Schedule_Access', () => {
  beforeEach(() => {
    cy.fixture('schedule.json').as('scheduleData').then(data => {
      cy.clock(Cypress.dayjs(data.now, 'YYYY/MM/DD HH:mm').toDate().getTime())
    })
  })

  toolbarManagerUsers.forEach(user => {
    it('Schedule_Access_' + user.role + '_CanAccess', () => {
      cy.login(user, scheduleURL)

      cy.get('.toolbar .base-dropdown').should('be.visible')
      cy.get('.toolbar .search').should('be.visible')
      cy.get('.weekly-horizontal-timeline').should('be.visible')
      cy.get('.fc').should('be.visible')

      // Select group in the list
      cy.get('.toolbar .base-dropdown').click()
      cy.get('.base-dropdown > .base-autocomplete').should('be.visible')

      cy.contains(this.scheduleData.groupName).click()
      waitForRefresh()

      // Edit button should be visible
      cy.get('[data-cy="05-03_08:45"]').should('exist')
      cy.get('[data-cy="05-03_08:45"]').trigger('mouseover')
      cy.get('[data-cy="05-03_08:45"] .fa-pencil-alt').should('exist')
    })
  })

  toolbarUsers.forEach(user => {
    it('Schedule_Access_' + user.role + '_CanAccess', () => {
      cy.login(user, scheduleURL)

      cy.get('.toolbar .base-dropdown').should('be.visible')
      cy.get('.toolbar .search').should('be.visible')
      cy.get('.weekly-horizontal-timeline').should('be.visible')
      cy.get('.fc').should('be.visible')

      // Select group in the list
      cy.get('.toolbar .base-dropdown').click()
      cy.get('.base-dropdown > .base-autocomplete').should('be.visible')

      cy.contains(this.scheduleData.groupName).click()
      waitForRefresh()

      // Edit button should not be visible
      cy.get('[data-cy="05-03_08:45"]').should('exist')
      cy.get('[data-cy="05-03_08:45"]').trigger('mouseover')
      cy.get('[data-cy="05-03_08:45"] .fa-pencil-alt').should('not.exist')
    })
  })

  noToolbarUsers.forEach(user => {
    it('Schedule_Access_' + user.role + '_CanNotAccess', () => {
      cy.login(user, scheduleURL)

      cy.get('.toolbar .base-dropdown').should('not.exist')
      cy.get('.toolbar .search').should('not.exist')
      cy.get('.weekly-horizontal-timeline').should('be.visible')
      cy.get('.fc').should('be.visible')

      // Edit button should not be visible
      cy.get('[data-cy="05-03_08:45"]').should('exist')
      cy.get('[data-cy="05-03_08:45"]').trigger('mouseover')
      cy.get('[data-cy="05-03_08:45"] .fa-pencil-alt').should('not.exist')
    })
  })

  it('Schedule_Access_Unauthenticated_CanNotAccess', () => {
    cy.visit(scheduleURL)

    cy.get('.toolbar .base-dropdown').should('not.exist')
    cy.get('.toolbar .search').should('not.exist')
    cy.get('.weekly-horizontal-timeline').should('not.exist')
    cy.get('.fc').should('not.exist')
    cy.contains('Une authentification est requise pour accéder au service.').should('exist')
  })
})
