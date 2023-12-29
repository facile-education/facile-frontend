import { scheduleURL } from '../../support/constants/urls'
import { TEACHER } from '../../support/constants/users'
import { addTimeToSlot, checkScheduleSlot, getSlot, selectVisibleWeekInTimeLine, waitScheduleToBeLoaded } from '../../support/utils/scheduleUtils'

const loadWeekSlots = (day) => {
  selectVisibleWeekInTimeLine(day)
  cy.wait('@getUserSessions')
}

describe('Schedule_ScheduleNavigation', () => {
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
      const now = Cypress.dayjs(this.scheduleData.now, 'YYYY/MM/DD HH:mm')
      const currentWeekSlot = this.scheduleData[TEACHER.firstName].slotExample
      const nextWeekSlot = addTimeToSlot(currentWeekSlot, 1, 'week')

      cy.login(TEACHER, scheduleURL)

      waitScheduleToBeLoaded()

      // Current week slot is displayed
      cy.get('.calendar').within(() => {
        checkScheduleSlot(currentWeekSlot)
      })

      // Select next week
      loadWeekSlots(now.add(1, 'week'))
      cy.get('.calendar').within(() => {
        getSlot(currentWeekSlot).should('not.exist')
        checkScheduleSlot(nextWeekSlot)
      })

      // Select current week
      loadWeekSlots(now)
      cy.get('.calendar').within(() => {
        getSlot(nextWeekSlot).should('not.exist')
        checkScheduleSlot(currentWeekSlot)
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

  context('phone', function () {
    beforeEach(() => {
      cy.viewport('iphone-5')
    })

    it('Schedule_Navigation_DaySelectionByDatePicker', function () {
      const currentDay = Cypress.dayjs(this.scheduleData.now, 'YYYY/MM/DD HH:mm')
      const tomorrow = currentDay.add(1, 'day')

      const currentDaySlot = this.scheduleData[TEACHER.firstName].slotExample
      const nextDaySlot = this.scheduleData[TEACHER.firstName].nextDaySlotExample

      cy.login(TEACHER, scheduleURL)

      waitScheduleToBeLoaded()

      // Current week slot is displayed
      cy.get('.calendar').within(() => {
        checkScheduleSlot(currentDaySlot)
      })

      // Select next day week
      cy.get('[data-test="toggle-calendar-selector"]').click()
      cy.tick(500)
      cy.selectDateInVCalendar(tomorrow)
      cy.get('.calendar').within(() => {
        getSlot(currentDaySlot).should('not.exist')
        checkScheduleSlot(nextDaySlot)
      })

      // Select current day
      cy.get('[data-test="toggle-calendar-selector"]').click() // close and re-open it
      cy.tick(500)
      cy.get('[data-test="toggle-calendar-selector"]').click()
      cy.tick(500)
      cy.selectDateInVCalendar(currentDay)
      cy.get('.calendar').within(() => {
        getSlot(nextDaySlot).should('not.exist')
        checkScheduleSlot(currentDaySlot)
      })
    })

    it('Schedule_Navigation_DatePickerBehaviour', function () {
      const currentWeek = Cypress.dayjs(this.scheduleData.now, 'YYYY/MM/DD HH:mm')
      const schoolYearStartDate = Cypress.dayjs(this.scheduleData.schoolYearStartDate, 'YYYY/MM/DD')
      const schoolYearEndDate = Cypress.dayjs(this.scheduleData.schoolYearEndDate, 'YYYY/MM/DD')
      const nbMonthFromSchoolYearStartDate = currentWeek.diff(schoolYearStartDate, 'month')
      const nbMonthToSchoolYearEndDate = schoolYearEndDate.diff(currentWeek, 'month')

      cy.login(TEACHER, scheduleURL)

      waitScheduleToBeLoaded()

      cy.get('[data-test="toggle-calendar-selector"]').click()
      cy.tick(500)
      cy.get('.vc-popover-content').within(() => {
        // Check min date
        for (let i = 0; i < nbMonthFromSchoolYearStartDate + 1; i++) {
          cy.get('button.vc-prev').click()
          cy.tick(500)
        }
        cy.get('.vc-day-content.vc-disabled').should('have.length.greaterThan', 10) // 10 is the max disabled date in a month du to weekends

        // Check max date
        for (let i = 0; i < nbMonthFromSchoolYearStartDate + nbMonthToSchoolYearEndDate + 1; i++) {
          cy.get('button.vc-next').click()
          cy.tick(500)
        }
        cy.get('.vc-day-content.vc-disabled').should('have.length.greaterThan', 10) // 10 is the max disabled date in a month du to weekends
      })
    })

    it.skip('Schedule_Navigation_DaySelectionOnSwipe', function () {
      // Implement swipe before testing it
    })
  })
})
