import dayjs from 'dayjs'

const waitScheduleToBeLoaded = () => {
  cy.get('h1[aria-label="Horaires"]', { timeout: 10000 }).should('exist')
  cy.get('.fc', { timeout: 10000 }).should('exist')

  cy.wait('@getUserSessions')
}

const getSlot = (slot) => {
  const startDate = dayjs(slot.startDate, 'YYYY/MM/DD HH:mm')
  return cy.get('[data-test="' + startDate.format('MM-DD_HH:mm') + '"]')
}

const checkScheduleSlot = (slot) => {
  getSlot(slot).scrollIntoView()
    .should('be.visible')
    .should('contain', slot.courseName)
    .should('contain', slot.room)
}

export {
  waitScheduleToBeLoaded,
  getSlot,
  checkScheduleSlot
}
