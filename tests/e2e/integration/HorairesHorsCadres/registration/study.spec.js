import { HHCURL, messagingURL } from '../../../support/constants/urls'
import {
  CLASSTEACHER,
  DOYEN,
  HEADMASTER,
  PARENT,
  SECRETARY,
  STUDENT,
  TEACHER
} from '../../../support/constants/users'
import {
  getSlot,
  getUserSlot,
  selectSlotType,
  selectStudent,
  addTimeToSlot,
  selectWeek
} from '../../../support/utils/horairesHorsCardesUtils'
import { getThread, waitMessagingToBeLoaded } from '../../../support/utils/messagingUtils'

const studentToRegister = STUDENT // Because normal Student is already register in the hhc tables

const rolesThatCanRegister = [HEADMASTER, SECRETARY, DOYEN, TEACHER]
const rolesThatCannotRegister = []

function getRandomBoolean () {
  return Math.random() < 0.5
}

function selectClass (className) {
  cy.contains('button', 'Classe').click()
  cy.get('.base-dropdown').contains(className).click()
}

const notifications = (registeredSlot) => {
  return [ // TODO: test content
    {
      role: STUDENT,
      expectedThread: [{
        sender: HEADMASTER.firstName + ' ' + HEADMASTER.lastName,
        recipients: [PARENT.firstName + ' ' + PARENT.lastName],
        date: '',
        subject: 'Cercle d\'étude le ' + Cypress.dayjs(registeredSlot.startDate, 'YYYY/MM/DD HH:mm').format('dddd [à] HH[h]mm'),
        content: '',
        messageIndexInThread: 0
      }]
    },
    {
      role: PARENT,
      expectedThread: [{
        sender: HEADMASTER.firstName + ' ' + HEADMASTER.lastName,
        recipients: [PARENT.firstName + ' ' + PARENT.lastName],
        date: '',
        subject: 'Cercle d\'étude le ' + Cypress.dayjs(registeredSlot.startDate, 'YYYY/MM/DD HH:mm').format('dddd [à] HH[h]mm'),
        content: '',
        messageIndexInThread: 0
      }]
    },
    {
      role: CLASSTEACHER,
      expectedThread: [{
        sender: HEADMASTER.firstName + ' ' + HEADMASTER.lastName,
        recipients: [CLASSTEACHER.firstName + ' ' + CLASSTEACHER.lastName],
        date: '',
        subject: 'Cercle d\'étude le ' + Cypress.dayjs(registeredSlot.startDate, 'YYYY/MM/DD HH:mm').format('dddd [à] HH[h]mm'),
        content: '',
        messageIndexInThread: 0
      }]
    },
    {
      role: DOYEN,
      expectedThread: [{
        sender: HEADMASTER.firstName + ' ' + HEADMASTER.lastName,
        recipients: [DOYEN.firstName + ' ' + DOYEN.lastName],
        date: '',
        subject: 'Cercle d\'étude le ' + Cypress.dayjs(registeredSlot.startDate, 'YYYY/MM/DD HH:mm').format('dddd [à] HH[h]mm'),
        content: '',
        messageIndexInThread: 0
      }]
    }
  ]
}
const testRegistrationModal = (slot, studentToRegister, classToRegister, notifyParent = true) => {
  cy.get('[data-test=student-registration-modal]').within(() => {
    if (studentToRegister) {
      cy.contains(studentToRegister.firstName + ' ' + studentToRegister.lastName)
    } else {
      cy.contains(classToRegister.name)
    }
    cy.contains(Cypress.dayjs(slot.startDate, 'YYYY/MM/DD HH:mm').format('[le] DD MMMM YYYY [à] HH:mm'))
    cy.get('.notify-parents [type="checkbox"]').should('be.checked')
    if (!notifyParent) {
      cy.get('.notify-parents [type="checkbox"]').click()
      cy.get('.notify-parents [type="checkbox"]').should('not.be.checked')
    }

    cy.contains('button', 'Inscrire').click()
  })
  cy.get('[data-test=student-registration-modal]', { timeout: 20000 }).should('not.exist')
}

describe('Study registration', () => {
  beforeEach(() => {
    cy.fixture('hhc.json').as('hhcData').then(data => {
      cy.clock(Cypress.dayjs(data.now, 'YYYY/MM/DD HH:mm').toDate().getTime())
    })
    cy.loadTables('schoollife/schoollife_tables_empty.sql')
    cy.loadTables('messaging/messaging_tables_empty.sql') // to empty
  })

  it(' is present for good roles', function () {
    const slotToRegisterInside = this.hhcData.slotsTypes.study.slotExample

    rolesThatCannotRegister.forEach(role => {
      cy.login(role, HHCURL)
      selectSlotType(this.hhcData.slotsTypes.study)
      // Select student
      selectStudent(studentToRegister)
      // Open registration modal
      getSlot(slotToRegisterInside).click()
      cy.get('[data-test=registerStudent-option]').should('not.exist')
    })

    rolesThatCanRegister.forEach(role => {
      cy.login(role, HHCURL)
      selectSlotType(this.hhcData.slotsTypes.study)
      // Select student
      selectStudent(studentToRegister)
      // Open registration modal
      getSlot(slotToRegisterInside).click()
      cy.get('[data-test=registerStudent-option]').should('exist') // be.visible is better but sometimes calendar is wierd
    })
  })

  it('register a student', function () {
    const slotToRegisterInside = this.hhcData.slotsTypes.study.slotExample
    const notifyParent = getRandomBoolean()
    const registerer = rolesThatCanRegister[0]

    cy.log('Register student ' + studentToRegister.lastName + ' by ' + registerer.lastName + ' and ' + notifyParent ? '' : 'not ' + 'notify parents')

    // Connect with someone who can register
    cy.login(registerer, HHCURL)
    selectSlotType(this.hhcData.slotsTypes.study)

    // Select student
    selectStudent(studentToRegister)
    // Open registration modal
    getSlot(slotToRegisterInside).click()
    cy.get('[data-test=registerStudent-option]').click()

    // Test registration modal (ends by registering student)
    testRegistrationModal(slotToRegisterInside, studentToRegister, undefined, notifyParent)

    // Check the HHC slot is added in grey to the student's schedule
    getUserSlot(slotToRegisterInside).should('exist')

    // Check the slot's student list
    const capacityLabel = slotToRegisterInside.capacity - 1 + '/' + slotToRegisterInside.capacity
    getSlot(slotToRegisterInside).should('contain', capacityLabel).click()
    cy.get('[data-test=showStudentList-option]').click()
    cy.get('[data-test=student-list-modal]').within(() => {
      cy.contains(studentToRegister.firstName + ' ' + studentToRegister.lastName)
    })
    cy.get('[data-test=closeModal]').click()

    // Check the next week if student is already registered
    const nextWeekUserSlot = addTimeToSlot(slotToRegisterInside, 1, 'week')
    const nextWeek = Cypress.dayjs(this.hhcData.now, 'YYYY/MM/DD HH:mm').add(1, 'week')
    selectWeek(nextWeek)
    getUserSlot(nextWeekUserSlot).should('exist')

    notifications(slotToRegisterInside).forEach(notification => {
      if (notification.role !== PARENT || notifyParent) {
        cy.login(notification.role, messagingURL)
        waitMessagingToBeLoaded()
        getThread(notification.expectedThread).should('be.visible')
      }
    })
  })

  it('register a class', function () {
    const slotToRegisterInside = this.hhcData.slotsTypes.study.slotExample
    const notifyParent = getRandomBoolean()
    const registerer = rolesThatCanRegister[0]
    const classToRegister = { name: '0933R3', nbStudents: 20 } // STUDENT's class

    // Connect with someone who can register
    cy.login(registerer, HHCURL)
    selectSlotType(this.hhcData.slotsTypes.study)

    selectClass(classToRegister.name)
    // Open registration modal
    getSlot(slotToRegisterInside).click()
    cy.get('[data-test=registerStudent-option]').click({ force: true })

    // Test registration modal (ends by registering student)
    testRegistrationModal(slotToRegisterInside, undefined, classToRegister, notifyParent)

    // Check the HHC slot is added in grey to the student's schedule
    // getUserSlot(slotToRegisterInside).should('exist') // TODO

    // Check the slot's student list
    const capacityLabel = slotToRegisterInside.capacity - classToRegister.nbStudents + '/' + slotToRegisterInside.capacity
    getSlot(slotToRegisterInside).should('contain', 'Capacité: ' + capacityLabel).click()
    cy.get('[data-test=showStudentList-option]').click()
    cy.get('[data-test=student-list-modal]').within(() => {
      cy.contains(studentToRegister.firstName + ' ' + studentToRegister.lastName)
      cy.get('[data-test=student-list-item]').should('have.length', classToRegister.nbStudents)
    })
    cy.get('[data-test=closeModal]').click()

    // Check the next week if class is already registered
    const nextWeekUserSlot = addTimeToSlot(slotToRegisterInside, 1, 'week')
    const nextWeek = Cypress.dayjs(this.hhcData.now, 'YYYY/MM/DD HH:mm').add(1, 'week')
    selectWeek(nextWeek)
    getSlot(nextWeekUserSlot).should('contain', 'Capacité: ' + capacityLabel).click()

    notifications(slotToRegisterInside).forEach(notification => {
      if (notification.role !== PARENT || notifyParent) {
        cy.login(notification.role, messagingURL)
        waitMessagingToBeLoaded()
        getThread(notification.expectedThread).should('be.visible')
      }
    })
  })
})
