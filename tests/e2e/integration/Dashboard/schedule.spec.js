import { dashboardURL } from '../../support/constants/urls'
import { MULTI_PARENT, MULTI_STUDENT1, MULTI_STUDENT2, STUDENT } from '../../support/constants/users'
import { getSessions, selectChild } from '../../support/utils/dashboard'

describe('Dashboard_Activity', () => {
  beforeEach(() => {
    cy.loadTables('dashboard/dashboard_tables_homework.sql')
    cy.fixture('dashboard.json').as('dashboardData')
  })

  it('Dashboard_Schedule_DisplaySessions_MultiParent_ChangeStudent_DropDown', function () {
    const SessionsDate = this.dashboardData.existingSessionsLists[0].sessionsLists[1].date
    const SessionsListStudent1 = this.dashboardData.existingSessionsLists[0].sessionsLists[1].sessions
    const SessionsListStudent2 = this.dashboardData.existingSessionsLists[0].sessionsLists[2].sessions

    // Login
    cy.login(MULTI_PARENT, dashboardURL)
    // Set date before the homework's date
    cy.clock().invoke('setSystemTime', Cypress.dayjs(SessionsDate, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    cy.get('.personal-widgets').within(() => {
      // Select first child
      selectChild(MULTI_STUDENT1.firstName, MULTI_STUDENT1.firstName)
      cy.get('[data-test="schedule-widget"]').within(() => {
        getSessions(SessionsListStudent1[0]).should('be.visible')
      })

      // Change to second child

      selectChild(MULTI_STUDENT1.firstName, MULTI_STUDENT2.firstName)
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

    // Check session's content for this date
    cy.get('[data-test="schedule-widget"]').within(() => {
      for (let i = 0; i < SessionsList.length - 1; i++) {
        getSessions(SessionsList[i]).should('be.exist')
      }
    })
  })

  it('Dashboard_Schedule_DisplaySessions_NextButton_After/Before_WeekEnd', function () {
    const fridayDate = '2023/11/10'
    // Login
    cy.login(STUDENT, dashboardURL)
    // Set date
    cy.clock().invoke('setSystemTime', Cypress.dayjs(fridayDate, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('[data-test="schedule-widget"] > header > nav').scrollIntoView().should('be.visible')
    cy.get('[data-test="schedule-widget"]').within(() => {
    // Click on button next day
      cy.get('[data-test="NextDay"]').click()
      // Check if next day is monday and not saturday
      cy.get('[data-test="date"]').should('contain', 'lun')
      // Click on previous day button
      cy.get('[data-test="PreviousDay"]').click()
      // Check if previous day is friday and not sunday
      cy.get('[data-test="date"]').should('contain', 'ven')
    })
  })

  it('Dashboard_Schedule_DisplaySessions_NextButton_After/Before_Holiday', function () {
    const holidayDate = '2023/10/20'
    // Login
    cy.login(STUDENT, dashboardURL)
    // Set date
    cy.clock().invoke('setSystemTime', Cypress.dayjs(holidayDate, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('[data-test="schedule-widget"] > header > nav').scrollIntoView().should('be.visible')
    cy.get('[data-test="schedule-widget"]').within(() => {
      // Click on button next day
      cy.get('[data-test="NextDay"]').click()
      // Check if next day is backToSchool day
      cy.get('[data-test="date"]').should('contain', '30/10')
      // Click on previous day button
      cy.get('[data-test="PreviousDay"]').click()
      // Check if previous day is last day before holiday
      cy.get('[data-test="date"]').should('contain', '20/10')
    })
  })

  it('Dashboard_Schedule_Redirect_MultiParent_Display_Good_ChildrenWork', function () {
    const SessionsDate = this.dashboardData.existingSessionsLists[0].sessionsLists[1].date

    // Login
    cy.login(MULTI_PARENT, dashboardURL)
    // Set date
    cy.clock().invoke('setSystemTime', Cypress.dayjs(SessionsDate, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    cy.get('.personal-widgets').within(() => {
      // Select first child
      selectChild(MULTI_STUDENT1.firstName, MULTI_STUDENT1.firstName)
      cy.get('[data-test="schedule-widget"]').within(() => {
        cy.get('.redirect-button').contains('Accéder au semainier').click()
      })
    })
    // Check if good children is selected
    cy.get('.nero-body').scrollTo('top')
    cy.get('.children').should('contain', MULTI_STUDENT1.firstName)

    // Change to second Child
    // Login
    cy.login(MULTI_PARENT, dashboardURL)
    // Set date before the homework's date
    cy.clock().invoke('setSystemTime', Cypress.dayjs(SessionsDate, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    cy.get('.personal-widgets').within(() => {
      // Select first child
      selectChild(MULTI_STUDENT1.firstName, MULTI_STUDENT2.firstName)
      cy.get('[data-test="schedule-widget"]').within(() => {
        cy.get('.redirect-button').contains('Accéder au semainier').click()
      })
    })
    // Check if good children is selected
    cy.get('.nero-body').scrollTo('top')
    cy.get('.children').should('contain', MULTI_STUDENT2.firstName)
  })
})
