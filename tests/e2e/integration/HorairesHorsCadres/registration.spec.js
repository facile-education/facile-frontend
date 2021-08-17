import {
  now,
  url,
  slotTypes,
  studentSearch,
  studentName
} from '../../support/constants/horairesHorsCadres'

import { TEACHER } from '../../support/constants'

const waitForRefresh = () => {
  cy.wait(500)
  cy.get('.spinner').should('not.exist')
}

describe('Desktop student depannage registration', () => {
  beforeEach(() => {
    cy.logout()
    cy.clock(now.toDate().getTime())
    cy.login(url, TEACHER)
    cy.get('[data-test=slot-type-item-' + slotTypes.tutoring.type + ']').click()
  })

  it('Register student depannage', () => {
    // Select student
    cy.get('[data-test=user-completion-input] input').type(studentSearch)
    cy.tick(500)

    // Select teacher user
    cy.contains(studentName).click()
    waitForRefresh()

    // Click on Depannage slot - Thu May the 6th
    cy.get('.fc-day-thu  .fc-timegrid-col-frame .fc-timegrid-col-events div[title="A. Regad"]')
      .click()

    // Depannage modal should have opened
    cy.get('.event-popup').should('be.visible')

    // Click on student list button
    cy.get('.event-popup i.fa-list').click()

    // No student registered
    cy.get('.no-students-placeholder').contains("Aucun élève n'est inscrit sur ce créneau")

    // Close modal
    cy.get('[data-test="closeModal"]').click()

    // Click on Depannage slot - Wed May the 5th
    cy.get('.fc-day-thu  .fc-timegrid-col-frame .fc-timegrid-col-events div[title="A. Regad"]')
      .click()

    // Depannage modal should have opened
    cy.get('.event-popup').should('be.visible')

    // Click on the register button
    cy.get('.event-popup i.fa-user-plus').should('be.visible')
    cy.get('.event-popup i.fa-user-plus').click()

    // Registration modal should open
    cy.get('.student-registration-modal').should('be.visible')

    // Register
    cy.get('.student-registration-modal button.register').contains('Inscrire')
    cy.get('.student-registration-modal button.register').click()

    // Modal should close
    cy.get('.student-registration-modal').should('not.exist')

    // Remaining capacity decreases
    cy.get('.fc-day-thu  .fc-timegrid-col-frame .fc-timegrid-col-events .fc-event-room').contains('1545')

    // Visit horaires service
    cy.visit('/nero/horaires')
    waitForRefresh()
    cy.get('.weeknumber-label').then($elements => { cy.wrap($elements[2]).click() })

    cy.get('.search .base-input').type(studentSearch)
    // Tick to throw completion timeout
    cy.tick(500)

    cy.get('.search .base-autocomplete').should('be.visible')
    // Select student user
    cy.contains(studentName).click()
    waitForRefresh()

    // Check events number
    cy.get('.fc-timegrid-event').should('have.length', 41)

    // The schoollife session appears in the student's schedule
    cy.get('.fc-day-thu  .fc-timegrid-col-frame .fc-timegrid-col-events div[title="A. Regad"]').should('exist')
  })

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
