import {
  now, slotTypes, url
} from '../../support/constants/horairesHorsCadres'
import { TEACHER } from '../../support/constants'
import utils from '../../support/utils/horairesHorsCardesUtils'

const form = {
  startHour: '14:00',
  endHour: '15:00',
  teacherName: 'Darko Jovanovic',
  teacherSearch: 'dar',
  roomNumber: 'A110',
  capacity: 20
}

const slotsToModify = { // The created slots designate to be modified
  1: { // fired
    day: 'wed',
    date: now,
    startHour: '08:00',
    endHour: '14:00',
    teacherSearch: 'jau',
    teacherName: 'Jérôme Jaunait',
    roomNumber: 'tg',
    capacity: 7
  },
  2: { // detention
    day: 'wed',
    date: now,
    startHour: '11:00',
    endHour: '12:00',
    teacherSearch: 'alex',
    teacherName: 'Alexandre Regad',
    roomNumber: 'd',
    capacity: 4
  },
  3: { // replayTest
    day: 'wed',
    date: now,
    startHour: '08:00',
    endHour: '10:00',
    teacherSearch: 'dubo',
    teacherName: 'Lionel Duboule',
    roomNumber: 'yh',
    capacity: 1
  },
  4: { // tutoring
    day: 'wed',
    date: now,
    startHour: '08:00',
    endHour: '09:00',
    teacherSearch: 'Bonzon',
    teacherName: 'Francoise Bonzon',
    roomNumber: 'rt',
    capacity: 154
  },
  5: { // study
    day: 'wed',
    date: now,
    startHour: '13:00',
    endHour: '14:00',
    teacherSearch: 'dar',
    teacherName: 'Darko Jovanovic',
    roomNumber: '1g5',
    capacity: 1
  }
}

const modifiedSlot = {
  startHour: '08:30',
  endHour: '09:45',
  teacherSearch: 'dar',
  teacherName: 'Darko Jovanovic',
  roomNumber: 'A110',
  capacity: 20
}

const clickOnSlot = (day, slotNumber) => {
  cy.get('.fc-day-' + day + ' > .fc-timegrid-col-frame').then((col) => {
    cy.get(':nth-child(' + slotNumber + ') > .fc-timegrid-slot-lane').then((row) => {
      cy.wrap(row).click(row.position().left + row.width() / 2 + col.width(), row.position.top, { force: true }) // not click on the slot's center, but on the slot's right to always select an empty part
    })
  })
}

const testEditSlotModalForm = (form) => {
  cy.get('[data-test=edit-slot-modal]').within(() => {
    // test hours section
    cy.get('[data-test=time-selection] > .input-section > :nth-child(2)').should('have.value', '14:00') // because we have clicked on column n°7
    cy.get('[data-test=time-selection] > .input-section > :nth-child(3)').should('have.value', '15:00')
    utils.selectHours(' ', ' ')
    utils.submit()
    cy.get('[data-test=time-selection] > .error-message').should('exist')
    utils.selectHours(form.endHour, form.startHour)
    utils.submit()
    cy.get('[data-test=time-selection] > .error-message').should('exist')
    utils.selectHours(form.startHour, form.endHour)
    utils.submit()
    cy.get('[data-test=time-selection] > .error-message').should('not.exist')

    // test Teacher field
    cy.get('[data-test=teacher-part] > .error-message').should('exist')
    cy.get('[data-test=user-completion-input]').type(form.teacherSearch)
    cy.tick(500)
    cy.contains(form.teacherName).click()
    cy.get('[data-test=teacher-part] > .error-message').should('not.exist')

    // test room number
    cy.get('[data-test=room-part] > .error-message').should('exist')
    cy.get('[placeholder="Saisir le numéro de salle"]').type(form.roomNumber)
    cy.get('[data-test=room-part] > .error-message').should('not.exist')

    // tests capacity
    cy.get('[data-test=capacity-part] > .error-message').should('exist')
    cy.get('[type="number"]').type(form.capacity)
    cy.get('[data-test=capacity-part] > .error-message').should('not.exist')

    utils.submit()
  })
}

const deleteSlot = () => {
  cy.get('[data-test=edit-slot-modal]').within(() => {
    cy.get('.button').contains('Supprimer').click()
  })
  cy.get('[data-test=warning-modal]').within(() => {
    cy.contains('button', 'Continuer').click()
  })
  cy.get('[data-test=warning-modal]').should('not.exist')
  cy.get('[data-test=edit-slot-modal]').should('not.exist')
}

const checkSlotExistAtDay = (day, slotType, slotData) => {
  cy.get('[data-test="' + day + '_' + slotData.startHour + '"]').within(() => {
    cy.contains(slotType.label).first().click({ force: true })
  })
  cy.get('[data-test=event-popup]').within(() => {
    cy.contains(slotData.teacherName)
    cy.contains(slotData.startHour + ' - ' + slotData.endHour)
    cy.contains(slotData.roomNumber)
    cy.contains(slotData.capacity)
  })
}

// Expose the number of events for the current, previous and next week
// under the alias 'events'
// apart because of the lot of nested then
const getWeeksEventsNumber = (expectNoEventAtPreviousWeek = false, nbWeekShift = 0, isMobile = false) => {
  cy.get('.fc-timegrid-event').then((currentEvents) => {
    const nbCurrentWeekEvents = currentEvents.length
    if (isMobile) {
      utils.phoneGoToDayOfMonth(now.add(-1 + nbWeekShift, 'week').format('DD'))
    } else {
      cy.get('.weeknumber-label').eq(1 + nbWeekShift).click() // Select the previous week
    }
    utils.waitCalendarToLoad()
    if (expectNoEventAtPreviousWeek) { // TODO: find a proper way to retrieve events length, whether they exists or not (0 or > 0)
      cy.get('.fc-timegrid-event').should('have.length', 0).then((previousEvents) => {
        const nbPreviousWeekEvents = previousEvents.length
        if (isMobile) {
          utils.phoneGoToDayOfMonth(now.add(1 + nbWeekShift, 'week').format('DD'))
        } else {
          cy.get('.weeknumber-label').eq(3 + nbWeekShift).click() // Select the week after
        }
        utils.waitCalendarToLoad()
        cy.get('.fc-timegrid-event').then((nextEvents) => {
          const events = {
            nbPreviousWeekEvents: nbPreviousWeekEvents,
            nbCurrentWeekEvents: nbCurrentWeekEvents,
            nbNextWeekEvents: nextEvents.length
          }
          cy.wrap(events).as('events')

          // return in current week
          if (isMobile) {
            utils.phoneGoToDayOfMonth(now.add(nbWeekShift, 'week').format('DD'))
          } else {
            cy.get('.weeknumber-label').eq(2 + nbWeekShift).click()
          }
          utils.waitCalendarToLoad()
        })
      })
    } else {
      cy.get('.fc-timegrid-event').then((previousEvents) => {
        const nbPreviousWeekEvents = previousEvents.length
        if (isMobile) {
          utils.phoneGoToDayOfMonth(now.add(1 + nbWeekShift, 'week').format('DD'))
        } else {
          cy.get('.weeknumber-label').eq(3 + nbWeekShift).click() // Select the week after
        }
        utils.waitCalendarToLoad()
        cy.get('.fc-timegrid-event').then((nextEvents) => {
          const events = {
            nbPreviousWeekEvents: nbPreviousWeekEvents,
            nbCurrentWeekEvents: nbCurrentWeekEvents,
            nbNextWeekEvents: nextEvents.length
          }
          cy.wrap(events).as('events')

          // return in current week
          if (isMobile) {
            utils.phoneGoToDayOfMonth(now.add(nbWeekShift, 'week').format('DD'))
          } else {
            cy.get('.weeknumber-label').eq(2 + nbWeekShift).click()
          }
          utils.waitCalendarToLoad()
        })
      })
    }
  })
}

describe('Slots creation', () => {
  beforeEach(() => {
    cy.logout()
    cy.clock(now.toDate().getTime())
  })

  it('Teachers not allowed to create slots', () => {
    cy.login(url, TEACHER)
    cy.get('[data-test=slot-type-item-' + slotTypes.tutoring.type + ']').click() // Select tutoring slots
    cy.wait(500) // cy.waitCalendarLoad()

    clickOnSlot('wed', 7)
    cy.get('[data-test=edit-slot-modal]').should('not.exist')
  })

  it.only('Create slot', function () {
    cy.login(url)

    for (const attr in slotTypes) {
      const currentSlotType = slotTypes[attr]
      cy.log('==================== Test ' + currentSlotType.label + ' creation ====================')
      cy.get('[data-test=slot-type-item-' + currentSlotType.type + ']').click() // Select tutoring slots
      utils.waitCalendarToLoad()
      getWeeksEventsNumber(true)

      // Create slot
      clickOnSlot('wed', 7)
      cy.get('[data-test=edit-slot-modal]')
      if (currentSlotType.type === slotTypes.tutoring.type) { // To tests form validation only once
        testEditSlotModalForm(form)
      } else {
        utils.fillEditSlotModal(form)
      }

      // Check slot creation
      cy.get('@events').then((events) => {
        // Check current week events
        cy.get('.fc-timegrid-event').should('have.length', events.nbCurrentWeekEvents + 1)
        // checkSlotExistAtDay('05-05', currentSlotType, form)
        utils.checkSlotData(now, { label: currentSlotType.label, ...form })
        // Check previous week events

        cy.get('.weeknumber-label').eq(1).click()
        utils.waitCalendarToLoad()
        cy.get('.fc-timegrid-event').should('have.length', events.nbPreviousWeekEvents)
        // Check next week events

        cy.get('.weeknumber-label').eq(3).click()
        utils.waitCalendarToLoad()
        cy.get('.fc-timegrid-event').should('have.length', events.nbNextWeekEvents + 1)
        // checkSlotExistAtDay('05-12', currentSlotType, form)
        utils.checkSlotData(now.add(1, 'week'), { label: currentSlotType.label, ...form })
      })
    }
  })

  it('Modify slot', function () {
    cy.login(url)

    for (const attr in slotTypes) {
      const currentSlotType = slotTypes[attr]
      cy.log('==================== Test ' + currentSlotType.label + ' modification ====================')
      cy.get('[data-test=slot-type-item-' + currentSlotType.type + ']').click() // Select tutoring slots
      cy.get('.weeknumber-label').eq(2).click() // to go to currentDate after each for loop
      utils.waitCalendarToLoad()

      // Create the slot to modify // TODO Not pass by UI
      cy.log('========= Create slot to modify =========')
      clickOnSlot(slotsToModify[currentSlotType.type].day, 7)
      cy.get('[data-test=edit-slot-modal]')
      utils.fillEditSlotModal(slotsToModify[currentSlotType.type])

      // Modify slot (go the week after the creation)
      cy.log('========= Modify the slot =========')
      cy.get('.weeknumber-label').eq(3).click()
      cy.get('[data-test="' + slotsToModify[currentSlotType.type].date.add(1, 'week').format('MM-DD') + '_' + slotsToModify[currentSlotType.type].startHour + '"]').within(() => {
        cy.contains(currentSlotType.label).first().click({ force: true })
      })
      cy.get('[data-test=openEditModal-option]').click()
      cy.get('[data-test=edit-slot-modal]').should('exist')
      utils.fillEditSlotModal(modifiedSlot, true)
      utils.waitCalendarToLoad()

      // Check modified slot
      cy.log('========= Check modified slot =========')
      utils.checkSlotData(slotsToModify[currentSlotType.type].date.add(1, 'week'), { label: currentSlotType.label, ...modifiedSlot })

      // Check the week before: the slots isn't modified
      cy.get('.weeknumber-label').eq(2).click()
      utils.waitCalendarToLoad()
      utils.checkSlotData(slotsToModify[currentSlotType.type].date, { label: currentSlotType.label, ...slotsToModify[currentSlotType.type] }, false)

      // Check the week after: the slot is modified
      cy.get('.weeknumber-label').eq(4).click()
      utils.waitCalendarToLoad()
      utils.checkSlotData(slotsToModify[currentSlotType.type].date.add(2, 'week'), { label: currentSlotType.label, ...modifiedSlot })
    }
  })

  it('Modify slot mobile', function () {
    cy.login(url)
    cy.viewport('iphone-5')
    const currentSlotType = slotTypes.tutoring // Only test behaviour for tutoring, assert at this point, the others type of slots were tested on desktop

    cy.log('==================== Test ' + currentSlotType.label + ' modification ====================')
    cy.get('[data-test=slot-type-item-' + currentSlotType.type + ']').click() // Select tutoring slots
    utils.waitCalendarToLoad()

    // Create the slot to modify // TODO Not pass by UI
    cy.log('========= Create slot to modify =========')
    clickOnSlot(slotsToModify[currentSlotType.type].day, 7)
    cy.get('[data-test=edit-slot-modal]')
    utils.fillEditSlotModal(slotsToModify[currentSlotType.type])

    // Modify slot (go the week after the creation)
    cy.log('========= Modify the slot =========')
    utils.phoneGoToDayOfMonth(slotsToModify[currentSlotType.type].date.add(1, 'week').format('DD'))
    cy.get('[data-test="' + slotsToModify[currentSlotType.type].date.add(1, 'week').format('MM-DD') + '_' + slotsToModify[currentSlotType.type].startHour + '"]').within(() => {
      cy.contains(currentSlotType.label).first().click({ force: true })
    })
    cy.get('[data-test=openEditModal-option]').click()
    cy.get('[data-test=edit-slot-modal]').should('exist')
    utils.fillEditSlotModal(modifiedSlot, true)
    utils.waitCalendarToLoad()

    // Check modified slot
    cy.log('========= Check modified slot =========')
    utils.checkSlotData(slotsToModify[currentSlotType.type].date.add(1, 'week'), { label: currentSlotType.label, ...modifiedSlot })

    // Check the week before: the slots isn't modified
    utils.phoneGoToDayOfMonth(slotsToModify[currentSlotType.type].date.format('DD'))
    utils.waitCalendarToLoad()
    utils.checkSlotData(slotsToModify[currentSlotType.type].date, { label: currentSlotType.label, ...slotsToModify[currentSlotType.type] }, false)

    // Check the week after: the slot is modified
    utils.phoneGoToDayOfMonth(slotsToModify[currentSlotType.type].date.add(2, 'week').format('DD'))
    utils.waitCalendarToLoad()
    utils.checkSlotData(slotsToModify[currentSlotType.type].date.add(2, 'week'), { label: currentSlotType.label, ...modifiedSlot })
  })

  it('Delete slot', function () {
    cy.login(url)

    for (const attr in slotTypes) {
      const currentSlotType = slotTypes[attr]
      cy.log('==================== Test ' + currentSlotType.label + ' Deletion ====================')
      cy.get('[data-test=slot-type-item-' + currentSlotType.type + ']').click() // Select tutoring slots
      cy.get('.weeknumber-label').eq(2).click() // to go to currentDate after each for loop
      utils.waitCalendarToLoad()

      // Create the slot to modify // TODO Not pass by UI
      cy.log('========= Create slot to delete =========')
      clickOnSlot(slotsToModify[currentSlotType.type].day, 7)
      cy.get('[data-test=edit-slot-modal]')
      utils.fillEditSlotModal(slotsToModify[currentSlotType.type])

      // Go one week after creation
      cy.get('.weeknumber-label').eq(3).click()
      getWeeksEventsNumber(false, 1)

      // Delete slot
      cy.log('========= Delete the slot =========')
      cy.get('[data-test="' + slotsToModify[currentSlotType.type].date.add(1, 'week').format('MM-DD') + '_' + slotsToModify[currentSlotType.type].startHour + '"]').within(() => {
        cy.contains(currentSlotType.label).first().click({ force: true })
      })
      cy.get('[data-test=openEditModal-option]').click()
      cy.get('[data-test=edit-slot-modal]').should('exist')
      deleteSlot()
      utils.waitCalendarToLoad()

      cy.get('@events').then((events) => {
        // Check current week events
        cy.log('========= Check modified slot =========')
        cy.get('.fc-timegrid-event').should('have.length', events.nbCurrentWeekEvents - 1)

        // Check the week before: the slots isn't deleted
        cy.get('.weeknumber-label').eq(2).click()
        utils.waitCalendarToLoad()
        cy.get('.fc-timegrid-event').should('have.length', events.nbPreviousWeekEvents)

        // Check the week after: the slot is modified
        cy.get('.weeknumber-label').eq(4).click()
        utils.waitCalendarToLoad()
        cy.get('.fc-timegrid-event').should('have.length', events.nbNextWeekEvents - 1)
      })
    }
  })

  it('Delete slot Mobile', function () {
    cy.login(url)
    cy.viewport('iphone-5')
    const currentSlotType = slotTypes.tutoring // Only test behaviour for tutoring, assert at this point, the others type of slots were tested on desktop

    cy.log('==================== Test ' + currentSlotType.label + ' Deletion ====================')
    cy.get('[data-test=slot-type-item-' + currentSlotType.type + ']').click() // Select tutoring slots
    utils.waitCalendarToLoad()

    // Create the slot to modify // TODO Not pass by UI
    cy.log('========= Create slot to delete =========')
    clickOnSlot(slotsToModify[currentSlotType.type].day, 7)
    cy.get('[data-test=edit-slot-modal]')
    utils.fillEditSlotModal(slotsToModify[currentSlotType.type])

    // Go one week after creation
    utils.phoneGoToDayOfMonth(slotsToModify[currentSlotType.type].date.add(1, 'week').format('DD'))
    getWeeksEventsNumber(false, 1, true)

    // Delete slot
    cy.log('========= Delete the slot =========')
    cy.get('[data-test="' + slotsToModify[currentSlotType.type].date.add(1, 'week').format('MM-DD') + '_' + slotsToModify[currentSlotType.type].startHour + '"]').within(() => {
      cy.contains(currentSlotType.label).first().click({ force: true })
    })
    cy.get('[data-test=openEditModal-option]').click()
    cy.get('[data-test=edit-slot-modal]').should('exist')
    deleteSlot()
    utils.waitCalendarToLoad()

    cy.get('@events').then((events) => {
      // Check current week events
      cy.log('========= Check modified slot =========')
      cy.get('.fc-timegrid-event').should('have.length', events.nbCurrentWeekEvents - 1)

      // Check the week before: the slots isn't deleted
      utils.phoneGoToDayOfMonth(slotsToModify[currentSlotType.type].date.format('DD'))
      utils.waitCalendarToLoad()
      cy.get('.fc-timegrid-event').should('have.length', events.nbPreviousWeekEvents)

      // Check the week after: the slot is modified
      utils.phoneGoToDayOfMonth(slotsToModify[currentSlotType.type].date.add(2, 'week').format('DD'))
      utils.waitCalendarToLoad()
      cy.get('.fc-timegrid-event').should('have.length', events.nbNextWeekEvents - 1)
    })
  })
})
