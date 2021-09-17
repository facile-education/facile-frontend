// https://docs.cypress.io/api/introduction/api.html

import {
  url, now,
  groupName,
  studentName,
  studentSearch,
  teacherName,
  teacherSearch,
  secondChildName
} from '../../support/constants/horaires'
import { STUDENT, PARENT, MULTI_PARENT } from '../../support/constants'

const waitForRefresh = () => {
  cy.wait(500)
}

const logAsDirection = () => {
  cy.logout()
  cy.clock(now.toDate().getTime())
  cy.login(url)
}

const logAsStudent = () => {
  cy.logout()
  cy.clock(now.toDate().getTime())
  cy.login(url, STUDENT)
}

const logAsSingleParent = () => {
  cy.logout()
  cy.clock(now.toDate().getTime())
  cy.login(url, PARENT)
}

const logAsMultiParent = () => {
  cy.logout()
  cy.clock(now.toDate().getTime())
  cy.login(url, MULTI_PARENT)
}

describe('Desktop tests', () => {
  beforeEach(() => {
  })

  it('Displays students timetable', () => {
    logAsStudent()
    // Toolbar is not visible
    cy.get('.toolbar .base-dropdown').should('not.exist')
    cy.get('.toolbar .search .base-input').should('not.exist')
    cy.get('.weekly-horizontal-timeline').should('be.visible')
  })

  it('Displays parent child timetable', () => {
    logAsSingleParent()
    // Toolbar is visible, but no dropdown inside
    cy.get('.toolbar').should('exist')
    cy.get('.toolbar').contains('Horaire de ANYA')
    cy.get('.toolbar .children').should('not.exist')
    cy.get('.toolbar .group-list').should('not.exist')
    cy.get('.toolbar .search .base-input').should('not.exist')
    cy.get('.weekly-horizontal-timeline').should('be.visible')
  })

  it('Displays multi-parent children timetable', () => {
    logAsMultiParent()
    // Toolbar is visible, with only the child selector
    cy.get('.toolbar').should('exist')
    cy.get('.toolbar .children-list').should('exist')
    cy.get('.toolbar .group-list').should('not.exist')
    cy.get('.toolbar .search .base-input').should('not.exist')
    cy.get('.weekly-horizontal-timeline').should('be.visible')

    // Check events number
    cy.get('.fc-timegrid-event').should('have.length', 32)

    // Select second child in the list
    cy.get('.toolbar .children-list').click()
    cy.contains(secondChildName).click()
    waitForRefresh()

    // Check events number
    cy.get('.fc-timegrid-event').should('have.length', 31)
  })

  it('Navigates in timeline', () => {
    logAsDirection()
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
    logAsDirection()
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
    logAsDirection()
    cy.get('.search .base-input').type(teacherSearch)
    // Tick to throw completion timeout
    cy.tick(500)

    cy.get('.search .base-autocomplete').should('be.visible')
    // Select teacher user
    cy.contains(teacherName).click()
    waitForRefresh()

    // Check events number
    cy.get('.fc-timegrid-event').should('have.length', 13) // 10 lessons and 3 HHC

    // Co teacher is displayed
    cy.get('[data-cy="05-04_08:45"]').parents('a.fc-timegrid-event')
      .within(() => {
        cy.contains('FR1111').should('be.visible')
        cy.contains('A. Chabloz').should('be.visible')
        cy.contains('J211').should('be.visible')
        cy.root().should('have.css', 'background-color', 'rgb(60, 181, 125)')
      })

    // No other teacher
    cy.get('[data-cy="05-05_10:35"]').parents('a.fc-timegrid-event')
      .within(() => {
        cy.contains('MC1111').should('be.visible')
        cy.contains('J209').should('be.visible')
        cy.get('.fc-event-teacher').should('not.exist')
        cy.root().should('have.css', 'background-color', 'rgb(37, 156, 226)')
      })
  })

  it('Displays student sessions', () => {
    logAsDirection()
    cy.get('.search .base-input').type(studentSearch)
    // Tick to throw completion timeout
    cy.tick(500)

    cy.get('.search .base-autocomplete').should('be.visible')
    // Select student user
    cy.contains(studentName).click()
    waitForRefresh()

    // Check events number
    cy.get('.fc-timegrid-event').should('have.length', 31)

    cy.get('[data-cy="05-03_08:45"]').parents('a.fc-timegrid-event')
      .within(() => {
        cy.contains('MA1051AC').should('be.visible')
        cy.contains('I. Mendez').should('be.visible')
        cy.contains('J102').should('be.visible')
        cy.root().should('have.css', 'background-color', 'rgb(240, 81, 42)')
      })

    cy.get('[data-cy="05-05_10:35"]').parents('a.fc-timegrid-event')
      .within(() => {
        cy.contains('AL1051AC').should('be.visible')
        cy.contains('L. Kronegg De Melo').should('be.visible')
        cy.contains('J102').should('be.visible')
        cy.root().should('have.css', 'background-color', 'rgb(123, 135, 201)')
      })
  })

  it('Initializes other filter on selection', () => {
    logAsDirection()
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
    cy.get('.button').contains('Groupe')
  })
})
