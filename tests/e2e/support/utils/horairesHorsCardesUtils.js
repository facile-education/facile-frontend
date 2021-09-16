import { now } from '../constants/horairesHorsCadres'

const waitCalendarToLoad = () => {
  cy.wait(500)
}

const createSlot = (slotToCreate) => {
  // Create the slot // TODO Not pass by UI
  cy.log('========= Create slot =========')
  cy.get('.spinner').should('not.exist')
  clickOnEmptySlot(slotToCreate.day, 7)
  cy.get('[data-test=edit-slot-modal]')
  fillEditSlotModal(slotToCreate)
  waitCalendarToLoad()
}

const deleteSlot = (slotToDelete, capacity) => {
  cy.get('.weekly-timeline-container').should('be.visible') // indirectly waits for full load
  openSlotPopup(slotToDelete, capacity)
  cy.get('[data-test=openEditModal-option]').click()

  cy.get('[data-test=edit-slot-modal]').within(() => {
    cy.get('.button').contains('Supprimer').click()
  })
  cy.get('[data-test=warning-modal]').within(() => {
    cy.contains('button', 'Supprimer').click()
  })
}

const selectStudent = (student) => {
  cy.get('[data-test=user-completion-input] input').type(student.search)
  cy.tick(500)
  cy.contains(student.name).click()
  waitCalendarToLoad()
}

const clearSelectedUser = () => {
  cy.get('[data-test=user-completion-input]').within(() => {
    cy.get('.tag-item > .pc-times').click()
    cy.get('.tag-list').children().should('have.length', 0)
  })
}

const clickOnEmptySlot = (day, slotNumber) => {
  cy.get('.fc-day-' + day + ' > .fc-timegrid-col-frame').then((col) => {
    cy.get(':nth-child(' + slotNumber + ') > .fc-timegrid-slot-lane').then((row) => {
      cy.wrap(col).click(col.width() - 2, row.position().top + row.height() / 2, { force: true }) // not click on the slot's center, but on the slot's right to always select an empty part
    })
  })
}

const clickOnSlot = (slot, capacity) => {
  cy.get('.weekly-horizontal-timeline').should('be.visible') // Wierd but assert that calendar is fully loaded (/!\ don't works on mobile)
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

const selectHours = (startHour, endHour) => {
  cy.get('[data-test=time-selection] > .input-section > :nth-child(2)').clear()
  cy.get('[data-test=time-selection] > .input-section > :nth-child(2)').type(startHour)
  cy.get('[data-test=time-selection] > .input-section > :nth-child(3)').clear()
  cy.get('[data-test=time-selection] > .input-section > :nth-child(3)').type(endHour)
}

const submit = () => {
  cy.get('.button').contains('Valider').click()
}

const fillEditSlotModal = (form, isModification) => {
  cy.get('[data-test=edit-slot-modal]').within(() => {
    selectHours(form.startHour, form.endHour)
    if (isModification) {
      cy.get('.tag-item > .pc-times').click()
      cy.get('.tag-item').should('not.exist')
    }
    cy.get('[data-test=user-completion-input]').type(form.teacherSearch)
    cy.tick(500)
    cy.contains(form.teacherName).click()
    cy.get('[placeholder="Salle"]').type(form.roomNumber)
    cy.get('[type="number"]').type(form.capacity)

    submit()
  })
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

// Expose the number of events for the current, previous and next week
// under the alias 'events'
// apart because of the lot of nested then
const getWeeksEventsNumber = (expectNoEventAtPreviousWeek = false, nbWeekShift = 0, isMobile = false) => {
  cy.get('.fc-timegrid-event').then((currentEvents) => {
    const nbCurrentWeekEvents = currentEvents.length
    // console.log('nbCurrentWeekEvents :', nbCurrentWeekEvents)
    if (isMobile) {
      phoneGoToDayOfMonth(now.add(-1 + nbWeekShift, 'week').format('YYYY-MM-DD'))
    } else {
      cy.get('.weeknumber-label').eq(1 + nbWeekShift).click() // Select the previous week
    }
    waitCalendarToLoad()
    if (expectNoEventAtPreviousWeek) { // TODO: find a proper way to retrieve events length, whether they exists or not (0 or > 0)
      cy.get('.fc-timegrid-event').should('have.length', 0).then((previousEvents) => {
        const nbPreviousWeekEvents = previousEvents.length
        // console.log('nbPreviousWeekEvents :', nbPreviousWeekEvents)
        if (isMobile) {
          phoneGoToDayOfMonth(now.add(1 + nbWeekShift, 'week').format('YYYY-MM-DD'))
        } else {
          cy.get('.weeknumber-label').eq(3 + nbWeekShift).click() // Select the week after
        }
        waitCalendarToLoad()
        cy.get('.fc-timegrid-event').then((nextEvents) => {
          // console.log('nbNextWeekEvents :', nextEvents.length)
          const events = {
            nbPreviousWeekEvents: nbPreviousWeekEvents,
            nbCurrentWeekEvents: nbCurrentWeekEvents,
            nbNextWeekEvents: nextEvents.length
          }
          cy.wrap(events).as('events')

          // return in current week
          if (isMobile) {
            phoneGoToDayOfMonth(now.add(nbWeekShift, 'week').format('YYYY-MM-DD'))
          } else {
            cy.get('.weeknumber-label').eq(2 + nbWeekShift).click()
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
          cy.get('.weeknumber-label').eq(3 + nbWeekShift).click() // Select the week after
        }
        waitCalendarToLoad()
        cy.get('.fc-timegrid-event').then((nextEvents) => {
          const events = {
            nbPreviousWeekEvents: nbPreviousWeekEvents,
            nbCurrentWeekEvents: nbCurrentWeekEvents,
            nbNextWeekEvents: nextEvents.length
          }
          cy.wrap(events).as('events')

          // return in current week
          if (isMobile) {
            phoneGoToDayOfMonth(now.add(nbWeekShift, 'week').format('YYYY-MM-DD'))
          } else {
            cy.get('.weeknumber-label').eq(2 + nbWeekShift).click()
          }
          waitCalendarToLoad()
        })
      })
    }
  })
}

export default {
  createSlot,
  deleteSlot,
  selectStudent,
  clearSelectedUser,
  checkSlotData,
  clickOnSlot,
  clickOnEmptySlot,
  openSlotPopup,
  closeSlotPopup,
  fillEditSlotModal,
  getWeeksEventsNumber,
  phoneGoToDayOfMonth,
  selectHours,
  submit,
  waitCalendarToLoad
}
