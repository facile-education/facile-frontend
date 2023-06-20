import { TEACHER } from '../../support/constants'
import {
  now, slotTypes, url
} from '../../support/constants/horairesHorsCadres'
import utils from '../../support/utils/horairesHorsCardesUtils'

const form = {
  startHour: '14:00',
  endHour: '15:00',
  teacherName: 'Jovanovic Darko',
  teacherSearch: 'dar',
  roomNumber: 'A110',
  capacity: 20
}

const testEditSlotModalForm = (form) => {
  cy.get('[data-test=edit-slot-modal]').within(() => {
    // test hours section
    cy.get('[data-test=time-selection] > .input-section > .start').should('have.value', '14:00') // because we have clicked on column n°7
    cy.get('[data-test=time-selection] > .input-section > .end').should('have.value', '15:00')
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
    cy.get('[placeholder="Salle"]').type(form.roomNumber)
    cy.get('[data-test=room-part] > .error-message').should('not.exist')

    // tests capacity
    cy.get('[data-test=capacity-part] > .error-message').should('exist')
    cy.get('input[type="number"]').type(form.capacity)
    cy.get('[data-test=capacity-part] > .error-message').should('not.exist')

    utils.submit()
  })
}

describe('HHC slots creation', () => {
  beforeEach(() => {
    cy.clock(now.toDate().getTime())
    cy.exec('npm run db:loadTables schoollife_tables.sql')
    cy.clearDBCache()
    cy.logout()
  })

  it('Teachers not allowed to create slots', () => {
    cy.login(url, TEACHER)
    cy.get('[data-test=slot-type-item-' + slotTypes.tutoring.type + ']').click() // Select tutoring slots
    utils.waitCalendarToLoad()

    utils.clickOnEmptySlot('wed', 7)
    cy.get('[data-test=edit-slot-modal]').should('not.exist')
  })

  it('Create slot', function () {
    cy.login(url)

    for (const attr in slotTypes) {
      const currentSlotType = slotTypes[attr]
      cy.log('==================== Test ' + currentSlotType.label + ' creation ====================')
      cy.get('[data-test=slot-type-item-' + currentSlotType.type + ']').click()
      cy.get('.weeknumber-label').eq(2).click() // Go on current week (we don't know the date at each loop beginning)
      utils.waitCalendarToLoad()
      utils.getWeeksEventsNumber(true)

      // Create slot
      utils.clickOnEmptySlot('wed', 7)
      cy.get('[data-test=edit-slot-modal]')
      if (currentSlotType.type === slotTypes.tutoring.type) { // To tests form validation only once
        testEditSlotModalForm(form)
      } else {
        utils.fillEditSlotModal(form)
      }
      utils.waitCalendarToLoad()

      // Check slot creation
      cy.get('@events').then((events) => {
        // Check current week events
        cy.get('.fc-timegrid-event').should('have.length', events.nbCurrentWeekEvents + 1)
        utils.checkSlotData(now, { label: currentSlotType.label, ...form })

        // Check previous week events
        cy.get('.weeknumber-label').eq(1).click()
        utils.waitCalendarToLoad()
        cy.get('.fc-timegrid-event').should('have.length', events.nbPreviousWeekEvents)

        // Check next week events
        cy.get('.weeknumber-label').eq(3).click()
        utils.waitCalendarToLoad()
        cy.get('.fc-timegrid-event').should('have.length', events.nbNextWeekEvents + 1)
        utils.checkSlotData(now.add(1, 'week'), { label: currentSlotType.label, ...form })
      })
    }
  })
})
