// https://docs.cypress.io/api/introduction/api.html

import dayjs from 'dayjs'
import {
  url, now,
  groupName,
  studentName,
  studentSearch,
  teacherName,
  teacherSearch
} from './constants'
import weekday from 'dayjs/plugin/weekday'

dayjs.extend(weekday)

// TODO
// Mobile navigation (swipe)
// Group and user (teacher vs student) events
// filter swap

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
  })
})
