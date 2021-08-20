import {
  now,
  url,
  slotTypes
} from '../../../support/constants/horairesHorsCadres'

import utils from '../../../support/utils/horairesHorsCardesUtils'

const slotToRegisterInside = {
  day: 'wed',
  date: now,
  startHour: '12:00',
  endHour: '13:00',
  teacherSearch: 'reg',
  teacherName: 'Regad Alexandre',
  teacherLastName: 'Regad',
  roomNumber: 'tg',
  capacity: 2
}

const slotToDeregister = {
  day: 'wed',
  date: now,
  startHour: '10:00',
  endHour: '11:00',
  teacherSearch: 'reg',
  teacherName: 'Regad Alexandre',
  teacherLastName: 'Regad',
  roomNumber: 'tg',
  capacity: 1
}

const studentsToRegister = [
  {
    name: 'ALOSTA ANYA (1051AC)',
    formattedName: 'Anya Alosta - 1051AC',
    search: 'alo'
  },
  {
    name: 'BARMAN MELISSA (1021LC)',
    formattedName: 'Melissa Barman - 1021LC',
    search: 'méli'
  },
  {
    name: 'SHAHABADI ALI (1153AC)',
    formattedName: 'Ali Shahabadi - 1153AC',
    search: 'ali'
  }
]

const waitForRefresh = () => {
  cy.wait(500)
  cy.get('.spinner').should('not.exist')
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

const clearSelectedUser = () => {
  cy.get('[data-test=user-completion-input]').within(() => {
    cy.get('.tag-item > .pc-times').click()
    cy.get('.tag-list').children().should('have.length', 0)
  })
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

const openStudentListModal = (slot, capacity) => {
  openSlotPopup(slot, capacity)
  cy.get('[data-test=showStudentList-option]').click()
}

const closeSlotPopup = (slot, capacity) => {
  clickOnSlot(slot, capacity)
  cy.get('[data-test=event-popup]').should('not.exist')
}

const testRegistrationModal = (slot, studentToRegister) => {
  cy.get('[data-test=student-registration-modal]').within(() => {
    cy.contains(studentToRegister.formattedName)
    cy.contains(slot.startHour)
    cy.get('.notify-parents [type="checkbox"]').should('be.checked')

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

describe('Study registration', () => {
  beforeEach(() => {
    cy.logout()
    cy.clock(now.toDate().getTime())
    cy.login(url)
    cy.get('[data-test=slot-type-item-' + slotTypes.study.type + ']').click()
  })

  it('check registration option existence', () => {
    // Create slot
    createSlot(slotToRegisterInside)

    // Open slot popup
    openSlotPopup(slotToRegisterInside, '2/2')
    cy.get('[data-test=openRegistration-option]').should('not.exist') // Since no student is selected, registration option should not exist

    // Select student
    cy.get('[data-test=user-completion-input] input').type(studentsToRegister[0].search)
    cy.tick(500)
    // Select student user
    cy.contains(studentsToRegister[0].name).click()

    // Open slot popup
    openSlotPopup(slotToRegisterInside, '2/2')
    cy.get('[data-test=openRegistration-option]').should('be.visible')

    // Set slot Capacity to 0
    cy.get('[data-test=openEditModal-option]').click()
    cy.get('[data-test=edit-slot-modal]').within(() => {
      cy.get('[type="number"]').clear().type(0)
      cy.get('.button').contains('Valider').click()
    })
    utils.waitCalendarToLoad()

    // Open slot popup
    openSlotPopup(slotToRegisterInside, '0/0')
    cy.get('[data-test=openRegistration-option]').should('not.exist') // Cannot register student if not there is no place available
  })

  it('registration behaviour', () => {
    // Create slot
    createSlot(slotToRegisterInside)

    // Select student
    selectStudent(studentsToRegister[0])

    // Open registration modal
    openSlotPopup(slotToRegisterInside, '2/2')
    cy.get('[data-test=openRegistration-option]').click()

    // Test registration modal (ends by registering student)
    testRegistrationModal(slotToRegisterInside, studentsToRegister[0])

    // Check the HHC slot is added in grey to the student's schedule
    cy.get('.grayed >> [data-test="' + slotToRegisterInside.date.format('MM-DD') + '_' + slotToRegisterInside.startHour + '"]').within(() => {
      cy.contains(slotToRegisterInside.teacherLastName).first().should('exist')
    })

    // Try to register student a second time
    openSlotPopup(slotToRegisterInside, '1/2')
    cy.get('[data-test=openRegistration-option]').should('not.exist')
    closeSlotPopup(slotToRegisterInside, '1/2')

    // Register a second student
    clearSelectedUser()
    selectStudent(studentsToRegister[1])
    openSlotPopup(slotToRegisterInside, '1/2')
    cy.get('[data-test=openRegistration-option]').click()
    registerStudent(false)

    // Try to register a third student (but there is no place available)
    clearSelectedUser()
    selectStudent(studentsToRegister[2])
    openSlotPopup(slotToRegisterInside, '0/2')
    cy.get('[data-test=openRegistration-option]').should('not.exist')

    // Check the slot's student list
    cy.get('[data-test=showStudentList-option]').click()
    cy.get('[data-test=student-list-modal]').within(() => {
      cy.contains(studentsToRegister[0].formattedName)
      cy.contains(studentsToRegister[1].formattedName)
    })
    cy.get('[data-test=closeModal]').click()

    // Go in Horaires service
    cy.visit('/nero/horaires')

    // Check slots for the first student
    selectStudent(studentsToRegister[0])
    cy.contains('[data-cy="' + slotToRegisterInside.date.format('MM-DD') + '_' + slotToRegisterInside.startHour + '"]', 'Cercle d\'étude').parent().within(() => {
      cy.contains(slotToRegisterInside.teacherLastName).first().should('exist')
    })

    // TODO Check notification (parents and students?)
  })

  it.only('deregistration', () => {
    // Create slot
    createSlot(slotToDeregister)

    // Register someone inside
    selectStudent(studentsToRegister[0])
    openSlotPopup(slotToDeregister, '1/1')
    cy.get('[data-test=openRegistration-option]').click()
    registerStudent(false)

    // Open the slot's student list
    openSlotPopup(slotToDeregister, '0/1')
    cy.get('[data-test=showStudentList-option]').click()

    // Open the list and unregister student
    cy.get('[data-test=student-list-modal]').within(() => {
      cy.contains(studentsToRegister[0].formattedName).parent().find('[data-test=unregister]').click()
    })

    // Confirm unregistration
    cy.get('[data-test=student-registration-modal]').within(() => {
      cy.contains('Désinscription')
      cy.contains(studentsToRegister[0].formattedName)
      cy.contains(slotToDeregister.startHour)

      cy.contains('button', 'Désinscrire').click()
    })

    // The list no longer contains the student
    cy.get('[data-test=student-list-modal]').within(() => {
      cy.contains('Aucun élève n\'est inscrit sur ce créneau')
    })
    cy.get('[data-test=closeModal]').click()

    // The slot have afresh 1/1 free places and can register students
    openSlotPopup(slotToDeregister, '1/1')
    cy.get('[data-test=showStudentList-option]').should('exist')

    // The student's schedule no longer have the HHC slot
    cy.get('.grayed >> [data-test="' + slotToDeregister.date.format('MM-DD') + '_' + slotToDeregister.startHour + '"]').should('not.exist')

    // Go in Horaires service
    cy.visit('/nero/horaires')

    // Check slots for the student
    selectStudent(studentsToRegister[0])
    cy.contains('[data-cy="' + slotToDeregister.date.format('MM-DD') + '_' + slotToDeregister.startHour + '"]', 'Cercle d\'étude').should('not.exist')
  })

  it('delete slot after registration', () => {
    // delete slot after registration
  })

  it('can check in', () => {
  })

  it('mobile registration', () => {
  })

  //   // Select student
  //   cy.get('[data-test=user-completion-input] input').type(studentSearch)
  //   cy.tick(500)
  //
  //   // Select teacher user
  //   cy.contains(studentName).click()
  //   waitForRefresh()
  //
  //   // Click on Depannage slot - Thu May the 6th
  //   cy.get('.fc-day-thu  .fc-timegrid-col-frame .fc-timegrid-col-events div[title="A. Regad"]')
  //     .click()
  //
  //   // Depannage modal should have opened
  //   cy.get('.event-popup').should('be.visible')
  //
  //   // Click on student list button
  //   cy.get('.event-popup i.fa-list').click()
  //
  //   // No student registered
  //   cy.get('.no-students-placeholder').contains("Aucun élève n'est inscrit sur ce créneau")
  //
  //   // Close modal
  //   cy.get('[data-test="closeModal"]').click()
  //
  //   // Click on Depannage slot - Wed May the 5th
  //   cy.get('.fc-day-thu  .fc-timegrid-col-frame .fc-timegrid-col-events div[title="A. Regad"]')
  //     .click()
  //
  //   // Depannage modal should have opened
  //   cy.get('.event-popup').should('be.visible')
  //
  //   // Click on the register button
  //   cy.get('.event-popup i.fa-user-plus').should('be.visible')
  //   cy.get('.event-popup i.fa-user-plus').click()
  //
  //   // Registration modal should open
  //   cy.get('.student-registration-modal').should('be.visible')
  //
  //   // Register
  //   cy.get('.student-registration-modal button.register').contains('Inscrire')
  //   cy.get('.student-registration-modal button.register').click()
  //
  //   // Modal should close
  //   cy.get('.student-registration-modal').should('not.exist')
  //
  //   // Remaining capacity decreases
  //   cy.get('.fc-day-thu  .fc-timegrid-col-frame .fc-timegrid-col-events .fc-event-room').contains('1545')
  //
  //   // Visit horaires service
  //   cy.visit('/nero/horaires')
  //   waitForRefresh()
  //   cy.get('.weeknumber-label').then($elements => { cy.wrap($elements[2]).click() })
  //
  //   cy.get('.search .base-input').type(studentSearch)
  //   // Tick to throw completion timeout
  //   cy.tick(500)
  //
  //   cy.get('.search .base-autocomplete').should('be.visible')
  //   // Select student user
  //   cy.contains(studentName).click()
  //   waitForRefresh()
  //
  //   // Check events number
  //   cy.get('.fc-timegrid-event').should('have.length', 41)
  //
  //   // The schoollife session appears in the student's schedule
  //   cy.get('.fc-day-thu  .fc-timegrid-col-frame .fc-timegrid-col-events div[title="A. Regad"]').should('exist')
  // })

  // it('Unregister student depannage', () => {
  //   // Select student
  //   cy.get('[data-test=user-completion-input] input').type(studentSearch)
  //   cy.tick(500)

  //   // Select teacher user
  //   cy.contains(studentName).click()
  //   waitForRefresh()

  //   // Click on Depannage slot - Wed May the 5th
  //   cy.get('.fc-day-thu  .fc-timegrid-col-frame .fc-timegrid-col-events .fc-event-room').contains('1545')
  //     .click()

  //   // Depannage modal should have opened
  //   cy.get('.event-popup').should('be.visible')

  //   // Register button is not visible because current student is already registered
  //   cy.get('.event-popup i.fa-user-plus').should('not.exist')
  //   cy.get('.event-popup i.fa-list').should('be.visible')
  //   cy.get('.event-popup i.fa-list').click()

  //   // Registration modal should open
  //   cy.get('.student-list-modal').should('be.visible')

  //   // Student should appear
  //   cy.get('.student-list-modal .student-list .student').should('have.length', 1)
  //   cy.get('.student-list-modal .student-list .student').contains('Melissa Barman - 1021LC')

  //   // Click on unregister button
  //   cy.get('.student-list-modal .student-list .student i.fa-sign-out-alt').click()

  //   // Unregister confirmation modal opens
  //   cy.get('.student-registration-modal').should('be.visible')

  //   // Confirm unregistation
  //   cy.get('.student-registration-modal span').contains('Désinscrire').should('be.visible')
  //   cy.get('.student-registration-modal span').contains('Désinscrire').click()

  //   // Unregistration modal closes
  //   cy.get('.student-registration-modal').should('not.exist')

  //   // No remaining registered student
  //   cy.get('.student-list-modal .no-students-placeholder').contains("Actuellement, aucun élève n'est inscrit sur ce créneau")

  //   // Close modal
  //   cy.get('[data-test="closeModal"]').click()

  //   // Remaining capacity increases
  //   cy.get('.fc-day-thu  .fc-timegrid-col-frame .fc-timegrid-col-events .fc-event-room').contains('1546')
  // })
})
