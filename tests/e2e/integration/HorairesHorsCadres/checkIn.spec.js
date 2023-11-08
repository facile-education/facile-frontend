import { HHCURL, messagingURL } from '../../support/constants/urls'
import {
  DEPANNAGE_SUPERVISOR,
  DETENTION_SUPERVISOR,
  DOYEN,
  HEADMASTER,
  SECRETARY,
  STUDENT, STUDY_SUPERVISOR,
  TEACHER
} from '../../support/constants/users'
import {
  getSlot,
  selectSlotType
} from '../../support/utils/horairesHorsCardesUtils'
import { getThread, waitMessagingToBeLoaded } from '../../support/utils/messagingUtils'

const checkInSlotTypes = ['replayTest', 'study', 'detention']

const rolesThatCanCheckIn = {
  replayTest: [DEPANNAGE_SUPERVISOR], // the same as depannage
  study: [STUDY_SUPERVISOR],
  detention: [DETENTION_SUPERVISOR]
}
const rolesThatCannotCheckIn = [HEADMASTER, SECRETARY, DOYEN, TEACHER]

const registeredStudent = STUDENT
const registerer = HEADMASTER

const roleToBeNotified = {
  replayTest: [registerer, HEADMASTER, DOYEN],
  study: [HEADMASTER, DOYEN],
  detention: [registerer, HEADMASTER, DOYEN]
}

const getNotificationSlotLabel = (slotType) => { // Because text in notification is not exactly the same as slot label...
  switch (slotType) {
    case 'replayTest':
      return 'Travail à refaire'
    case 'study':
      return 'Cercle d\'étude'
    case 'detention':
      return 'Retenue'
  }
}

const getAbsenceThread = (supervisor, slotType, absentStudent) => {
  return [{
    sender: supervisor.firstName + ' ' + supervisor.lastName,
    recipients: roleToBeNotified[slotType], // todo: to extract string
    date: '',
    subject: getNotificationSlotLabel(slotType) + ' - Absence de ' + absentStudent.firstName + ' ' + absentStudent.lastName,
    content: '',
    messageIndexInThread: 0
  }]
}

describe('HHC_Checkin', () => {
  beforeEach(() => {
    cy.fixture('hhc.json').as('hhcData').then(data => {
      cy.clock(Cypress.dayjs(data.now, 'YYYY/MM/DD HH:mm').toDate().getTime())
    })
    cy.loadTables('schoollife/schoollife_tables.sql')
    cy.loadTables('messaging/messaging_tables_empty.sql') // to empty
  })

  it('option is present for good roles', function () {
    const slotType = 'replayTest' // Only needed to test one one slot type
    const slotToCheckIn = this.hhcData.slotsTypes[slotType].slotExample
    cy.log('roles that cannot register')

    rolesThatCannotCheckIn.forEach(role => {
      cy.login(role, HHCURL)
      cy.clock().invoke('setSystemTime', Cypress.dayjs(slotToCheckIn.endDate, 'YYYY/MM/DD HH:mm').toDate().getTime()) // To put after login to make it works
      selectSlotType(this.hhcData.slotsTypes[slotType])
      getSlot(slotToCheckIn).click()
      cy.get('[data-test=showStudentList-option]').click({ force: true })
      cy.get('[data-test=student-list-modal]').within(() => {
        cy.contains('[data-test="student-list-item"]', registeredStudent.firstName + ' ' + registeredStudent.lastName)
          .find('input[type="checkbox"][title="Présence"]').should('not.exist')
        cy.contains('button', 'Faire l\'appel').should('not.exist')
      })
    })

    cy.log('roles that can register')
    rolesThatCanCheckIn[slotType].forEach(role => {
      cy.login(role, HHCURL)
      cy.clock().invoke('setSystemTime', Cypress.dayjs(slotToCheckIn.endDate, 'YYYY/MM/DD HH:mm').toDate().getTime())
      selectSlotType(this.hhcData.slotsTypes[slotType])
      getSlot(slotToCheckIn).click()
      cy.get('[data-test=showStudentList-option]').click({ force: true })
      cy.get('[data-test=student-list-modal]').within(() => {
        cy.contains('[data-test="student-list-item"]', registeredStudent.firstName + ' ' + registeredStudent.lastName)
          .find('input[type="checkbox"][title="Présence"]').should('exist')
        cy.contains('button', 'Faire l\'appel').should('be.visible')
        cy.get('[data-test=closeModal]').click()
      })
      cy.get('[data-test=student-list-modal]').should('not.exist')

      // Check if check in is present before the slot start (it should'nt be)
      cy.clock().invoke('setSystemTime', Cypress.dayjs(slotToCheckIn.endDate, 'YYYY/MM/DD HH:mm').add(-1, 'day').toDate().getTime())
      getSlot(slotToCheckIn).click()
      cy.get('[data-test=showStudentList-option]').click({ force: true })
      cy.get('[data-test=student-list-modal]').within(() => {
        cy.contains('[data-test="student-list-item"]', registeredStudent.firstName + ' ' + registeredStudent.lastName)
          .find('input[type="checkbox"][title="Présence"]').should('not.exist')
        cy.contains('button', 'Faire l\'appel').should('not.exist')
      })
    })
  })

  it('send absence notification once the check in is done', function () {
    checkInSlotTypes.forEach(slotType => {
      const slotToCheckIn = this.hhcData.slotsTypes[slotType].slotExample
      const supervisor = rolesThatCanCheckIn[slotType][0]

      cy.log('Set time to ' + slotToCheckIn.endDate)

      cy.login(supervisor, HHCURL)
      cy.clock().invoke('setSystemTime', Cypress.dayjs(slotToCheckIn.endDate, 'YYYY/MM/DD HH:mm').toDate().getTime())

      selectSlotType(this.hhcData.slotsTypes[slotType])
      getSlot(slotToCheckIn).click()
      cy.get('[data-test=showStudentList-option]').click({ force: true })

      // Do check in (without check student)
      cy.get('[data-test=student-list-modal]').within(() => {
        cy.contains('[data-test="student-list-item"]', registeredStudent.firstName + ' ' + registeredStudent.lastName)
          .find('input[type="checkbox"][title="Présence"]')
          .should('exist')
          .should('not.be.checked')
        cy.contains('button', 'Faire l\'appel').click()
      })
      cy.get('[data-test=student-list-modal]').should('not.exist')

      // Check absence notification
      roleToBeNotified[slotType].forEach(role => {
        cy.login(role, messagingURL)
        waitMessagingToBeLoaded()
        getThread(getAbsenceThread(supervisor, slotType, registeredStudent)).click()
        cy.get('[data-test="message"]')
          .should('contain', STUDENT.firstName + ' ' + STUDENT.lastName)
          .should('contain', Cypress.dayjs(slotToCheckIn.startDate, 'YYYY/DD/MM HH:mm').format('DD MMMM YYYY [à] HH[h]mm'))
      })
    })
  })

  it('not send absence notification when the student is checked', function () {
    const slotType = 'detention'
    const slotToCheckIn = this.hhcData.slotsTypes[slotType].slotExample
    const supervisor = rolesThatCanCheckIn[slotType][0]

    cy.login(supervisor, HHCURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(slotToCheckIn.endDate, 'YYYY/MM/DD HH:mm').toDate().getTime())
    selectSlotType(this.hhcData.slotsTypes[slotType])
    getSlot(slotToCheckIn).click()
    cy.get('[data-test=showStudentList-option]').click({ force: true })

    // Check in student
    cy.get('[data-test=student-list-modal]').within(() => {
      cy.contains('[data-test="student-list-item"]', registeredStudent.firstName + ' ' + registeredStudent.lastName)
        .find('input[type="checkbox"][title="Présence"]').as('checkbox')
        .click()
      cy.get('@checkbox').should('be.checked')

      cy.contains('button', 'Faire l\'appel').click()
    })

    // No absence notification is send
    cy.login(roleToBeNotified[slotType][0], messagingURL)
    waitMessagingToBeLoaded()
    cy.get('[data-test=thread-list-item]').should('have.length', 0)
  })
})
