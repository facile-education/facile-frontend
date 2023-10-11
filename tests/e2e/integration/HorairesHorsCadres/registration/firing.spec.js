import { dashboardURL, HHCURL, messagingURL } from '../../../support/constants/urls'
import {
  CLASSTEACHER, CLASSTEACHER2,
  DOYEN,
  HEADMASTER,
  PARENT,
  PSYCHOLOGIST,
  SECRETARY,
  SOCIAL_COUNSELOR,
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
const firingSupervisor = CLASSTEACHER2
const firingTeacher = TEACHER

const rolesThatCanRegister = [HEADMASTER, SECRETARY, DOYEN, firingSupervisor]
const rolesThatCannotRegister = [firingTeacher]

const notifications = (registeredSlot, slotToBeFiredFrom) => {
  return [ // TODO: test content
    {
      role: firingTeacher,
      expectedThread: [{
        sender: firingSupervisor.firstName + ' ' + firingSupervisor.lastName,
        recipients: [firingTeacher.firstName + ' ' + firingTeacher.lastName],
        date: '',
        subject: 'Avis de renvoi : ' + studentToRegister.firstName + ' ' + studentToRegister.lastName + ' le ' + Cypress.dayjs(registeredSlot.startDate, 'YYYY/MM/DD HH:mm').format('DD MMMM YYYY'),
        content: '',
        messageIndexInThread: 0
      }],
      expectedActivityItem: {
        title: 'Motivation de renvoi',
        content: 'Pensez à motiver le renvoi de ' + studentToRegister.firstName + ' ' + studentToRegister.lastName
      }
    },
    {
      role: CLASSTEACHER,
      expectedThread: [{
        sender: firingSupervisor.firstName + ' ' + firingSupervisor.lastName,
        recipients: [CLASSTEACHER.firstName + ' ' + CLASSTEACHER.lastName],
        date: '',
        subject: 'Avis de renvoi : ' + studentToRegister.firstName + ' ' + studentToRegister.lastName + ' le ' + Cypress.dayjs(registeredSlot.startDate, 'YYYY/MM/DD HH:mm').format('DD MMMM YYYY'),
        content: '',
        messageIndexInThread: 0
      }],
      expectedActivityItem: {
        title: TEACHER.firstName + ' ' + TEACHER.lastName,
        content: 'a renvoyé ' + studentToRegister.firstName + ' ' + studentToRegister.lastName + ' du cours de ' + slotToBeFiredFrom.courseName
      }
    },
    {
      role: DOYEN,
      expectedThread: [{
        sender: firingSupervisor.firstName + ' ' + firingSupervisor.lastName,
        recipients: [DOYEN.firstName + ' ' + DOYEN.lastName],
        date: '',
        subject: 'Avis de renvoi : ' + studentToRegister.firstName + ' ' + studentToRegister.lastName + ' le ' + Cypress.dayjs(registeredSlot.startDate, 'YYYY/MM/DD HH:mm').format('DD MMMM YYYY'),
        content: '',
        messageIndexInThread: 0
      }],
      expectedActivityItem: {
        title: TEACHER.firstName + ' ' + TEACHER.lastName,
        content: 'a renvoyé ' + studentToRegister.firstName + ' ' + studentToRegister.lastName + ' du cours de ' + slotToBeFiredFrom.courseName
      }
    }
  ]
}

const havefiringReasonNotifications = [PARENT, CLASSTEACHER, DOYEN, SOCIAL_COUNSELOR, PSYCHOLOGIST]
const firingReasonNotifications = {
  expectedThread: [{
    sender: firingTeacher.firstName + ' ' + firingTeacher.lastName,
    recipients: [DOYEN.firstName + ' ' + DOYEN.lastName],
    date: '',
    subject: 'Avis de renvoi',
    content: '',
    messageIndexInThread: 0
  }]
}

const firingReason = "Je renvoie qui je veux d'abord!"

const testRegistrationModal = (slot, studentToRegister, slotToBeFiredFrom) => {
  const slotToBeFiringDropDownLabel = Cypress.dayjs(slotToBeFiredFrom.startDate, 'YYYY/MM/DD HH:mm').format('HH:mm') +
    ' / ' +
    Cypress.dayjs(slotToBeFiredFrom.endDate, 'YYYY/MM/DD HH:mm').format('HH:mm')

  cy.get('[data-test=student-registration-modal]').within(() => {
    cy.contains(studentToRegister.firstName + ' ' + studentToRegister.lastName)
    cy.contains(Cypress.dayjs(slot.startDate, 'YYYY/MM/DD HH:mm').format('[le] DD MMMM YYYY [à] HH:mm'))
    cy.get('textarea').should('not.exist')
    cy.get('.notify-parents [type="checkbox"]').should('not.exist')
    cy.contains('button', 'Sélectionnez un cours').click()
    cy.get('.base-dropdown').contains(slotToBeFiringDropDownLabel).click()

    cy.contains('button', 'Inscrire').click()
  })
  cy.get('[data-test=student-registration-modal]').should('not.exist')
}

// NB: Some of registration main features are already tested in study type, so here is juste a basic registration test for replayTest slots
describe('Firing registration', () => {
  beforeEach(() => {
    cy.fixture('hhc.json').as('hhcData').then(data => {
      cy.clock(Cypress.dayjs(data.now, 'YYYY/MM/DD HH:mm').toDate().getTime())
    })
    cy.loadTables('schoollife/schoollife_tables_empty.sql')
    cy.loadTables('messaging/messaging_tables_empty.sql') // to empty
  })

  it(' is present for good roles', function () {
    const slotToRegisterInside = this.hhcData.slotsTypes.fired.slotExample

    rolesThatCannotRegister.forEach(role => {
      cy.login(role, HHCURL)
      selectSlotType(this.hhcData.slotsTypes.fired)
      // Select student
      selectStudent(studentToRegister)
      // Open registration modal
      getSlot(slotToRegisterInside).click()
      cy.get('[data-test=registerStudent-option]').should('not.exist')
    })

    rolesThatCanRegister.forEach(role => {
      cy.login(role, HHCURL)
      selectSlotType(this.hhcData.slotsTypes.fired)
      // Select student
      selectStudent(studentToRegister)
      // Open registration modal
      getSlot(slotToRegisterInside).click()
      cy.get('[data-test=registerStudent-option]').should('exist')
    })
  })

  it('registration behaviour', function () {
    const slotToRegisterInside = this.hhcData.slotsTypes.fired.slotExample
    const slotToBeFiredFrom = this.hhcData.studentSlotToBeFired

    // Connect with someone who can register
    cy.login(rolesThatCanRegister[0], HHCURL)
    selectSlotType(this.hhcData.slotsTypes.fired)

    // Select student
    selectStudent(studentToRegister)
    // Open registration modal
    getSlot(slotToRegisterInside).click()
    cy.get('[data-test=registerStudent-option]').click()

    // Test registration modal (ends by registering student)
    testRegistrationModal(slotToRegisterInside, studentToRegister, slotToBeFiredFrom)

    // Check the HHC slot is added in grey to the student's schedule
    getUserSlot(slotToRegisterInside).should('exist')

    // Check student has been registered
    const capacityLabel = slotToRegisterInside.capacity - 1 + '/' + slotToRegisterInside.capacity
    getSlot(slotToRegisterInside).should('contain', capacityLabel).click()
    cy.get('[data-test=showStudentList-option]').click()
    cy.get('[data-test=student-list-modal]').within(() => {
      cy.contains(studentToRegister.firstName + ' ' + studentToRegister.lastName)
    })
    cy.get('[data-test=closeModal]').click()

    // Check notifications (messaging and dashboard activity)
    notifications(slotToRegisterInside, slotToBeFiredFrom).forEach(notification => {
      if (notification.expectedThread) {
        cy.login(notification.role, messagingURL)
        waitMessagingToBeLoaded()
        getThread(notification.expectedThread).should('be.visible')
      }
      if (notification.expectedActivityItem) {
        cy.login(notification.role, dashboardURL)
        cy.get('[data-test=activity-widget]', { timeout: 10000 }).within(() => {
          cy.contains(notification.expectedActivityItem.title).should('be.visible')
          cy.contains(notification.expectedActivityItem.content).should('be.visible')
        })
      }
    })
  })

  it('firingTeacher can set firing reason', function () {
    cy.loadTables('schoollife/schoollife_tables.sql')
    cy.login(firingTeacher, HHCURL)

    cy.get('[data-test=pending-firing-modal]').within(() => {
      cy.get('textarea').type(firingReason)
      cy.contains('Envoyer').click()
    })
    cy.get('[data-test=pending-firing-modal]').should('not.exist')

    // Test notifications
    havefiringReasonNotifications.forEach(role => {
      cy.login(role, messagingURL)
      waitMessagingToBeLoaded()
      getThread(firingReasonNotifications.expectedThread).click()
      cy.get('[data-test="message"]')
        .should('contain', STUDENT.firstName + ' ' + STUDENT.lastName)
        .should('contain', firingReason)
    })
  })
})
