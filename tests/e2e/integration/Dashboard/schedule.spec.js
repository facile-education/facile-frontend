import { dashboardURL } from '../../support/constants/urls'
import { MULTI_PARENT, MULTI_STUDENT1, MULTI_STUDENT2, STUDENT } from '../../support/constants/users'
import { getSessions, selectChild } from '../../support/utils/dashboard'

describe('Dashboard_Schedule', () => {
  beforeEach(() => {
    cy.fixture('dashboard.json').as('dashboardData').then(data => {
      cy.clock(Cypress.dayjs(data.existingSessionsLists[0].sessionsLists[1].date, 'YYYY/MM/DD HH:mm').toDate().getTime())
    })
  })

  it('Dashboard_Schedule_DisplaySessionsMultiParentChangeStudentDropDown', function () {
    const sessionsListStudent1 = this.dashboardData.existingSessionsLists[0].sessionsLists[1].sessions
    const sessionsListStudent2 = this.dashboardData.existingSessionsLists[0].sessionsLists[2].sessions

    // Login
    cy.login(MULTI_PARENT, dashboardURL)

    cy.get('.personal-widgets').within(() => {
      // Select first child
      selectChild(MULTI_STUDENT1.firstName, MULTI_STUDENT1.firstName)
      cy.get('[data-test="schedule-widget"]').within(() => {
        getSessions(sessionsListStudent1[0]).should('be.visible')
      })

      // Change to second child

      selectChild(MULTI_STUDENT1.firstName, MULTI_STUDENT2.firstName)
      cy.get('[data-test="schedule-widget"]').within(() => {
        getSessions(sessionsListStudent2[0]).should('be.visible')
      })
    })
  })

  it('Dashboard_Schedule_DisplaySessionsVerifyContent', function () {
    const sessionsList = this.dashboardData.existingSessionsLists[0].sessionsLists[0].sessions
    // Login
    cy.login(STUDENT, dashboardURL)
    cy.get('[data-test="schedule-widget"]').scrollIntoView()
    cy.get('[data-test="schedule-widget"]').should('be.visible')

    // Check session's content for this date
    cy.get('[data-test="schedule-widget"]').within(() => {
      for (let i = 0; i < sessionsList.length - 1; i++) {
        cy.get('.schedule-item').eq(i).should('contain', sessionsList[i].name)
        getSessions(sessionsList[i]).should('be.exist')
      }
    })
  })

  it('Dashboard_Schedule_Navigation', function () {
    const sessionsListCurrentDay = this.dashboardData.existingSessionsLists[0].sessionsLists[0].sessions
    const sessionsListNextDay = this.dashboardData.existingSessionsLists[0].sessionsLists[3].sessions
    // Login
    cy.login(STUDENT, dashboardURL)
    cy.get('[data-test="schedule-widget"]').scrollIntoView()
    cy.get('[data-test="schedule-widget"]').should('be.visible').within(() => {
      getSessions(sessionsListCurrentDay[0]).should('be.exist')
      // Click on button next day
      cy.get('[data-test="NextDay"]').click()
      getSessions(sessionsListNextDay[0]).should('be.exist')
    })
  })

  it('Dashboard_Schedule_DisplaySessionsGoForward', function () {
    const sessionDate = this.dashboardData.existingSessionsLists[0].sessionsLists[1].date
    const holydayStart = this.dashboardData.holydayStart
    const holydayEnd = this.dashboardData.holydayEnd
    // Login
    cy.login(STUDENT, dashboardURL)
    // Set date
    cy.clock().invoke('setSystemTime', Cypress.dayjs(sessionDate, 'YYYY/MM/DD').day(5).toDate().getTime()) // To put after login to make it works
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

    // Login
    cy.login(STUDENT, dashboardURL)
    // Set date
    cy.clock().invoke('setSystemTime', Cypress.dayjs('2023/10/20', 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('[data-test="schedule-widget"] > header > nav').scrollIntoView().should('be.visible')
    cy.get('[data-test="schedule-widget"]').within(() => {
      // Click on button next day
      cy.get('[data-test="NextDay"]').click()
      // Check if next day is backToSchool day
      cy.get('[data-test="date"]').should('contain', holydayEnd)
      // Click on previous day button
      cy.get('[data-test="PreviousDay"]').click()
      // Check if previous day is last day before holiday
      cy.get('[data-test="date"]').should('contain', holydayStart)
    })
  })

  it('Dashboard_Schedule_Redirect_MultiParent_Display_Good_ChildrenWork', function () {
    // Login
    cy.login(MULTI_PARENT, dashboardURL)

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
