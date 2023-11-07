import { dashboardURL } from '../../support/constants/urls'
import { MULTI_PARENT, MULTI_STUDENT1, MULTI_STUDENT2, STUDENT } from '../../support/constants/users'
import { getSessions } from '../../support/utils/dashboard'

describe('Dashboard_Activity', () => {
  beforeEach(() => {
    cy.loadTables('dashboard/dashboard_tables_homework.sql')
    cy.fixture('dashboard.json').as('dashboardData')
  })

  it('Dashboard_Schedule_DisplaySessions_MultiParent_ChangeStudent_DropDown', function () {
    const SessionsDate = this.dashboardData.existingSessionsLists[0].sessionsLists[1].date
    const existingHomework = this.dashboardData.existingHomework
    const SessionsListStudent1 = this.dashboardData.existingSessionsLists[0].sessionsLists[1].sessions
    const SessionsListStudent2 = this.dashboardData.existingSessionsLists[0].sessionsLists[2].sessions

    // Login
    cy.login(MULTI_PARENT, dashboardURL)
    // Set date before the homework's date
    cy.clock().invoke('setSystemTime', Cypress.dayjs(SessionsDate, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    cy.get('.personal-widgets').within(() => {
      // Select first child
      cy.contains('button', existingHomework[2].student).click()
      cy.get('.suggestion-list').within(() => {
        cy.contains('li', existingHomework[2].student).click()
      })
      cy.get('[data-test="schedule-widget"]').within(() => {
        getSessions(SessionsListStudent1[0]).should('be.visible')
      })

      // Change to second child

      cy.contains('button', existingHomework[2].student).click()
      cy.get('.suggestion-list').within(() => {
        cy.contains('li', existingHomework[3].student).click()
      })
      cy.get('[data-test="schedule-widget"]').within(() => {
        getSessions(SessionsListStudent2[0]).should('be.visible')
      })
    })
  })

  it('Dashboard_Schedule_DisplaySessions_Verify_Content', function () {
    const SessionsDate = this.dashboardData.existingSessionsLists[0].sessionsLists[0].date
    const SessionsList = this.dashboardData.existingSessionsLists[0].sessionsLists[0].sessions
    // Login
    cy.login(STUDENT, dashboardURL)
    // Set date
    cy.clock().invoke('setSystemTime', Cypress.dayjs(SessionsDate, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('[data-test="schedule-widget"] > header > nav').scrollIntoView().should('be.visible')

    cy.get('[data-test="schedule-widget"]').within(() => {
      for (let i = 0; i < SessionsList.length - 1; i++) {
        getSessions(SessionsList[i]).should('be.exist')
      }
    })
  })
})
