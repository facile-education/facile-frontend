import {
  now, slotTypes, url
} from '../../support/constants/horairesHorsCadres'
import { TEACHER } from '../../support/constants'

const form = {
  startHour: '14:00',
  endHour: '15:00',
  teacherName: 'Darko Jovanovic',
  teacherSearch: 'dar',
  roomNumber: 'A110',
  capacity: 20
}

const waitCalendarToLoad = () => {
  cy.wait(500)
}

const selectHours = (startHour, endHour) => {
  cy.get('[data-test=time-selection] > .input-section > :nth-child(2)').clear()
  cy.get('[data-test=time-selection] > .input-section > :nth-child(2)').type(startHour)
  cy.get('[data-test=time-selection] > .input-section > :nth-child(3)').clear()
  cy.get('[data-test=time-selection] > .input-section > :nth-child(3)').type(endHour)
}

const clickOnSlot = (day, slotNumber) => {
  cy.get('.fc-day-' + day + ' > .fc-timegrid-col-frame').then((col) => {
    cy.get(':nth-child(' + slotNumber + ') > .fc-timegrid-slot-lane').then((row) => {
      cy.wrap(row).click(row.position().left + row.width() / 2 + col.width(), row.position.top, { force: true }) // not click on the slot's center, but on the slot's right to always select an empty part
    })
  })
}

const submit = () => {
  cy.get('.button').contains('Valider').click()
}

const testEditSlotModalForm = (form) => {
  cy.get('[data-test=edit-slot-modal]').within(() => {
    // test hours section
    cy.get('[data-test=time-selection] > .input-section > :nth-child(2)').should('have.value', '14:00') // because we have clicked on column n°7
    cy.get('[data-test=time-selection] > .input-section > :nth-child(3)').should('have.value', '15:00')
    selectHours(' ', ' ')
    submit()
    cy.get('[data-test=time-selection] > .error-message').should('exist')
    selectHours(form.endHour, form.startHour)
    submit()
    cy.get('[data-test=time-selection] > .error-message').should('exist')
    selectHours(form.startHour, form.endHour)
    submit()
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

    submit()
  })
}

const fillEditSlotModal = (form) => {
  cy.get('[data-test=edit-slot-modal]').within(() => {
    selectHours(form.startHour, form.endHour)
    cy.get('[data-test=user-completion-input]').type(form.teacherSearch)
    cy.tick(500)
    cy.contains(form.teacherName).click()
    cy.get('[placeholder="Saisir le numéro de salle"]').type(form.roomNumber)
    cy.get('[type="number"]').type(form.capacity)

    submit()
  })
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
const getWeeksEventsNumber = () => {
  cy.get('.fc-timegrid-event').then((currentEvents) => {
    const nbCurrentWeekEvents = currentEvents.length
    cy.get('.weeknumber-label').eq(1).click() // Select the previous week
    waitCalendarToLoad()
    cy.get('.fc-timegrid-event').should('have.length', 0).then((previousEvents) => { // TODO: find a proper way to retrieve events length, whether they exists or not (0 or > 0)
      const nbPreviousWeekEvents = previousEvents.length
      cy.get('.weeknumber-label').eq(3).click() // Select the week after
      waitCalendarToLoad()
      cy.get('.fc-timegrid-event').then((nextEvents) => {
        const events = { nbPreviousWeekEvents: nbPreviousWeekEvents, nbCurrentWeekEvents: nbCurrentWeekEvents, nbNextWeekEvents: nextEvents.length }
        cy.wrap(events).as('events')

        // return in current week
        cy.get('.weeknumber-label').eq(2).click()
        waitCalendarToLoad()
      })
    })
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

  it('Create slot', function () {
    cy.login(url)

    for (const attr in slotTypes) {
      const currentSlotType = slotTypes[attr]
      cy.log('==================== Test ' + currentSlotType.label + ' creation ====================')
      cy.get('[data-test=slot-type-item-' + currentSlotType.type + ']').click() // Select tutoring slots
      waitCalendarToLoad()
      getWeeksEventsNumber()

      // Create slot
      clickOnSlot('wed', 7)
      cy.get('[data-test=edit-slot-modal]')
      if (currentSlotType.type === slotTypes.tutoring.type) { // To tests form validation only once
        testEditSlotModalForm(form)
      } else {
        fillEditSlotModal(form)
      }

      // Check slot creation
      cy.get('@events').then((events) => {
        // Check current week events
        cy.get('.fc-timegrid-event').should('have.length', events.nbCurrentWeekEvents + 1)
        checkSlotExistAtDay('05-05', currentSlotType, form)

        // Check previous week events
        cy.get('.weeknumber-label').eq(1).click()
        waitCalendarToLoad()
        cy.get('.fc-timegrid-event').should('have.length', events.nbPreviousWeekEvents)

        // Check next week events
        cy.get('.weeknumber-label').eq(3).click()
        waitCalendarToLoad()
        cy.get('.fc-timegrid-event').should('have.length', events.nbNextWeekEvents + 1)
        checkSlotExistAtDay('05-12', currentSlotType, form)
      })
    }
  })
})
