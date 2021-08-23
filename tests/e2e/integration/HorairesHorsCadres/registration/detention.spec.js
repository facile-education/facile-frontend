import {
  now,
  url,
  slotTypes
} from '../../../support/constants/horairesHorsCadres'

import utils from '../../../support/utils/horairesHorsCardesUtils'
import { HEADMASTER, STUDENT } from '../../../support/constants'

const slotToRegisterInside = {
  day: 'wed',
  date: now,
  startHour: '08:00',
  endHour: '09:00',
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

const comment = 'dissipé'

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
    cy.get('textarea').type(comment)
    cy.get('.notify-parents [type="checkbox"]').should('be.checked')

    cy.contains('button', 'Inscrire').click()
  })
  utils.waitCalendarToLoad()
  cy.get('[data-test=student-registration-modal]').should('not.exist')
}

// NB: Some of registration main features are already tested in study type, so here is juste a basic registration test for replayTest slots
describe('Detention registration', () => {
  beforeEach(() => {
    cy.logout()
    cy.clock(now.toDate().getTime())
    cy.login(url)
    cy.get('[data-test=slot-type-item-' + slotTypes.detention.type + ']').click()
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
    cy.contains('[data-cy="' + slotToRegisterInside.date.format('MM-DD') + '_' + slotToRegisterInside.startHour + '"]', 'Retenue').parent().within(() => {
      cy.contains(slotToRegisterInside.teacherLastName).first().should('exist')
    })

    // TODO Check notification (parents and students?)
    cy.logout()
    cy.login(url, STUDENT)

    cy.visit('/')
    // TODO modify dump to not have this message
    cy.contains('Fermer').click()
    cy.get('#nav_entry_messagerie').click()
    cy.contains('.message-container', HEADMASTER.firstName + ' ' + HEADMASTER.lastName)
    cy.contains('.message-container', 'Retenue le ' + now.format('DD MMM YYYY') + ' à 08h00') // todo: be consistant with slotToRegisterInside.startHour instead oh '08h00'
  })
})
