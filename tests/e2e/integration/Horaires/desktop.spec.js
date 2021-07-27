// https://docs.cypress.io/api/introduction/api.html

import {
  url, now,
  groupName,
  studentName,
  studentSearch,
  teacherName,
  teacherSearch
} from '../../support/constants/horaires'

const waitForRefresh = () => {
  cy.wait(500)
}

describe('Desktop tests', () => {
  beforeEach(() => {
    cy.logout()
    cy.clock(now.toDate().getTime())
    cy.login(url)
  })

  it('Navigates in timeline', () => {
    // Current week should be visible and selected
    cy.get('div.weeknumber-label.current-week.theme-border-color.theme-background-color').should('be.visible')

    cy.get('.weeknumber-label').should('have.length', 6)

    // Tuesday of the current week should be visible
    cy.contains(now.weekday(1).format('ddd DD/MM')).should('exist')

    // Current week is the 3rd one and selected by default (index 2)
    // The 5th one should be two weeks later (index 4)
    cy.get(':nth-child(4) > .weeknumber-label').click()
    waitForRefresh()
    cy.contains(now.add(2, 'week').format('ddd DD/MM')).should('exist')

    // Click on timeline previous button
    // The 3rd week (index 2) should be 6 weeks before the current
    cy.get('.horizontal-timeline-left > .nav-btn').click()
    waitForRefresh()
    cy.get('.weeknumber-label').then($elements => { cy.wrap($elements[2]).click() })
    cy.contains(now.subtract(6, 'week').format('ddd DD/MM')).should('exist')

    // Click twice on timeline next button
    // The 3rd week should be 6 weeks after current one
    cy.get('.horizontal-timeline-right > .nav-btn').click().click()
    waitForRefresh()
    cy.get('.weeknumber-label').then($elements => { cy.wrap($elements[2]).click() })
    cy.contains(now.add(6, 'week').format('ddd DD/MM')).should('exist')
  })

  it('Displays group sessions', () => {
    // Display group sessions
    cy.get('.toolbar .base-dropdown').click()
    cy.get('.base-dropdown > .base-autocomplete').should('be.visible')

    // Select group in the list
    cy.contains(groupName).click()
    waitForRefresh()

    // Check events number
    cy.get('.fc-timegrid-event').should('have.length', 37)
  })

  it('Displays teachers sessions', () => {
    cy.get('.search .base-input').type(teacherSearch)
    // Tick to throw completion timeout
    cy.tick(500)

    cy.get('.search .base-autocomplete').should('be.visible')
    // Select teacher user
    cy.contains(teacherName).click()
    waitForRefresh()

    // Check events number
    cy.get('.fc-timegrid-event').should('have.length', 10)

    // Co teacher is displayed
    cy.get('.fc-day-tue > .fc-timegrid-col-frame > :nth-child(2) > [style="inset: 57px 0% -114px; z-index: 1;"] > .fc-timegrid-event')
      .within(() => {
        cy.contains('FR1111').should('be.visible')
        cy.contains('A. Chabloz').should('be.visible')
        cy.contains('J211').should('be.visible')
        cy.root().should('have.css', 'background-color', 'rgb(60, 181, 125)')
      })

    // No other teacher
    cy.get('.fc-day-wed > .fc-timegrid-col-frame > :nth-child(2) > [style="inset: 260px 0% -317px; z-index: 1;"] > .fc-timegrid-event')
      .within(() => {
        cy.contains('MC1111').should('be.visible')
        cy.contains('J209').should('be.visible')
        cy.root().should('have.css', 'background-color', 'rgb(37, 156, 226)')
      })
  })

  it('Displays student sessions', () => {
    cy.get('.search .base-input').type(studentSearch)
    // Tick to throw completion timeout
    cy.tick(500)

    cy.get('.search .base-autocomplete').should('be.visible')
    // Select student user
    cy.contains(studentName).click()
    waitForRefresh()

    // Check events number
    cy.get('.fc-timegrid-event').should('have.length', 31)

    cy.get('.fc-day-mon > .fc-timegrid-col-frame > :nth-child(2) > [style="inset: 57px 0% -114px; z-index: 1;"] > .fc-timegrid-event')
      .within(() => {
        cy.contains('MA1051AC').should('be.visible')
        cy.contains('I. Mendez').should('be.visible')
        cy.contains('J102').should('be.visible')
        cy.root().should('have.css', 'background-color', 'rgb(240, 81, 42)')
      })

    cy.get('.fc-day-wed > .fc-timegrid-col-frame > :nth-child(2) > [style="inset: 197px 0% -254px; z-index: 1;"] > .fc-timegrid-event')
      .within(() => {
        cy.contains('AL1051AC').should('be.visible')
        cy.contains('L. Kronegg De Melo').should('be.visible')
        cy.contains('J102').should('be.visible')
        cy.root().should('have.css', 'background-color', 'rgb(123, 135, 201)')
      })
  })

  it('Initializes other filter on selection', () => {
    // User seletion
    cy.get('.search .base-input').type(studentSearch)
    // Tick to throw completion timeout
    cy.tick(500)
    cy.contains(studentName).click()
    waitForRefresh()

    // Group selection
    cy.get('.toolbar .base-dropdown').click()
    cy.contains(groupName).click()
    waitForRefresh()

    // User selection should be emptied
    cy.get('.search .tag-item').should('not.exist')

    // User seletion
    cy.get('.search .base-input').type(studentSearch)
    // Tick to throw completion timeout
    cy.tick(500)
    cy.contains(studentName).click()
    waitForRefresh()

    // Group selection should be emptied
    cy.get('.button').contains('Groupes')
  })
})
