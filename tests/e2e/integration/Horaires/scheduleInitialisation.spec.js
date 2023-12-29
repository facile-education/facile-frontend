import { scheduleURL } from '../../support/constants/urls'
import { HEADMASTER, MULTI_PARENT, PARENT, STUDENT, TEACHER } from '../../support/constants/users'
import { checkScheduleSlot, waitScheduleToBeLoaded } from '../../support/utils/scheduleUtils'

const scheduleUsers = [HEADMASTER, TEACHER, STUDENT, PARENT, MULTI_PARENT]
const hasToolbar = (user) => {
  return user === HEADMASTER || user === TEACHER
}

describe('Schedule_ScheduleInitialisation', () => {
  before(() => {
    cy.loadTables('scheduleConfiguration/scheduleNormalConfiguration_tables.sql')
    cy.loadTables('schoollife/schoollife_tables.sql') // To test if HHC slots appears in schedule
  })

  beforeEach(() => {
    cy.fixture('schedule.json').as('scheduleData').then(data => {
      cy.clock(Cypress.dayjs(data.now, 'YYYY/MM/DD HH:mm').toDate().getTime())
    })
    cy.intercept('GET', '**/schedule.cdtsession/get-user-sessions**').as('getUserSessions')
  })

  scheduleUsers.forEach(user => {
    it('Schedule_ScheduleInitialisation_LoadCorrectScheduleFor[' + user.role + ']', function () {
      cy.get('@scheduleData').then((scheduleData) => {
        cy.login(user, scheduleURL)

        waitScheduleToBeLoaded()

        cy.get('[data-test="body"]').within((section) => {
          // Test current User selection in search input
          if (hasToolbar(user)) {
            if (user !== HEADMASTER) {
              cy.get('.search').contains('[data-test="tag-item"]', user.firstName + ' ' + user.lastName).should('be.visible')
            } else {
              cy.get('.search').contains('[data-test="tag-item"]', user.firstName + ' ' + user.lastName).should('not.exist')
            }
          }

          // Test calendar content
          const userDisplayedSlots = user.role === 'parent' ? user.students[0] : user
          cy.get('.calendar').within(() => {
            cy.get('.fc-timegrid-event').should('have.length', scheduleData[userDisplayedSlots.firstName].nbWeekSlots)
            if (scheduleData[userDisplayedSlots.firstName].nbWeekSlots > 0) {
              checkScheduleSlot(scheduleData[userDisplayedSlots.firstName].slotExample)
            }
          })

          // For parents, test the children dropdown content
          if (user.role === 'parent') {
            if (user.students.length === 1) {
              cy.wrap(section).scrollTo('top')
              cy.contains('Horaires de ' + user.students[0].firstName).should('be.visible')
            } else {
              // Test multi student dropdown content
              cy.wrap(section).scrollTo('top')
              cy.get('[data-test="dropdown"]').contains(user.students[0].firstName)
                .should('be.visible')
                .click()
              cy.get('[data-test="dropdown"] > .base-autocomplete').find('li').as('childList')
                .should('have.length', user.students.length)
              user.students.forEach(student => {
                cy.get('@childList').should('contain', student.firstName)
              })
            }
          }
        })
      })
    })
  })

  it('Schedule_ScheduleInitialisation_InitOutOfSchoolYear', function () {
    cy.login(TEACHER, scheduleURL)

    // Set time one week after the schoolYearEndDate
    cy.clock().invoke('setSystemTime', Cypress.dayjs(this.scheduleData.schoolYearEndDate, 'YYYY/MM/DD').add(7, 'day').toDate().getTime()) // To put after login to make it works
    waitScheduleToBeLoaded()

    cy.get('.fc-timegrid-event').should('have.length', 0)
  })

  it('Schedule_ScheduleInitialisation_InitInHoliday', function () {
    cy.login(TEACHER, scheduleURL)

    // Set time one week after the holidayStartDate (still before the holidayEndDate)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(this.scheduleData.holidayStartDate, 'YYYY/MM/DD').add(7, 'day').toDate().getTime()) // To put after login to make it works
    waitScheduleToBeLoaded()

    cy.get('.fc-timegrid-event').should('have.length', 0)
  })

  it('Schedule_ScheduleInitialisation_MobileInitialisation', function () {
    cy.login(TEACHER, scheduleURL)

    cy.viewport('iphone-5')
    waitScheduleToBeLoaded()

    cy.get('.calendar').within(() => {
      // Test calendar day display
      const currentDay = Cypress.dayjs(this.scheduleData.now, 'YYYY/MM/DD HH:mm')
      const tomorrow = currentDay.add(1, 'day')
      cy.contains(currentDay.format('dddd DD/MM')).should('be.visible')
      cy.contains(tomorrow.format('dddd DD/MM')).should('not.exist')

      // Check calendar content
      cy.get('.fc-timegrid-event').should('have.length', this.scheduleData[TEACHER.firstName].nbDaySlots)
      checkScheduleSlot(this.scheduleData[TEACHER.firstName].slotExample)
    })
  })
})
