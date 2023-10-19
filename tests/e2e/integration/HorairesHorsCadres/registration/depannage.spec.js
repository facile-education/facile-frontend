import { HHCURL, messagingURL } from '../../../support/constants/urls'
import {
  CLASSTEACHER,
  DEPANNAGE_SUPERVISOR,
  DOYEN,
  HEADMASTER,
  PARENT,
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

const studentToRegister = STUDENT

const rolesThatCanRegister = [DEPANNAGE_SUPERVISOR] // Only the slot'teacher can regiser student
const rolesThatCannotRegister = [HEADMASTER, CLASSTEACHER, DOYEN, TEACHER] // Not exhaustive but other users do not have the HHC service available

const notifications = (registeredSlot) => {
  return [ // TODO: test content
    {
      role: PARENT,
      expectedThread: [{
        sender: DEPANNAGE_SUPERVISOR.firstName + ' ' + DEPANNAGE_SUPERVISOR.lastName,
        recipients: [PARENT.firstName + ' ' + PARENT.lastName],
        date: '',
        subject: 'Dépannage le ' + Cypress.dayjs(registeredSlot.startDate, 'YYYY/MM/DD HH:mm').format('DD MMMM YYYY [à] HH[h]mm'),
        content: '',
        messageIndexInThread: 0
      }]
    },
    {
      role: CLASSTEACHER,
      expectedThread: [{
        sender: DEPANNAGE_SUPERVISOR.firstName + ' ' + DEPANNAGE_SUPERVISOR.lastName,
        recipients: [CLASSTEACHER.firstName + ' ' + CLASSTEACHER.lastName],
        date: '',
        subject: 'Dépannage le ' + Cypress.dayjs(registeredSlot.startDate, 'YYYY/MM/DD HH:mm').format('DD MMMM YYYY [à] HH[h]mm'),
        content: '',
        messageIndexInThread: 0
      }]
    },
    {
      role: DOYEN,
      expectedThread: [{
        sender: DEPANNAGE_SUPERVISOR.firstName + ' ' + DEPANNAGE_SUPERVISOR.lastName,
        recipients: [DOYEN.firstName + ' ' + DOYEN.lastName],
        date: '',
        subject: 'Dépannage le ' + Cypress.dayjs(registeredSlot.startDate, 'YYYY/MM/DD HH:mm').format('DD MMMM YYYY [à] HH[h]mm'),
        content: '',
        messageIndexInThread: 0
      }]
    }
  ]
}

const testRegistrationModal = (slot, studentToRegister) => {
  cy.get('[data-test=student-registration-modal]').within(() => {
    cy.contains(studentToRegister.firstName + ' ' + studentToRegister.lastName)
    cy.contains(Cypress.dayjs(slot.startDate, 'YYYY/MM/DD HH:mm').format('[le] DD MMMM YYYY [à] HH:mm'))
    cy.get('textarea').should('not.exist')
    cy.get('.notify-parents [type="checkbox"]').should('not.exist')

    cy.contains('button', 'Inscrire').click()
  })
  cy.get('[data-test=student-registration-modal]').should('not.exist')
}

// NB: Some of registration main features are already tested in study type, so here is juste a basic registration test for replayTest slots
describe('HHC_Tutoring_Registration', () => {
  beforeEach(() => {
    cy.fixture('hhc.json').as('hhcData').then(data => {
      cy.clock(Cypress.dayjs(data.now, 'YYYY/MM/DD HH:mm').toDate().getTime())
    })
    cy.loadTables('schoollife/schoollife_tables_empty.sql')
    cy.loadTables('messaging/messaging_tables_empty.sql') // to empty
  })

  it('HHC_Tutoring_Registration_isPresentForGoodRoles', function () {
    const slotToRegisterInside = this.hhcData.slotsTypes.tutoring.slotExample

    rolesThatCannotRegister.forEach(role => {
      cy.login(role, HHCURL)
      selectSlotType(this.hhcData.slotsTypes.tutoring)
      // Select student
      selectStudent(studentToRegister)
      // Open registration modal
      getSlot(slotToRegisterInside).click()
      cy.get('[data-test=event-popup]').get('[data-test=registerStudent-option]').should('not.exist')
    })

    rolesThatCanRegister.forEach(role => {
      cy.login(role, HHCURL)
      selectSlotType(this.hhcData.slotsTypes.tutoring)
      // Select student
      selectStudent(studentToRegister)
      // Open registration modal
      getSlot(slotToRegisterInside).click()
      cy.get('[data-test=event-popup]').get('[data-test=registerStudent-option]').should('exist')
    })
  })

  it('HHC_Tutoring_Registration_Register', function () {
    const slotToRegisterInside = this.hhcData.slotsTypes.tutoring.slotExample

    // Connect with someone who can register
    cy.login(rolesThatCanRegister[0], HHCURL)
    selectSlotType(this.hhcData.slotsTypes.tutoring)

    // Select student
    selectStudent(studentToRegister)
    // Open registration modal
    getSlot(slotToRegisterInside).click()
    cy.get('[data-test=registerStudent-option]').click()

    // Test registration modal (ends by registering student)
    testRegistrationModal(slotToRegisterInside, studentToRegister)

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
      cy.login(notification.role, messagingURL)
      waitMessagingToBeLoaded()
      getThread(notification.expectedThread).should('be.visible')
    })
  })
})
