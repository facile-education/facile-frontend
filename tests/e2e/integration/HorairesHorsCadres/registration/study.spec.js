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
  addTimeToSlot,
  getHHCSlot,
  getUserSlot,
  selectSlotType,
  selectStudent,
  selectWeek
} from '../../../support/utils/horairesHorsCardesUtils'
import { getThread, waitMessagingToBeLoaded } from '../../../support/utils/messagingUtils'

const studentToRegister = STUDENT // Because normal Student is already register in the hhc tables

const rolesThatCanRegister = [HEADMASTER, SECRETARY, DOYEN, TEACHER]

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

describe('HHC_Study_Registration', () => {
  beforeEach(() => {
    cy.fixture('hhc.json').as('hhcData').then(data => {
      cy.clock(Cypress.dayjs(data.now, 'YYYY/MM/DD HH:mm').toDate().getTime())
    })
    cy.loadTables('schoollife/schoollife_tables_empty.sql')
    cy.loadTables('messaging/messaging_tables_empty.sql') // to empty
  })

  it('HHC_Study_Registration_IsPresentForGoodRoles', function () {
    const slotToRegisterInside = this.hhcData.slotsTypes.study.slotExample

    rolesThatCanRegister.forEach(role => {
      cy.login(role, HHCURL)
      selectSlotType(this.hhcData.slotsTypes.study)
      // Select student
      selectStudent(studentToRegister)
      // Open registration modal
      getHHCSlot(slotToRegisterInside).click()
      cy.get('[data-test=event-popup]').get('[data-test=registerStudent-option]').should('exist') // be.visible is better but sometimes calendar is wierd
    })

    // There is no roles that cannot register among role that can access to HHC
  })

  it('HHC_Study_Registration_Register', function () {
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
    getHHCSlot(slotToRegisterInside).click()
    cy.get('[data-test=registerStudent-option]').click()

    // Test registration modal (ends by registering student)
    testRegistrationModal(slotToRegisterInside, studentToRegister, undefined, notifyParent)

    // Check the HHC slot is added in grey to the student's schedule
    getUserSlot(slotToRegisterInside).should('exist')

    // Check the slot's student list
    const capacityLabel = slotToRegisterInside.capacity - 1 + '/' + slotToRegisterInside.capacity
    getHHCSlot(slotToRegisterInside).should('contain', capacityLabel).click()
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

  it('HHC_Study_Registration_RegisterAClass', function () {
    const slotToRegisterInside = this.hhcData.slotsTypes.study.slotExample
    const notifyParent = getRandomBoolean()
    const registerer = rolesThatCanRegister[0]
    const classToRegister = { name: '0933R3', nbStudents: 20 } // STUDENT's class

    // Connect with someone who can register
    cy.login(registerer, HHCURL)
    selectSlotType(this.hhcData.slotsTypes.study)

    selectClass(classToRegister.name)
    // Open registration modal
    getHHCSlot(slotToRegisterInside).click()
    cy.get('[data-test=registerStudent-option]').click({ force: true })

    // Test registration modal (ends by registering student)
    cy.intercept('GET', '**/schedule.cdtsession/get-group-sessions**').as('getGroupSessions')

    testRegistrationModal(slotToRegisterInside, undefined, classToRegister, notifyParent)

    // Check the HHC slot is added in grey to the student's schedule
    // getUserSlot(slotToRegisterInside).should('exist') // TODO

    // Check the slot's student list
    const capacityLabel = slotToRegisterInside.capacity - classToRegister.nbStudents + '/' + slotToRegisterInside.capacity
    cy.wait('@getGroupSessions')
    getHHCSlot(slotToRegisterInside).should('contain', capacityLabel).click() // here
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
    cy.wait('@getGroupSessions')
    getHHCSlot(nextWeekUserSlot).should('contain', capacityLabel).click()

    notifications(slotToRegisterInside).forEach(notification => {
      if (notification.role !== PARENT || notifyParent) {
        cy.login(notification.role, messagingURL)
        waitMessagingToBeLoaded()
        getThread(notification.expectedThread).should('be.visible')
      }
    })
  })
})
