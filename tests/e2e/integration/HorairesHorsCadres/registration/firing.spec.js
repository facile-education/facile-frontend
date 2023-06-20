import { CLASSTEACHER, DOYEN, PARENT, SECRETARY, TEACHER } from '../../../support/constants'
import {
  now,
  slotTypes,
  url
} from '../../../support/constants/horairesHorsCadres'
import utils from '../../../support/utils/horairesHorsCardesUtils'

const FIRING_SUPERVISOR = TEACHER

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
const firingTeacherRecipients = 'Sandra Prevosti, Darko Jovanovic, Isabel Mendez'

const studentToRegister = {
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
    cy.clock(now.toDate().getTime())
    cy.exec('npm run db:loadTables schoollife_tables.sql')
    cy.clearDBCache()
    cy.logout()
    cy.login(url)
  })

  it('registration behaviour (from HHC slot)', () => {
    // Create hhc slot to be fired from
    cy.get('[data-test=slot-type-item-' + slotTypes.study.type + ']').click()
    utils.createSlot(HHCSlotToBeFiredFrom)
    // Register the student inside
    utils.selectStudent(studentToRegister)
    utils.openSlotPopup(HHCSlotToBeFiredFrom, '2/2')
    cy.get('[data-test=openRegistration-option]').click()
    registerStudent(false)

    // Create firing slot
    cy.get('[data-test=slot-type-item-' + slotTypes.fired.type + ']').click()
    utils.createSlot(slotToRegisterInside)

    // Try to open registration modal
    utils.openSlotPopup(slotToRegisterInside, '2/2')
    cy.get('[data-test=openRegistration-option]').should('exist') // Directeur, secretery, doyen and supervoisor can register student

    cy.logout()

    // Check doyen and secretaire right to register students
    cy.log('Check doyen rights to register student')
    cy.login(url, DOYEN)
    cy.get('[data-test=slot-type-item-' + slotTypes.fired.type + ']').click()
    utils.selectStudent(studentToRegister)
    // Open registration modal
    utils.openSlotPopup(slotToRegisterInside, '2/2')
    cy.get('[data-test=openRegistration-option]').should('exist')
    cy.logout()

    cy.log('Check secretary rights to register student')
    cy.login(url, SECRETARY)
    cy.get('[data-test=slot-type-item-' + slotTypes.fired.type + ']').click()
    utils.selectStudent(studentToRegister)
    // Open registration modal
    utils.openSlotPopup(slotToRegisterInside, '2/2')
    cy.get('[data-test=openRegistration-option]').should('exist')
    cy.logout()

    cy.login(url, FIRING_SUPERVISOR)
    cy.get('[data-test=slot-type-item-' + slotTypes.fired.type + ']').click()
    utils.selectStudent(studentToRegister)

    // Open registration modal
    utils.openSlotPopup(slotToRegisterInside, '2/2')
    cy.get('[data-test=openRegistration-option]').click()

    // Test registration modal (ends by registering student)
    testRegistrationModal(slotToRegisterInside, studentToRegister, HHCSlotToBeFiredFrom)

    // Check the HHC slot is added in grey to the student's schedule
    cy.get('.grayed >> [data-test="' + slotToRegisterInside.date.format('MM-DD') + '_' + slotToRegisterInside.startHour + '"]').within(() => {
      cy.contains(slotToRegisterInside.teacherLastName).first().should('exist')
    })

    // Check the slot's student list
    utils.openSlotPopup(slotToRegisterInside, '1/2')
    cy.get('[data-test=showStudentList-option]').click()
    cy.get('[data-test=student-list-modal]').within(() => {
      cy.contains(studentToRegister.formattedName)
    })
    cy.get('[data-test=closeModal]').click()

    // Go in Horaires service
    cy.visit('/nero/horaires')

    // Check slots for the first student
    utils.clearSelectedUser()
    utils.selectStudent(studentToRegister)
    cy.contains('[data-cy="' + slotToRegisterInside.date.format('MM-DD') + '_' + slotToRegisterInside.startHour + '"]', 'Renvoi').parent().within(() => {
      cy.contains(slotToRegisterInside.teacherLastName).first().should('exist')
    })

    // The teacher have to explain the firing
    cy.logout()
    cy.login(url, TEACHER)

    cy.get('[data-test="pending-firing-modal"]').within(() => {
      // Check content
      cy.contains(studentToRegister.formattedName).should('be.visible')
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
    // Check the message recipients (2 doyens and main teacher) and messag content
    cy.get('#message-receivers').should('contain', firingTeacherRecipients)
    cy.get('.message-details-content').should('contain', firingReason)
  })

  it('registration behaviour (from Classical slot)', () => {
    // Create firing slot
    cy.get('[data-test=slot-type-item-' + slotTypes.fired.type + ']').click()
    utils.createSlot(slotToRegisterInside)

    // Select student
    utils.selectStudent(studentToRegister)

    // Try to open registration modal
    utils.openSlotPopup(slotToRegisterInside, '2/2')
    cy.get('[data-test=openRegistration-option]').should('exist') // Directeur, secretaire, doyen and supervoisor can register student
    cy.logout()

    cy.login(url, FIRING_SUPERVISOR)
    cy.get('[data-test=slot-type-item-' + slotTypes.fired.type + ']').click()
    utils.selectStudent(studentToRegister)

    // Open registration modal
    utils.openSlotPopup(slotToRegisterInside, '2/2')
    cy.get('[data-test=openRegistration-option]').click()

    // Test registration modal (ends by registering student)
    testRegistrationModal(slotToRegisterInside, studentToRegister, classicalSlotToBeFiredFrom)

    // Check the classical slot is added in grey to the student's schedule
    cy.get('.grayed >> [data-test="' + slotToRegisterInside.date.format('MM-DD') + '_' + slotToRegisterInside.startHour + '"]').within(() => {
      cy.contains(slotToRegisterInside.teacherLastName).first().should('exist')
    })

    // Check the slot's student list
    utils.openSlotPopup(slotToRegisterInside, '1/2')
    cy.get('[data-test=showStudentList-option]').click()
    cy.get('[data-test=student-list-modal]').within(() => {
      cy.contains(studentToRegister.formattedName)
    })
    cy.get('[data-test=closeModal]').click()

    // Go in Horaires service
    cy.visit('/nero/horaires')

    // Check slots for the first student
    utils.clearSelectedUser()
    utils.selectStudent(studentToRegister)
    cy.contains('[data-cy="' + slotToRegisterInside.date.format('MM-DD') + '_' + slotToRegisterInside.startHour + '"]', 'Renvoi').parent().within(() => {
      cy.contains(slotToRegisterInside.teacherLastName).first().should('exist')
    })

    // The teacher have to explain the firing
    cy.logout()
    cy.login(url, CLASSICAL_SLOT_TEACHER)

    cy.get('[data-test="pending-firing-modal"]').within(() => {
      // Check content
      cy.contains(studentToRegister.formattedName).should('be.visible')
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
    // Check the message recipients (2 doyens and main teacher) and messag content
    cy.get('#message-receivers').should('contain', firingTeacherRecipients)
    cy.get('.message-details-content').should('contain', firingReason)
  })
})
