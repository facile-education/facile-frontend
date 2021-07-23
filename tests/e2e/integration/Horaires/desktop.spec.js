// https://docs.cypress.io/api/introduction/api.html

import dayjs from 'dayjs'

// TODO
// Use dayJS for date related content
// Test several roles
// Mobile navigation (swipe)
// Timeline navigation
// Group and user (teacher vs student) events
// filter swap
// common Base url
// Horaires : Placeholder labels
// Conf test : console errors + pentila component font

// Set current date to Wednesday, may 5th
const now = dayjs('2021-05-05T16:00:00.000Z')

describe('Desktop tests', () => {
  beforeEach(() => {
    cy.logout()
    cy.clock(now.toDate().getTime())
    cy.login('/nero/horaires')
  })

  it('Check initial view', () => {
    cy.get('.toolbar .base-dropdown').should('be.visible')
    cy.get('.toolbar .search .base-input').should('be.visible')
    cy.get('.weekly-horizontal-timeline').should('be.visible')
    cy.get('.fc').should('be.visible')

    // cy.get('iframe').should('be.visible')
  })

  it('Check timeline navigation', () => {
    // Current week should be visible and selected
    cy.get('div.weeknumber-label.current-week.theme-border-color.theme-background-color').should('be.visible')

    // Tuesday, may 4th should be visible
    cy.contains('.fc-day-tue > .fc-scrollgrid-sync-inner > .fc-col-header-cell-cushion', 'mar. 04/05')

    cy.get(':nth-child(4) > .weeknumber-label').click()
  })

  it('Check group session display', () => {
    // Display group sessions
    cy.get('.toolbar .base-dropdown').click()
    cy.get('.base-dropdown > .base-autocomplete').should('be.visible')

    // Select third groupe in dthe list
    cy.get('.suggestion-list > :nth-child(3)').click()
  })

  it('Check user session display', () => {
    cy.get('.search .base-input').type('dar')

    // Tick to throw completion timeout
    cy.tick(500)

    cy.get('.search .base-autocomplete').should('be.visible')

    cy.get('.suggestion-list > :nth-child(4)').click()
  })
})
