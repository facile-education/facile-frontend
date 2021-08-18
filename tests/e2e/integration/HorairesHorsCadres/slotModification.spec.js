import {
  now, slotTypes, url
} from '../../support/constants/horairesHorsCadres'
import utils from '../../support/utils/horairesHorsCardesUtils'

const slotsToModify = { // The created slots designate to be modified
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

const modifiedSlot = {
  startHour: '08:30',
  endHour: '09:45',
  teacherSearch: 'dar',
  teacherName: 'Jovanovic Darko',
  roomNumber: 'A110',
  capacity: 20
}

describe('HHC slots modidication', () => {
  beforeEach(() => {
    cy.logout()
    cy.clock(now.toDate().getTime())
  })

  it('Modify slot desktop', function () {
    cy.login(url)

    for (const attr in slotTypes) {
      const currentSlotType = slotTypes[attr]
      cy.log('==================== Test ' + currentSlotType.label + ' modification ====================')
      cy.get('[data-test=slot-type-item-' + currentSlotType.type + ']').click()
      cy.get('.weeknumber-label').eq(2).click() // to go to currentDate after each for loop
      utils.waitCalendarToLoad()

      // Create the slot to modify // TODO Not pass by UI
      cy.log('========= Create slot to modify =========')
      utils.clickOnSlot(slotsToModify[currentSlotType.type].day, 7)
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
    cy.get('[data-test=slot-type-item-' + currentSlotType.type + ']').click()
    utils.waitCalendarToLoad()

    // Create the slot to modify // TODO Not pass by UI
    cy.log('========= Create slot to modify =========')
    utils.clickOnSlot(slotsToModify[currentSlotType.type].day, 7)
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
})
