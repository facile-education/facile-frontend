import { HHCURL } from '../../support/constants/urls'
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

const checkInSlotTypes = ['replayTest', 'study', 'detention']

const rolesThatCanCheckIn = {
  replayTest: [DEPANNAGE_SUPERVISOR], // the same as depannage
  study: [STUDY_SUPERVISOR],
  detention: [DETENTION_SUPERVISOR]
}
const rolesThatCannotCheckIn = [HEADMASTER, SECRETARY, DOYEN, TEACHER]

const registeredStudent = STUDENT

describe('HHC_Checkin', () => {
  beforeEach(() => {
    cy.fixture('hhc.json').as('hhcData').then(data => {
      cy.clock(Cypress.dayjs(data.now, 'YYYY/MM/DD HH:mm').toDate().getTime())
    })
    cy.loadTables('schoollife/schoollife_tables.sql')
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

  it('do checkIn', function () { // Find a way to be CRON compliant
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
    })
  })
})
