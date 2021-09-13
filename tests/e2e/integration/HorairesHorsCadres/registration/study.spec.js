import {
  now,
  url,
  slotTypes
} from '../../../support/constants/horairesHorsCadres'

import utils from '../../../support/utils/horairesHorsCardesUtils'
import { CLASSTEACHER, DOYEN, HEADMASTER, PARENT, STUDENT, TEACHER } from '../../../support/constants'
import dayjs from 'dayjs'

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

const classSlot = {
  day: 'wed',
  date: now,
  startHour: '13:00',
  endHour: '14:00',
  teacherSearch: 'reg',
  teacherName: 'Regad Alexandre',
  teacherLastName: 'Regad',
  roomNumber: 'tg',
  capacity: 25
}

const slotToDeregister = {
  day: 'wed',
  date: now,
  startHour: '13:00',
  endHour: '14:00',
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

const openStudentListModal = (slot, capacity) => {
  utils.openSlotPopup(slot, capacity)
  cy.get('[data-test=showStudentList-option]').click()
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

const checkMessage = () => {
  cy.get('#nav_entry_messagerie').click()
  cy.get('.message-container').first().within(() => { // have to be the last notification
    cy.contains(HEADMASTER.firstName + ' ' + HEADMASTER.lastName)
    cy.contains('Cercle d\'étude le ' + now.format('dddd') + ' à 12h').click()
  })
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
    utils.createSlot(slotToRegisterInside)

    // Open slot popup
    utils.openSlotPopup(slotToRegisterInside, '2/2')
    cy.get('[data-test=openRegistration-option]').should('not.exist') // Since no student is selected, registration option should not exist

    // Select student
    cy.get('[data-test=user-completion-input] input').type(studentsToRegister[0].search)
    cy.tick(500)
    // Select student user
    cy.contains(studentsToRegister[0].name).click()

    // Open slot popup
    utils.openSlotPopup(slotToRegisterInside, '2/2')
    cy.get('[data-test=openRegistration-option]').should('be.visible')

    // Set slot Capacity to 0
    cy.get('[data-test=openEditModal-option]').click()
    cy.get('[data-test=edit-slot-modal]').within(() => {
      cy.get('[type="number"]').clear().type(0)
      cy.get('.button').contains('Valider').click()
    })
    utils.waitCalendarToLoad()

    // Open slot popup
    utils.openSlotPopup(slotToRegisterInside, '0/0')
    cy.get('[data-test=openRegistration-option]').should('not.exist') // Cannot register student if not there is no place available
  })

  it('can register a list of student from their class', () => {
    const classObject = { formattedName: '0932R3', studentCount: 24 }
    // Create slot
    utils.createSlot(classSlot)

    // Open slot popup
    utils.openSlotPopup(classSlot, `${classSlot.capacity}/${classSlot.capacity}`)
    cy.get('[data-test=openRegistration-option]').should('not.exist')

    // Select class
    cy.contains('Classe').click()
    cy.contains(classObject.formattedName).click()
    cy.tick(500)

    // Open slot popup
    utils.openSlotPopup(classSlot, `${classSlot.capacity}/${classSlot.capacity}`)
    cy.get('[data-test=openRegistration-option]').should('be.visible')

    // Register class
    cy.get('[data-test=openRegistration-option]').click()
    testRegistrationModal(classSlot, classObject)
    // check student list
    cy.contains(`${classSlot.capacity - classObject.studentCount}/${classSlot.capacity}`).should('be.visible')

    // Check inputs reset
    // Select student
    cy.get('[data-test=user-completion-input] input').type(studentsToRegister[0].search)
    cy.tick(500)
    cy.contains(studentsToRegister[0].name).click()
    cy.contains('Classe').should('be.visible')

    // Select class
    cy.contains('Classe').click()
    cy.contains(classObject.formattedName).click()
    cy.tick(500)
    cy.get('.base-input').should('be.empty')

    // TODO remove clean up and init DB before each ?
    // Clean up
    utils.deleteSlot(classSlot, `${classSlot.capacity - classObject.studentCount}/${classSlot.capacity}`)
  })

  it('registration behaviour', () => {
    // Create slot
    utils.createSlot(slotToRegisterInside)

    // Select student
    utils.selectStudent(studentsToRegister[0])

    // Open registration modal
    utils.openSlotPopup(slotToRegisterInside, '2/2')
    cy.get('[data-test=openRegistration-option]').click()

    // Test registration modal (ends by registering student)
    testRegistrationModal(slotToRegisterInside, studentsToRegister[0])

    // Check the HHC slot is added in grey to the student's schedule
    cy.get('.grayed >> [data-test="' + slotToRegisterInside.date.format('MM-DD') + '_' + slotToRegisterInside.startHour + '"]').within(() => {
      cy.contains(slotToRegisterInside.teacherLastName).first().should('exist')
    })

    // Try to register student a second time
    utils.openSlotPopup(slotToRegisterInside, '1/2')
    cy.get('[data-test=openRegistration-option]').should('not.exist')
    utils.closeSlotPopup(slotToRegisterInside, '1/2')

    // Register a second student
    utils.clearSelectedUser()
    utils.selectStudent(studentsToRegister[1])
    utils.openSlotPopup(slotToRegisterInside, '1/2')
    cy.get('[data-test=openRegistration-option]').click()
    registerStudent(false)

    // Try to register a third student (but there is no place available)
    utils.clearSelectedUser()
    utils.selectStudent(studentsToRegister[2])
    utils.openSlotPopup(slotToRegisterInside, '0/2')
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
    utils.selectStudent(studentsToRegister[0])
    cy.contains('[data-cy="' + slotToRegisterInside.date.format('MM-DD') + '_' + slotToRegisterInside.startHour + '"]', 'Cercle d\'étude').parent().within(() => {
      cy.contains(slotToRegisterInside.teacherLastName).first().should('exist')
    })

    // Check notifications (student, parents, doyen, class teacher)
    cy.logout()
    cy.login('/', STUDENT)
    checkMessage()

    cy.logout()
    cy.login('/', PARENT)
    checkMessage()

    cy.logout()
    cy.login('/', CLASSTEACHER)
    checkMessage()

    cy.logout()
    cy.login('/', DOYEN)
    checkMessage()
  })

  it('deregistration', () => {
    // Create slot
    utils.createSlot(slotToDeregister)

    // Register someone inside
    utils.selectStudent(studentsToRegister[0])
    utils.openSlotPopup(slotToDeregister, '1/1')
    cy.get('[data-test=openRegistration-option]').click()
    registerStudent(false)

    // Open the slot's student list
    utils.openSlotPopup(slotToDeregister, '0/1')
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
    utils.openSlotPopup(slotToDeregister, '1/1')
    cy.get('[data-test=showStudentList-option]').should('exist')
    utils.closeSlotPopup(slotToDeregister, '1/1')

    // The student's schedule no longer have the HHC slot
    cy.get('.grayed >> [data-test="' + slotToDeregister.date.format('MM-DD') + '_' + slotToDeregister.startHour + '"]').should('not.exist')

    // Go in Horaires service
    cy.visit('/nero/horaires')

    // Check slots for the student
    utils.selectStudent(studentsToRegister[0])
    cy.contains('[data-cy="' + slotToDeregister.date.format('MM-DD') + '_' + slotToDeregister.startHour + '"]', 'Cercle d\'étude').should('not.exist')

    // TODO Check notification?
  })

  it('deregistration option displayed', () => {
    // Register student into slot
    // Create slot
    utils.createSlot(slotToDeregister)


    cy.logout()
    cy.login(url, TEACHER) // Author of registration is TEACHER

    // Register someone inside
    utils.selectStudent(studentsToRegister[0])
    utils.openSlotPopup(slotToDeregister, '1/1')
    cy.get('[data-test=openRegistration-option]').click()
    registerStudent(false)


    // Open the slot's student list
    utils.openSlotPopup(slotToDeregister, '0/1')
    cy.get('[data-test=showStudentList-option]').click()

    // Open the list and unregister student
    cy.get('[data-test=student-list-modal]').within(() => {
      cy.contains(studentsToRegister[0].formattedName).parent().find('[data-test=unregister]').should('be.visible')
    })
  })

  it('delete slot after registration', () => {
    // Create slot
    utils.createSlot(slotToDeregister)

    // Register someone inside
    utils.selectStudent(studentsToRegister[0])
    utils.openSlotPopup(slotToDeregister, '1/1')
    cy.get('[data-test=openRegistration-option]').click()
    registerStudent(false)

    // Delete slot
    utils.deleteSlot(slotToDeregister, '0/1')

    // The student's schedule no longer have the HHC slot
    cy.get('.grayed >> [data-test="' + slotToDeregister.date.format('MM-DD') + '_' + slotToDeregister.startHour + '"]').should('not.exist')

    // Go in Horaires service
    cy.visit('/nero/horaires')

    // Check slots for the student
    utils.selectStudent(studentsToRegister[0])
    cy.contains('[data-cy="' + slotToDeregister.date.format('MM-DD') + '_' + slotToDeregister.startHour + '"]', 'Cercle d\'étude').should('not.exist')

    // TODO Check notification?
  })

  it('mobile registration', () => {
    // TODO
  })

  after(() => { // TODO to find an other solution
    // Delete the created slot for next tests (bad practice but yes)
    cy.visit(url)
    utils.waitCalendarToLoad()
    cy.get('[data-test=slot-type-item-' + slotTypes.study.type + ']').click()
    utils.deleteSlot(slotToRegisterInside, '0/0')
    cy.get('[data-test=slot-type-item-' + slotTypes.study.type + ']').click()
    utils.deleteSlot(slotToRegisterInside, '1/2')
    cy.get('[data-test=slot-type-item-' + slotTypes.study.type + ']').click()
    utils.deleteSlot(slotToRegisterInside, '0/2')
    cy.get('[data-test=slot-type-item-' + slotTypes.study.type + ']').click()
    utils.deleteSlot(slotToDeregister, '1/1')
  })
})

describe('Check in study', () => {
  const nowBis = dayjs('2021-06-23T16:00:00.000Z') // because more convenient to do those tests with DB data

  beforeEach(() => {
    cy.logout()
    cy.clock(nowBis.toDate().getTime())
    cy.login(url, TEACHER)
    cy.get('[data-test=slot-type-item-' + slotTypes.study.type + ']').click()
  })

  it('Check in appear only on teacher\'s course', () => {
    // Do the check in of a slot with one student registered
    openStudentListModal({ date: nowBis, startHour: '13:00' }, '14/15')
    // Check the check in modal
    cy.get('[data-test=student-list-modal]').within(() => {
      cy.contains('Melissa Barman - 1021LC').parent().find('[type="checkbox"]').should('not.be.checked').check()
        .should('be.checked').uncheck()
        .should('not.be.checked')
      cy.contains('button', 'Faire l\'appel').should('be.visible').click()
    })
    cy.get('[data-test=student-list-modal]').should('not.exist')

    // TODO Test missing student notification at the end of course when scheduler triggers

    // A teacher cannot check-in on others slots
    openStudentListModal({ date: nowBis.add(1, 'day'), startHour: '10:00' }, '47/48') // This slot is oversee by an other teacher
    cy.get('[data-test=student-list-modal]').within(() => {
      cy.contains('Alexia Arsenio - 0921R2').parent().find('[type="checkbox"]').should('not.exist')
      cy.contains('button', 'Faire l\'appel').should('not.exist')
    })

    // TODO cannot do the check in before the slot's date
  })

  it('Check in mobile', () => {
    // TODO
  })
})
