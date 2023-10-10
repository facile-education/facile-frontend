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
  selectStudent
} from '../../../support/utils/horairesHorsCardesUtils'
import { getThread, waitMessagingToBeLoaded } from '../../../support/utils/messagingUtils'

const studentToRegister = STUDENT // Because normal Student is already register in the hhc tables

const rolesThatCanRegister = [HEADMASTER, SECRETARY, CLASSTEACHER, DOYEN, TEACHER]
const rolesThatCannotRegister = []

function getRandomBoolean () {
  return Math.random() < 0.5
}

const notifications = (registeredSlot) => {
  return [ // TODO: test content
    {
      role: STUDENT,
      expectedThread: [{
        sender: HEADMASTER.firstName + ' ' + HEADMASTER.lastName,
        recipients: [PARENT.firstName + ' ' + PARENT.lastName],
        date: '',
        subject: 'Retenue le ' + Cypress.dayjs(registeredSlot.startDate, 'YYYY/MM/DD HH:mm').format('DD MMMM YYYY [à] HH[h]mm'),
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
        subject: 'Retenue le ' + Cypress.dayjs(registeredSlot.startDate, 'YYYY/MM/DD HH:mm').format('DD MMMM YYYY [à] HH[h]mm'),
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
        subject: 'Retenue le ' + Cypress.dayjs(registeredSlot.startDate, 'YYYY/MM/DD HH:mm').format('DD MMMM YYYY [à] HH[h]mm'),
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
        subject: 'Retenue le ' + Cypress.dayjs(registeredSlot.startDate, 'YYYY/MM/DD HH:mm').format('DD MMMM YYYY [à] HH[h]mm'),
        content: '',
        messageIndexInThread: 0
      }]
    }
  ]
}

const comment = 'dissipé'

const testRegistrationModal = (slot, studentToRegister, notifyParent = true) => {
  cy.get('[data-test=student-registration-modal]').within(() => {
    cy.contains(studentToRegister.firstName + ' ' + studentToRegister.lastName)
    cy.contains(Cypress.dayjs(slot.startDate, 'YYYY/MM/DD HH:mm').format('[le] DD MMMM YYYY [à] HH:mm'))
    cy.get('textarea').type(comment)
    cy.get('.notify-parents [type="checkbox"]').should('be.checked')
    if (!notifyParent) {
      cy.get('.notify-parents [type="checkbox"]').click()
      cy.get('.notify-parents [type="checkbox"]').should('not.be.checked')
    }

    cy.contains('button', 'Inscrire').click()
  })
  cy.get('[data-test=student-registration-modal]').should('not.exist')
}

// NB: Some of registration main features are already tested in study type, so here is juste a basic registration test for replayTest slots
describe('Detention registration', () => {
  beforeEach(() => {
    cy.fixture('hhc.json').as('hhcData').then(data => {
      cy.clock(Cypress.dayjs(data.now, 'YYYY/MM/DD HH:mm').toDate().getTime())
    })
    cy.loadTables('schoollife/schoollife_tables_empty.sql')
    cy.loadTables('messaging/messaging_tables_empty.sql') // to empty
  })

  it(' is present for good roles', function () {
    const slotToRegisterInside = this.hhcData.slotsTypes.detention.slotExample

    rolesThatCannotRegister.forEach(role => {
      cy.login(role, HHCURL)
      selectSlotType(this.hhcData.slotsTypes.detention)
      // Select student
      selectStudent(studentToRegister)
      // Open registration modal
      getSlot(slotToRegisterInside).click()
      cy.get('[data-test=registerStudent-option]').should('not.exist')
    })

    rolesThatCanRegister.forEach(role => {
      cy.login(role, HHCURL)
      selectSlotType(this.hhcData.slotsTypes.detention)
      // Select student
      selectStudent(studentToRegister)
      // Open registration modal
      getSlot(slotToRegisterInside).click()
      cy.get('[data-test=registerStudent-option]').should('be.visible')
    })
  })

  it('registration behaviour', function () {
    const slotToRegisterInside = this.hhcData.slotsTypes.detention.slotExample
    const notifyParent = getRandomBoolean()
    const registerer = rolesThatCanRegister[0]

    cy.log('Register student ' + studentToRegister.lastName + ' by ' + registerer.lastName + ' and ' + notifyParent ? '' : 'not ' + 'notify parents')

    // Connect with someone who can register
    cy.login(registerer, HHCURL)
    selectSlotType(this.hhcData.slotsTypes.detention)

    // Select student
    selectStudent(studentToRegister)
    // Open registration modal
    getSlot(slotToRegisterInside).click()
    cy.get('[data-test=registerStudent-option]').click()

    // Test registration modal (ends by registering student)
    testRegistrationModal(slotToRegisterInside, studentToRegister, notifyParent)

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

    notifications(slotToRegisterInside).forEach(notification => {
      if (notification.role !== PARENT || notifyParent) {
        cy.login(notification.role, messagingURL)
        waitMessagingToBeLoaded()
        getThread(notification.expectedThread).click()
      }
    })
  })
})
