import {
  now,
  slotTypes,
  url
} from '../../../support/constants/horairesHorsCadres'
import utils from '../../../support/utils/horairesHorsCardesUtils'

const slotToRegisterInside = {
  day: 'wed',
  date: now,
  startHour: '10:00',
  endHour: '11:00',
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

const testRegistrationModal = (slot, studentToRegister) => {
  cy.get('[data-test=student-registration-modal]').within(() => {
    cy.contains(studentToRegister.formattedName)
    cy.contains(slot.startHour)
    cy.contains('Discipline').parent().find('.base-dropdown').click().within(() => {
      cy.get('li').should('have.length', 22)
      cy.contains('Allemand').click()
    })
    cy.get('.notify-parents [type="checkbox"]').should('be.checked')

    cy.contains('button', 'Inscrire').click()
  })
  utils.waitCalendarToLoad()
  cy.get('[data-test=student-registration-modal]').should('not.exist')
}

// NB: Some of registration main features are already tested in study type, so here is juste a basic registration test for replayTest slots
describe('Replay test registration', () => {
  beforeEach(() => {
    cy.clock(now.toDate().getTime())
    cy.exec('npm run db:loadTables schoollife_tables.sql')
    cy.clearDBCache()
    cy.logout()
    cy.login(url)
    cy.get('[data-test=slot-type-item-' + slotTypes.replayTest.type + ']').click()
  })

  it('registration behaviour', () => {
    // Create slot
    utils.createSlot(slotToRegisterInside)

    // Select student
    utils.selectStudent(studentsToRegister)

    // Open registration modal
    utils.openSlotPopup(slotToRegisterInside, '2/2')
    cy.get('[data-test=openRegistration-option]').click()

    // Test registration modal (ends by registering student)
    testRegistrationModal(slotToRegisterInside, studentsToRegister)

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
    cy.contains('[data-cy="' + slotToRegisterInside.date.format('MM-DD') + '_' + slotToRegisterInside.startHour + '"]', 'Travaux à refaire en Allemand').parent().within(() => {
      cy.contains(slotToRegisterInside.teacherLastName).first().should('exist')
    })

    // TODO Check notification (parents and students?)
  })
})
