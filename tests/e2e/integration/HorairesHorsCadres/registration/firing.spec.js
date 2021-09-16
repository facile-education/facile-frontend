import {
  now,
  url,
  slotTypes
} from '../../../support/constants/horairesHorsCadres'

import utils from '../../../support/utils/horairesHorsCardesUtils'
import { CLASSTEACHER, DOYEN, HEADMASTER, PARENT, STUDENT, TEACHER } from '../../../support/constants'

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

const HHCSlotToBeFiredFrom = {
  day: 'wed',
  date: now,
  type: 'Cercle d\'étude',
  formattedType: 'Cercle d\'étude',
  startHour: '08:30',
  endHour: '09:45',
  teacherSearch: 'reg',
  teacherName: 'Regad Alexandre',
  teacherLastName: 'Regad',
  roomNumber: 'tg',
  capacity: 2
}

const classicalSlotToBeFiredFrom = {
  //  08:45 / 09:30 - AN1051AC
  day: 'wed',
  date: now,
  type: 'AN1051AC',
  formattedType: 'Anglais',
  startHour: '08:45',
  endHour: '09:30',
  teacherSearch: 'reg',
  teacherName: 'De Miras Serge'
}

const CLASSICAL_SLOT_TEACHER = {
  login: 'edu-demirass',
  password: 'pentila',
  role: 'teacher',
  firstName: 'Serge',
  lastName: 'De Miras'
}

const firingReason = "Je renvoie qui je veux d'abord!"

const studentsToRegister = {
  name: 'ALOSTA ANYA (1051AC)',
  formattedName: 'Anya Alosta - 1051AC',
  search: 'alo'
}

const testRegistrationModal = (slot, studentToRegister, slotToBeFiredFrom) => {
  cy.get('[data-test=student-registration-modal]').within(() => {
    cy.contains(studentToRegister.formattedName)
    cy.contains(slot.startHour)
    cy.get('textarea').should('not.exist')
    cy.get('.notify-parents [type="checkbox"]').should('not.exist')
    cy.contains('Renvoyé du cours: ').parent().find('.base-dropdown').click().within(() => {
      cy.contains(slotToBeFiredFrom.startHour + ' / ' + slotToBeFiredFrom.endHour + ' - ' + slotToBeFiredFrom.type).click()
    })

    cy.contains('button', 'Inscrire').click()
  })
  utils.waitCalendarToLoad()
  cy.get('[data-test=student-registration-modal]').should('not.exist')
}

const registerStudent = (notifyParents) => { // Just fill registration modal and submit
  cy.get('[data-test=student-registration-modal]').within(() => {
    if (!notifyParents) {
      cy.get('.notify-parents [type="checkbox"]').uncheck()
    }
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
  })

  it('registration behaviour (from HHC slot)', () => {
    // Create hhc slot to be fired from
    cy.get('[data-test=slot-type-item-' + slotTypes.study.type + ']').click()
    utils.createSlot(HHCSlotToBeFiredFrom)
    // Register the student inside
    utils.selectStudent(studentsToRegister)
    utils.openSlotPopup(HHCSlotToBeFiredFrom, '2/2')
    cy.get('[data-test=openRegistration-option]').click()
    registerStudent(false)

    // Create firing slot
    cy.get('[data-test=slot-type-item-' + slotTypes.fired.type + ']').click()
    utils.createSlot(slotToRegisterInside)

    // Open registration modal
    utils.openSlotPopup(slotToRegisterInside, '2/2')
    cy.get('[data-test=openRegistration-option]').click()

    // Test registration modal (ends by registering student)
    testRegistrationModal(slotToRegisterInside, studentsToRegister, HHCSlotToBeFiredFrom)

    // Check the HHC slot is added in grey to the student's schedule
    cy.get('.grayed >> [data-test="' + slotToRegisterInside.date.format('MM-DD') + '_' + slotToRegisterInside.startHour + '"]').within(() => {
      cy.contains(slotToRegisterInside.teacherLastName).first().should('exist')
    })

    // Check the slot's student list
    utils.openSlotPopup(slotToRegisterInside, '1/2')
    cy.get('[data-test=showStudentList-option]').click()
    cy.get('[data-test=student-list-modal]').within(() => {
      cy.contains(studentsToRegister.formattedName)
    })
    cy.get('[data-test=closeModal]').click()

    // Go in Horaires service
    cy.visit('/nero/horaires')

    // Check slots for the first student
    utils.selectStudent(studentsToRegister)
    cy.contains('[data-cy="' + slotToRegisterInside.date.format('MM-DD') + '_' + slotToRegisterInside.startHour + '"]', 'Renvoi').parent().within(() => {
      cy.contains(slotToRegisterInside.teacherLastName).first().should('exist')
    })

    // The teacher have to explain the firing
    cy.logout()
    cy.login(url, TEACHER)

    cy.get('[data-test="pending-firing-modal"]').within(() => {
      // Check content
      cy.contains(studentsToRegister.formattedName).should('be.visible')
      cy.contains(HHCSlotToBeFiredFrom.formattedType).should('be.visible')
      cy.contains(HHCSlotToBeFiredFrom.date.format('DD MMM YYYY') + ' à ' + HHCSlotToBeFiredFrom.startHour).should('be.visible')

      // Set reason
      cy.get('textarea').type(firingReason)

      cy.contains('button', 'Envoyer').click()
    })

    cy.get('[data-test="pending-firing-modal"]').should('not.exist')

    // Check notifications (parents + doyen + class teacher)
    cy.log('TEST NOTIFICATION FOR PARENT')
    cy.logout()
    cy.login('/', PARENT)
    cy.get('#nav_entry_messagerie').click()
    cy.get('.message-container').first().within(() => { // have to be the last notification
      cy.contains(TEACHER.firstName + ' ' + TEACHER.lastName)
      cy.contains('Avis de renvoi').click()
    })
    cy.get('.message-details-content').should('contain', firingReason)

    cy.log('TEST NOTIFICATION FOR CLASSTEACHER')
    cy.logout()
    cy.login('/', CLASSTEACHER)
    cy.get('#nav_entry_messagerie').click()
    cy.get('.message-container').first().within(() => { // have to be the last notification
      cy.contains(TEACHER.firstName + ' ' + TEACHER.lastName)
      cy.contains('Avis de renvoi').click()
    })
    cy.get('.message-details-content').should('contain', firingReason)

    cy.log('TEST NOTIFICATION FOR DOYEN')
    cy.logout()
    cy.login('/', DOYEN)
    cy.get('#nav_entry_messagerie').click()
    cy.get('.message-container').first().within(() => { // have to be the last notification
      cy.contains(TEACHER.firstName + ' ' + TEACHER.lastName)
      cy.contains('Avis de renvoi').click()
    })
    cy.get('.message-details-content').should('contain', firingReason)
  })

  it('registration behaviour (from Classical slot)', () => {
    // Create firing slot
    cy.get('[data-test=slot-type-item-' + slotTypes.fired.type + ']').click()
    utils.createSlot(slotToRegisterInside)

    // Select student
    utils.selectStudent(studentsToRegister)

    // Open registration modal
    utils.openSlotPopup(slotToRegisterInside, '2/2')
    cy.get('[data-test=openRegistration-option]').click()

    // Test registration modal (ends by registering student)
    testRegistrationModal(slotToRegisterInside, studentsToRegister, classicalSlotToBeFiredFrom)

    // Check the classical slot is added in grey to the student's schedule
    cy.get('.grayed >> [data-test="' + slotToRegisterInside.date.format('MM-DD') + '_' + slotToRegisterInside.startHour + '"]').within(() => {
      cy.contains(slotToRegisterInside.teacherLastName).first().should('exist')
    })

    // Check the slot's student list
    utils.openSlotPopup(slotToRegisterInside, '1/2')
    cy.get('[data-test=showStudentList-option]').click()
    cy.get('[data-test=student-list-modal]').within(() => {
      cy.contains(studentsToRegister.formattedName)
    })
    cy.get('[data-test=closeModal]').click()

    // Go in Horaires service
    cy.visit('/nero/horaires')

    // Check slots for the first student
    utils.selectStudent(studentsToRegister)
    cy.contains('[data-cy="' + slotToRegisterInside.date.format('MM-DD') + '_' + slotToRegisterInside.startHour + '"]', 'Renvoi').parent().within(() => {
      cy.contains(slotToRegisterInside.teacherLastName).first().should('exist')
    })

    // The teacher have to explain the firing
    cy.logout()
    cy.login(url, CLASSICAL_SLOT_TEACHER)

    cy.get('[data-test="pending-firing-modal"]').within(() => {
      // Check content
      cy.contains(studentsToRegister.formattedName).should('be.visible')
      cy.contains(classicalSlotToBeFiredFrom.formattedType).should('be.visible')
      cy.contains(classicalSlotToBeFiredFrom.date.format('DD MMM YYYY') + ' à ' + classicalSlotToBeFiredFrom.startHour).should('be.visible')

      // Set reason
      cy.get('textarea').type(firingReason)

      cy.contains('button', 'Envoyer').click()
    })

    cy.get('[data-test="pending-firing-modal"]').should('not.exist')

    // Check notifications (parents + doyen + class teacher)
    cy.log('TEST NOTIFICATION FOR PARENT')
    cy.logout()
    cy.login('/', PARENT)
    cy.get('#nav_entry_messagerie').click()
    cy.get('.message-container').first().within(() => { // have to be the last notification
      cy.contains(CLASSICAL_SLOT_TEACHER.firstName + ' ' + CLASSICAL_SLOT_TEACHER.lastName)
      cy.contains('Avis de renvoi').click()
    })
    cy.get('.message-details-content').should('contain', firingReason)

    cy.logout()
    cy.log('TEST NOTIFICATION FOR CLASSTEACHER')
    cy.login('/', CLASSTEACHER)
    cy.get('#nav_entry_messagerie').click()
    cy.get('.message-container').first().within(() => { // have to be the last notification
      cy.contains(CLASSICAL_SLOT_TEACHER.firstName + ' ' + CLASSICAL_SLOT_TEACHER.lastName)
      cy.contains('Avis de renvoi').click()
    })
    cy.get('.message-details-content').should('contain', firingReason)

    cy.log('TEST NOTIFICATION FOR DOYEN')
    cy.logout()
    cy.login('/', DOYEN)
    cy.get('#nav_entry_messagerie').click()
    cy.get('.message-container').first().within(() => { // have to be the last notification
      cy.contains(CLASSICAL_SLOT_TEACHER.firstName + ' ' + CLASSICAL_SLOT_TEACHER.lastName)
      cy.contains('Avis de renvoi').click()
    })
    cy.get('.message-details-content').should('contain', firingReason)
  })

  after(() => { // TODO to find an other solution
    // Delete the created slot for next tests (bad practice but yes)
    cy.login(url)
    utils.waitCalendarToLoad()
    cy.get('[data-test=slot-type-item-' + slotTypes.fired.type + ']').click()
    utils.deleteSlot(slotToRegisterInside, '1/2')
    cy.get('[data-test=edit-slot-modal]').should('not.exist')
    utils.waitCalendarToLoad()
    utils.deleteSlot(slotToRegisterInside, '1/2') // One for each 'it'
    cy.get('[data-test=edit-slot-modal]').should('not.exist')
    utils.waitCalendarToLoad()
    cy.get('[data-test=slot-type-item-' + slotTypes.study.type + ']').click()
    utils.deleteSlot(HHCSlotToBeFiredFrom, '1/2')
  })
})