import {
  now,
  url,
  slotTypes,
  studentSearch,
  studentName,
  studentSlotsNumberAtWeek35,
  studentSlotsNumberAtTuesday
} from '../../support/constants/horairesHorsCadres'

const waitForRefresh = () => {
  cy.wait(500)
  cy.get('.spinner').should('not.exist')
}

describe('Desktop user selection', () => {
  beforeEach(() => {
    cy.logout()
    cy.clock(now.toDate().getTime())
    cy.login(url)
    cy.get('[data-test=slot-type-item-' + slotTypes.tutoring.type + ']').click() // Select tutoring slots
  })

  it('Display student planning beside HHC slots', () => {
    // the HHC slots are here
    cy.get('.fc-timegrid-event').should('have.length', slotTypes.tutoring.nbSlotsAtWeek35)

    // Select student
    cy.get('[data-test=user-completion-input] input').type(studentSearch)
    cy.tick(500)
    // Select student user
    cy.contains(studentName).click()
    waitForRefresh()

    // Student's slots were added to previous ones
    cy.get('.fc-timegrid-event').should('have.length', slotTypes.tutoring.nbSlotsAtWeek35 + studentSlotsNumberAtWeek35)

    // Students' slot are grayed but not HHC ones
    cy.get('.fc-day-wed > .fc-timegrid-col-frame > :nth-child(2) >> .fc-timegrid-event').within(() => {
      cy.contains(slotTypes.tutoring.label).parents('.fc-event').should('not.have.css', 'filter', 'grayscale(1)')
      cy.contains('HI1021CO').parents('.fc-event').should('have.css', 'filter', 'grayscale(1)')
    })
  })
})

describe('Mobile user selection', () => {
  beforeEach(() => {
    cy.logout()
    cy.clock(now.toDate().getTime())
    cy.viewport('iphone-5')
    cy.login(url)
    cy.get('[data-test=slot-type-item-' + slotTypes.tutoring.type + ']').click() // Select firing slots
  })

  it('Display student planning beside HHC slots', () => {
    // the HHC slots are here
    cy.get('.fc-timegrid-event').should('have.length', 1)

    // Select student
    cy.get('[data-test=user-completion-input] input').type(studentSearch)
    cy.tick(500)
    // Select teacher user
    cy.contains(studentName).click()
    waitForRefresh()

    // Student's slots were added to previous ones
    cy.get('.fc-timegrid-event').should('have.length', 1 + studentSlotsNumberAtTuesday)

    // Students' slot are grayed but not HHC ones
    cy.get('.fc-day-wed > .fc-timegrid-col-frame > :nth-child(2) >> .fc-timegrid-event').within(() => {
      cy.contains(slotTypes.tutoring.label).parents('.fc-event').should('not.have.css', 'filter', 'grayscale(1)')
      cy.contains('HI1021CO').parents('.fc-event').should('have.css', 'filter', 'grayscale(1)')
    })
  })
})
