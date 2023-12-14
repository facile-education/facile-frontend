// import cypress from 'cypress'

import dayjs from 'dayjs'

const waitCalendarToLoad = () => {
  cy.wait(500)
}

const formatEventTeacherName = (teacher) => {
  return teacher.firstName[0] + '. ' + teacher.lastName
}

const getSlot = (slot) => {
  const startDate = dayjs(slot.startDate, 'YYYY/MM/DD HH:mm')
  return cy.contains(':not(.grayed) >> [data-test="' + startDate.format('MM-DD_HH:mm') + '"]', formatEventTeacherName(slot.teacher))
}

const getUserSlot = (slot) => {
  const startDate = dayjs(slot.startDate, 'YYYY/MM/DD HH:mm')
  return cy.contains('.grayed >> [data-test="' + startDate.format('MM-DD_HH:mm') + '"]', formatEventTeacherName(slot.teacher))
}

const openStudentListModal = (slot) => {
  getSlot(slot).click()
  cy.get('[data-test=showStudentList-option]').click({ force: true })
  return cy.get('[data-test=student-list-modal]')
}

const deleteSlot = (slotToDelete, capacity) => {
  cy.get('.weekly-timeline-container').should('exist') // indirectly waits for full load
  openSlotPopup(slotToDelete, capacity)
  cy.get('[data-test=openEditModal-option]').click()

  cy.get('[data-test=edit-slot-modal]').within(() => {
    cy.get('.button').contains('Supprimer').click()
  })
  cy.get('[data-test=warning-modal]').within(() => {
    cy.contains('button', 'Continuer').click()
  })
}
const selectSlotType = (slotType) => {
  cy.get('[data-test=slot-type-item-' + slotType.type + ']', { timeout: 10000 }).click()
  cy.get('.calendar', { timeout: 10000 }).should('be.visible')
}

const selectStudent = (student) => {
  cy.get('input[placeholder="Nom\ d\'un\ élève"]').type(student.lastName)
  cy.tick(500)
  cy.contains(student.lastName + ' ' + student.firstName).click()
  cy.get('.suggestion-list').should('not.exist')
}

const clearSelectedUser = () => {
  cy.get('[data-test=user-completion-input]').within(() => {
    cy.get('.tag-item > .fa-times').click()
    cy.get('.tag-list').children().should('have.length', 0)
  })
}

const clickOnEmptySlot = (day, slotNumber) => {
  cy.get('.fc-timegrid-axis').first().click() // Click on the CALENDAR (don't know why but if not, fails in some cases, even with a long wait)
  cy.get('.fc-day-' + day + ' > .fc-timegrid-col-frame').then((col) => {
    cy.get(':nth-child(' + slotNumber + ') > .fc-timegrid-slot-lane').then((row) => {
      cy.wait(500)
      console.log(row.height())
      // cy.wrap(col).click(col.width() - 2, row.position().top + row.height() / 2, { force: true }) // not click on the slot's center, but on the slot's right to always select an empty part
      cy.wrap(row).click(col.position().left + col.width() / 2, row.height() / 2) // not click on the slot's center, but on the slot's right to always select an empty part
    })

    // cy.get(':nth-child(' + slotNumber + ') > .fc-timegrid-slot-lane').click(col.position().left + (col.width() / 2), 0, { force: true })
    // cy.get(':nth-child(' + slotNumber + ') > .fc-timegrid-slot-lane').click(col.position().left + (col.width() / 2), 10)
  })
  // cy.get('.fc-timegrid-slot-lane[data-time=13\:00\:00]')
}

const clickOnSlot = (slot, capacity) => {
  cy.log('#### Click on slot ####')
  cy.get('.weekly-horizontal-timeline').should('exist') // Wierd but assert that calendar is fully loaded (/!\ don't works on mobile)
  cy.get('[data-test="' + slot.date.format('MM-DD') + '_' + slot.startHour + '"]').within(() => {
    cy.contains(capacity).first().click({ force: true })
  })
}

const openSlotPopup = (slot, capacity) => {
  clickOnSlot(slot, capacity)
  cy.get('[data-test=event-popup]').should('be.visible')
}

const closeSlotPopup = (slot, capacity) => {
  clickOnSlot(slot, capacity)
  cy.get('[data-test=event-popup]').should('not.exist')
}

const submit = () => {
  cy.get('.button').contains('Valider').click()
}

const phoneGoToDayOfMonth = (day) => {
  cy.get('.toolbar .date-picker .svg-inline--fa').click()
  cy.tick(500)
  cy.get(`.id-${day}`).click()
  cy.get('.toolbar .date-picker .svg-inline--fa').click()
  cy.tick(500)
  cy.wait(100)
  cy.tick(500)
  cy.get('.vc-popover-content').should('not.exist')
}

const checkSlotData = (date, expectedSlot, checkTeachersAndStuff = true) => {
  cy.get('[data-test="' + date.format('MM-DD') + '_' + expectedSlot.startHour + '"]').within(() => {
    cy.contains(expectedSlot.label).first().click({ force: true })
  })
  cy.get('[data-test=event-popup] ').within(() => {
    cy.contains(expectedSlot.startHour + ' - ' + expectedSlot.endHour)
    if (checkTeachersAndStuff) { // TODO: To remove when we will fix teacher and roomNumber, etc from Slot to sessions
      cy.contains(expectedSlot.teacherName)
      cy.contains(expectedSlot.roomNumber)
      cy.contains(expectedSlot.capacity)
    }
  })
  // close popup to not be crowded by it on next clicks
  cy.get('[data-test="' + date.format('MM-DD') + '_' + expectedSlot.startHour + '"]').within(() => {
    cy.contains(expectedSlot.label).first().click({ force: true })
  })
}

function addTimeToSlot (slot, value, unit) {
  const newslot = { ...slot }
  newslot.startDate = Cypress.dayjs(newslot.startDate, 'YYYY/MM/DD HH:mm').add(value, unit)
  newslot.endDate = Cypress.dayjs(newslot.endDate, 'YYYY/MM/DD HH:mm').add(value, unit)
  return newslot
}

function formatSchoolSlotLabel (schoolSlot) {
  return schoolSlot.schoolSlotNumber +
    ' (' + Cypress.dayjs(schoolSlot.startDate, 'YYYY/MM/DD HH:mm').format('HH:mm') +
    ' / ' +
    Cypress.dayjs(schoolSlot.endDate, 'YYYY/MM/DD HH:mm').format('HH:mm') + ')'
}

function selectWeek (date) {
  const nextWeekLabel = date.day(1).format('D MMM') // week's monday
  cy.get('[data-test="weekList"]').scrollIntoView()
  cy.get('[data-test="weekList"]').contains('button', nextWeekLabel).click()
}

// Expose the number of events for the current, previous and next week
// under the alias 'events'
// apart because of the lot of nested then
const getWeeksEventsNumber = (now, expectNoEventAtPreviousWeek = false, nbWeekShift = 0, isMobile = false) => {
  cy.get('.fc-timegrid-event').then((currentEvents) => {
    const nbCurrentWeekEvents = currentEvents.length
    // console.log('nbCurrentWeekEvents :', nbCurrentWeekEvents)
    if (isMobile) {
      phoneGoToDayOfMonth(now.add(-1 + nbWeekShift, 'week').format('YYYY-MM-DD'))
    } else {
      cy.get('.week-number-label').eq(1 + nbWeekShift).click() // Select the previous week
    }
    waitCalendarToLoad()
    if (expectNoEventAtPreviousWeek) { // TODO: find a proper way to retrieve events length, whether they exists or not (0 or > 0)
      cy.get('.fc-timegrid-event').should('have.length', 0).then((previousEvents) => {
        const nbPreviousWeekEvents = previousEvents.length
        // console.log('nbPreviousWeekEvents :', nbPreviousWeekEvents)
        if (isMobile) {
          phoneGoToDayOfMonth(now.add(1 + nbWeekShift, 'week').format('YYYY-MM-DD'))
        } else {
          cy.get('.week-number-label').eq(3 + nbWeekShift).click() // Select the week after
        }
        waitCalendarToLoad()
        cy.get('.fc-timegrid-event').then((nextEvents) => {
          // console.log('nbNextWeekEvents :', nextEvents.length)
          const events = {
            nbPreviousWeekEvents,
            nbCurrentWeekEvents,
            nbNextWeekEvents: nextEvents.length
          }
          cy.wrap(events).as('events')

          // return in current week
          if (isMobile) {
            phoneGoToDayOfMonth(now.add(nbWeekShift, 'week').format('YYYY-MM-DD'))
          } else {
            cy.get('.week-number-label').eq(2 + nbWeekShift).click()
          }
          waitCalendarToLoad()
        })
      })
    } else {
      cy.get('.fc-timegrid-event').then((previousEvents) => {
        const nbPreviousWeekEvents = previousEvents.length
        if (isMobile) {
          phoneGoToDayOfMonth(now.add(1 + nbWeekShift, 'week').format('YYYY-MM-DD'))
        } else {
          cy.get('.week-number-label').eq(3 + nbWeekShift).click() // Select the week after
        }
        waitCalendarToLoad()
        cy.get('.fc-timegrid-event').then((nextEvents) => {
          const events = {
            nbPreviousWeekEvents,
            nbCurrentWeekEvents,
            nbNextWeekEvents: nextEvents.length
          }
          cy.wrap(events).as('events')

          // return in current week
          if (isMobile) {
            phoneGoToDayOfMonth(now.add(nbWeekShift, 'week').format('YYYY-MM-DD'))
          } else {
            cy.get('.week-number-label').eq(2 + nbWeekShift).click()
          }
          waitCalendarToLoad()
        })
      })
    }
  })
}

export {
  formatEventTeacherName,
  openStudentListModal,
  selectSlotType,
  getSlot,
  getUserSlot,
  deleteSlot,
  selectStudent,
  clearSelectedUser,
  checkSlotData,
  addTimeToSlot,
  selectWeek,
  clickOnSlot,
  clickOnEmptySlot,
  openSlotPopup,
  closeSlotPopup,
  getWeeksEventsNumber,
  phoneGoToDayOfMonth,
  submit,
  waitCalendarToLoad,
  formatSchoolSlotLabel
}
