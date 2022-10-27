import {
  now, slotTypes, url
} from '../../support/constants/horairesHorsCadres'
import utils from '../../support/utils/horairesHorsCardesUtils'

const slotsToDelete = { // The created slots designate to be deleted
  1: { // fired
    day: 'wed',
    date: now,
    startHour: '08:00',
    endHour: '14:00',
    teacherSearch: 'jau',
    teacherName: 'Jaunait Jérôme',
    roomNumber: 'tg',
    capacity: 7
  },
  2: { // detention
    day: 'wed',
    date: now,
    startHour: '11:00',
    endHour: '12:00',
    teacherSearch: 'alex',
    teacherName: 'Regad Alexandre',
    roomNumber: 'd',
    capacity: 4
  },
  3: { // replayTest
    day: 'wed',
    date: now,
    startHour: '08:00',
    endHour: '10:00',
    teacherSearch: 'dubo',
    teacherName: 'Duboule Lionel',
    roomNumber: 'yh',
    capacity: 1
  },
  4: { // tutoring
    day: 'wed',
    date: now,
    startHour: '08:00',
    endHour: '09:00',
    teacherSearch: 'Bonzon',
    teacherName: 'Bonzon Francoise',
    roomNumber: 'rt',
    capacity: 154
  },
  5: { // study
    day: 'wed',
    date: now,
    startHour: '13:00',
    endHour: '14:00',
    teacherSearch: 'dar',
    teacherName: 'Jovanovic Darko',
    roomNumber: '1g5',
    capacity: 1
  }
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

describe('HHC slots deletion', () => {
  beforeEach(() => {
    cy.clock(now.toDate().getTime())
    cy.exec('npm run db:loadTables schoollife_tables.sql')
    cy.clearDBCache()
    cy.logout()
  })

  it('Delete slot desktop', function () {
    cy.login(url)

    for (const attr in slotTypes) {
      const currentSlotType = slotTypes[attr]
      cy.log('==================== Test ' + currentSlotType.label + ' Deletion ====================')
      cy.get('[data-test=slot-type-item-' + currentSlotType.type + ']').click()
      cy.get('.weeknumber-label').eq(2).click() // to go to currentDate after each for loop
      utils.waitCalendarToLoad()

      // Create the slot to modify // TODO Not pass by UI
      cy.log('========= Create slot to delete =========')
      utils.clickOnEmptySlot(slotsToDelete[currentSlotType.type].day, 7)
      cy.get('[data-test=edit-slot-modal]')
      utils.fillEditSlotModal(slotsToDelete[currentSlotType.type])

      // Go one week after creation
      cy.get('.weeknumber-label').eq(3).click()
      utils.getWeeksEventsNumber(false, 1)

      // Delete slot
      cy.log('========= Delete the slot =========')
      cy.get('[data-test="' + slotsToDelete[currentSlotType.type].date.add(1, 'week').format('MM-DD') + '_' + slotsToDelete[currentSlotType.type].startHour + '"]').within(() => {
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
    cy.get('[data-test=slot-type-item-' + currentSlotType.type + ']').click()
    utils.waitCalendarToLoad()

    // Create the slot to modify // TODO Not pass by UI
    cy.log('========= Create slot to delete =========')
    utils.clickOnEmptySlot(slotsToDelete[currentSlotType.type].day, 7)
    cy.get('[data-test=edit-slot-modal]')
    utils.fillEditSlotModal(slotsToDelete[currentSlotType.type])

    // Go one week after creation
    utils.phoneGoToDayOfMonth(slotsToDelete[currentSlotType.type].date.add(1, 'week').format('YYYY-MM-DD'))
    utils.getWeeksEventsNumber(false, 1, true)

    // Delete slot
    cy.log('========= Delete the slot =========')
    cy.get('[data-test="' + slotsToDelete[currentSlotType.type].date.add(1, 'week').format('MM-DD') + '_' + slotsToDelete[currentSlotType.type].startHour + '"]').within(() => {
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
      utils.phoneGoToDayOfMonth(slotsToDelete[currentSlotType.type].date.format('YYYY-MM-DD'))
      utils.waitCalendarToLoad()
      cy.get('.fc-timegrid-event').should('have.length', events.nbPreviousWeekEvents)

      // Check the week after: the slot is modified
      utils.phoneGoToDayOfMonth(slotsToDelete[currentSlotType.type].date.add(2, 'week').format('YYYY-MM-DD'))
      utils.waitCalendarToLoad()
      cy.get('.fc-timegrid-event').should('have.length', events.nbNextWeekEvents - 1)
    })
  })
})
