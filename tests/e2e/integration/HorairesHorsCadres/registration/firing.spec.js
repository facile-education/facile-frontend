import {
  now,
  url,
  slotTypes
} from '../../../support/constants/horairesHorsCadres'

import utils from '../../../support/utils/horairesHorsCardesUtils'

const slotToRegisterInside = {
  day: 'wed',
  date: now,
  startHour: '11:00',
  endHour: '12:00',
  teacherSearch: 'reg',
  teacherName: 'Regad Alexandre',
  teacherLastName: 'Regad',
  roomNumber: 'tg',
  capacity: 2
}

const studentsToRegister = {
  name: 'ALOSTA ANYA (1051AC)',
  formattedName: 'Anya Alosta - 1051AC',
  search: 'alo'
}

const createSlot = (slotToCreate) => {
  // Create the slot // TODO Not pass by UI
  cy.log('========= Create slot =========')
  utils.clickOnSlot(slotToCreate.day, 7)
  cy.get('[data-test=edit-slot-modal]')
  utils.fillEditSlotModal(slotToCreate)
  utils.waitCalendarToLoad()
}

const selectStudent = (student) => {
  cy.get('[data-test=user-completion-input] input').type(student.search)
  cy.tick(500)
  cy.contains(student.name).click()
  utils.waitCalendarToLoad()
}

const clickOnSlot = (slot, capacity) => {
  cy.get('[data-test="' + slot.date.format('MM-DD') + '_' + slot.startHour + '"]').within(() => {
    cy.contains(capacity).first().click({ force: true })
  })
}

const openSlotPopup = (slot, capacity) => {
  clickOnSlot(slot, capacity)
  cy.get('[data-test=event-popup]').should('be.visible')
}

const testRegistrationModal = (slot, studentToRegister) => {
  cy.get('[data-test=student-registration-modal]').within(() => {
    cy.contains(studentToRegister.formattedName)
    cy.contains(slot.startHour)
    cy.get('textarea').should('not.exist')
    cy.get('.notify-parents [type="checkbox"]').should('not.exist')
    cy.contains('Renvoyé du cours: ').parent().find('.base-dropdown').click().within(() => {
      cy.contains('11:25 / 12:10 - AL1051AC').click()
    })

    cy.contains('button', 'Inscrire').click()
  })
  utils.waitCalendarToLoad()
  cy.get('[data-test=student-registration-modal]').should('not.exist')
}

// NB: Some of registration main features are already tested in study type, so here is juste a basic registration test for replayTest slots
describe('Firing registration', () => {
  beforeEach(() => {
    cy.logout()
    cy.clock(now.toDate().getTime())
    cy.login(url)
    cy.get('[data-test=slot-type-item-' + slotTypes.fired.type + ']').click()
  })

  it('registration behaviour', () => {
    // Create slot
    createSlot(slotToRegisterInside)

    // Select student
    selectStudent(studentsToRegister)

    // Open registration modal
    openSlotPopup(slotToRegisterInside, '2/2')
    cy.get('[data-test=openRegistration-option]').click()

    // Test registration modal (ends by registering student)
    testRegistrationModal(slotToRegisterInside, studentsToRegister)

    // Check the HHC slot is added in grey to the student's schedule
    cy.get('.grayed >> [data-test="' + slotToRegisterInside.date.format('MM-DD') + '_' + slotToRegisterInside.startHour + '"]').within(() => {
      cy.contains(slotToRegisterInside.teacherLastName).first().should('exist')
    })

    // Check the slot's student list
    openSlotPopup(slotToRegisterInside, '1/2')
    cy.get('[data-test=showStudentList-option]').click()
    cy.get('[data-test=student-list-modal]').within(() => {
      cy.contains(studentsToRegister.formattedName)
    })
    cy.get('[data-test=closeModal]').click()

    // Go in Horaires service
    cy.visit('/nero/horaires')

    // Check slots for the first student
    selectStudent(studentsToRegister)
    cy.contains('[data-cy="' + slotToRegisterInside.date.format('MM-DD') + '_' + slotToRegisterInside.startHour + '"]', 'Renvoi').parent().within(() => {
      cy.contains(slotToRegisterInside.teacherLastName).first().should('exist')
    })

    // TODO Check notification (parents and students?)
  })
})
