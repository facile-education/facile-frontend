import { selectDropdownItem } from '../utils/testUtils'

const weekListFormat = 'D MMM'
const waitScheduleToBeLoaded = () => {
  cy.get('h1[aria-label="Horaires"]', { timeout: 10000 }).should('exist')
  cy.get('.fc', { timeout: 10000 }).should('exist')

  cy.wait('@getUserSessions')
}

const selectGroupSchedule = (group) => {
  selectDropdownItem(
    cy.contains('[data-test="dropdown"]', 'Groupe'),
    group.name
  )

  cy.wait('@getGroupSessions')
}

const addTimeToSlot = (slot, number, unit) => {
  return {
    ...slot,
    startDate: Cypress.dayjs(slot.startDate, 'YYYY/MM/DD HH:mm').add(number, unit),
    endDate: Cypress.dayjs(slot.endDate, 'YYYY/MM/DD HH:mm').add(number, unit),
    nextCourseSlot: slot.nextCourseSlot
      ? {
          ...slot.nextCourseSlot,
          startDate: Cypress.dayjs(slot.nextCourseSlot.startDate, 'YYYY/MM/DD HH:mm').add(number, unit),
          endDate: Cypress.dayjs(slot.nextCourseSlot.endDate, 'YYYY/MM/DD HH:mm').add(number, unit)
        }
      : undefined
  }
}

const selectVisibleWeekInTimeLine = (day) => {
  const weekLabel = day.startOf('week').format(weekListFormat)

  cy.get('[data-test="weekList"]').within(() => {
    cy.contains('button', weekLabel).click()
  })
}

const getSlot = (slot) => {
  const startDate = Cypress.dayjs(slot.startDate, 'YYYY/MM/DD HH:mm')
  return cy.get('[data-test="' + startDate.format('MM-DD_HH:mm') + '"]')
}

const getSlotPopover = (slot) => {
  getSlot(slot).click()
  return cy.get('[data-test="event-popup"]')
}

const checkScheduleSlot = (slot) => {
  getSlot(slot).scrollIntoView()
    .should('be.visible')
    .should('contain', slot.courseName)
    .should('contain', slot.room)
}

export {
  waitScheduleToBeLoaded,
  selectGroupSchedule,
  addTimeToSlot,
  selectVisibleWeekInTimeLine,
  getSlot,
  getSlotPopover,
  checkScheduleSlot
}
