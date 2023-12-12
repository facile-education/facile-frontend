import { scheduleURL } from '../../support/constants/urls'
import { TEACHER } from '../../support/constants/users'
import { getSlot, waitScheduleToBeLoaded } from '../../support/utils/scheduleUtils'

before(() => {
  cy.loadTables('scheduleConfiguration/scheduleNormalConfiguration_tables.sql')
})

beforeEach(() => {
  cy.fixture('schedule.json').as('scheduleData').then(data => {
    cy.clock(Cypress.dayjs(data.now, 'YYYY/MM/DD HH:mm').toDate().getTime())
  })
  cy.intercept('GET', '**/schedule.cdtsession/get-user-sessions**').as('getUserSessions')
})

context('desktop', function () {
  it('Schedule_Navigation_WeekSelection', function () {
    const currentWeekSlot = this.scheduleData[TEACHER.firstName].slotExample
    const nextWeekSlot = {
      ...currentWeekSlot,
      startDate: Cypress.dayjs(currentWeekSlot.startDate, 'YYYY/MM/DD HH:mm').add(1, 'week'),
      endDate: Cypress.dayjs(currentWeekSlot.endDate, 'YYYY/MM/DD HH:mm').add(1, 'week')
    }
    const weekListFormat = 'D MMM'
    const currentWeekLabel = Cypress.dayjs(this.scheduleData.now, 'YYYY/MM/DD HH:mm').startOf('week').format(weekListFormat)
    const nextWeekLabel = Cypress.dayjs(this.scheduleData.now, 'YYYY/MM/DD HH:mm').add(1, 'week').startOf('week').format(weekListFormat)

    cy.login(TEACHER, scheduleURL)

    waitScheduleToBeLoaded()

    // Current week slot is displayed
    cy.get('.calendar').within(() => {
      getSlot(currentWeekSlot).should('exist')
    })

    // Select next week
    cy.get('[data-test="weekList"]').within(() => {
      cy.contains(nextWeekLabel).click()
    })
    cy.get('.calendar').within(() => {
      getSlot(currentWeekSlot).should('not.exist')
      getSlot(nextWeekSlot).should('exist')
    })

    // Select current week
    cy.get('[data-test="weekList"]').within(() => {
      cy.contains(currentWeekLabel).click()
    })
    cy.get('.calendar').within(() => {
      getSlot(currentWeekSlot).should('exist')
      getSlot(nextWeekSlot).should('not.exist')
    })
  })

  it('Schedule_Navigation_WeekListBehaviour', function () {
    const weekListFormat = 'D MMM'
    const currentWeek = Cypress.dayjs(this.scheduleData.now, 'YYYY/MM/DD HH:mm')
    const schoolYearStartDate = Cypress.dayjs(this.scheduleData.schoolYearStartDate, 'YYYY/MM/DD')
    const schoolYearEndDate = Cypress.dayjs(this.scheduleData.schoolYearEndDate, 'YYYY/MM/DD')
    const nbMonthFromSchoolYearStartDate = currentWeek.diff(schoolYearStartDate, 'month')
    const nbMonthToSchoolYearEndDate = schoolYearEndDate.diff(currentWeek, 'month')

    const currentWeekLabel = currentWeek.startOf('week').format(weekListFormat)
    const nextWeekLabel = currentWeek.add(1, 'week').startOf('week').format(weekListFormat)
    const schoolYearStartWeekLabel = schoolYearStartDate.startOf('week').format(weekListFormat)
    const schoolYearEndWeekLabel = schoolYearEndDate.startOf('week').format(weekListFormat)

    cy.login(TEACHER, scheduleURL)

    waitScheduleToBeLoaded()

    cy.get('[data-test="weekList"]').within(() => {
      cy.log('have good class')
      // Initial state
      cy.contains('button', currentWeekLabel).should('have.class', 'theme-background-color')
        .find('.current-week-bar').should('have.class', 'theme-background-color')
      cy.contains('button', nextWeekLabel).should('not.have.class', 'theme-background-color')
        .find('.current-week-bar').should('not.exist')

      // Select next week
      cy.contains('button', nextWeekLabel).click()
      cy.contains('button', currentWeekLabel).should('not.have.class', 'theme-background-color')
        .find('.current-week-bar').should('have.class', 'theme-background-color')
      cy.contains('button', nextWeekLabel).should('have.class', 'theme-background-color')
        .find('.current-week-bar').should('not.exist')

      cy.log('have the good minDate and maxDate')
      // Test the min date
      for (let i = 0; i < nbMonthFromSchoolYearStartDate; i++) {
        cy.get('button[aria-label="Précédent"]').click()
      }
      cy.get('button[aria-label="Précédent"]').should('be.disabled')
      cy.contains('button', currentWeekLabel).should('not.exist')
      cy.contains('button', schoolYearStartWeekLabel).should('be.visible')

      // Test the max date
      for (let i = 0; i < nbMonthFromSchoolYearStartDate + nbMonthToSchoolYearEndDate - 2; i++) { // -2 to adjust because we not display weeks month by month but 5 by 5...
        cy.get('button[aria-label="Suivant"]').click()
      }
      cy.get('button[aria-label="Suivant"]').should('be.disabled')
      cy.contains('button', schoolYearStartWeekLabel).should('not.exist')
      cy.contains('button', schoolYearEndWeekLabel).should('be.visible')
    })
  })
})
