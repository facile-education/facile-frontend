// https://docs.cypress.io/api/introduction/api.html

import { MULTI_PARENT, PARENT, STUDENT } from '../../support/constants'
import {
  groupName,
  now,
  secondChildName,
  studentName,
  studentSearch,
  substituteCalendarName,
  substituteName,
  substituteSearch,
  teacherName,
  teacherSearch,
  url
} from '../../support/constants/horaires'

const waitForRefresh = () => {
  cy.wait(500)
}

const logAsDirection = () => {
  cy.logout()
  cy.login(url)
}

const logAsStudent = () => {
  cy.logout()
  cy.login(url, STUDENT)
}

const logAsSingleParent = () => {
  cy.logout()
  cy.login(url, PARENT)
}

const logAsMultiParent = () => {
  cy.logout()
  cy.login(url, MULTI_PARENT)
}

describe('Desktop tests', () => {
  beforeEach(() => {
    cy.clock(now.toDate().getTime())
    cy.exec('npm run db:loadTables cdt_tables.sql')
    cy.clearDBCache()
    // cy.login(url + '/15401321')
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
    cy.get('.horizontal-timeline-week.current-week.theme-border-color.theme-background-color').should('be.visible')

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

  it('Can substitute teacher', () => {
    logAsDirection()

    // Group selection
    cy.get('.toolbar .base-dropdown').click()
    cy.contains(groupName).click()
    waitForRefresh()

    const subsitutedTeacher = 'M. Ramelet'
    const substitutedSessionList = [
      '05-03_08:45',
      '05-04_10:35',
      '05-06_08:45',
      '05-07_13:40',
      '05-07_14:30'
    ]

    // Check teacher sessions
    substitutedSessionList.forEach(session => {
      cy.get(`[data-cy="${session}"]`).parents('a.fc-timegrid-event').within(() => {
        cy.contains(subsitutedTeacher).should('be.visible')
      })
    })

    // Add substitute
    cy.get(`[data-cy="${substitutedSessionList[0]}"]`).trigger('mouseover')
    cy.get(`[data-cy="${substitutedSessionList[0]}"] .fa-pencil-alt`).click()

    cy.get('#teacherform').should('exist')
    cy.get('#teacherform .teacher').should('have.length', 1)

    cy.get('.teacher .base-input').type(substituteSearch)

    // Tick to throw completion timeout
    cy.tick(500)
    cy.get('.teacher .base-autocomplete').should('be.visible')
    // Select teacher user
    cy.contains(substituteName).click()

    // Check if all slot checkbox changes
    cy.get('.teacher .base-dropdown > .button').click()
    cy.get('.teacher .suggestion-list').should('be.visible')
    cy.get('.teacher .suggestion-list li').should('have.length', 3)
    cy.get('.teacher .base-dropdown > .button').click()

    cy.get('.teacher .checkmark').click()
    cy.wait(100)
    cy.get('.teacher .base-dropdown > .button').click()
    cy.get('.teacher .suggestion-list').should('be.visible')
    cy.get('.teacher .suggestion-list li').should('have.length', 16)
    cy.get('.teacher .suggestion-list').contains('10/05/2021 08:45').click()

    // Validate button
    cy.get('.window-footer .base-button').click()
    waitForRefresh()

    // Teacher sessions should now contains substitute name
    substitutedSessionList.forEach(session => {
      cy.get(`[data-cy="${session}"]`).parents('a.fc-timegrid-event').within(() => {
        cy.contains(substituteCalendarName).should('be.visible')
      })
    })

    // Remove substitute one 1 session
    cy.get(`[data-cy="${substitutedSessionList[2]}"]`).trigger('mouseover')
    cy.get(`[data-cy="${substitutedSessionList[2]}"] .fa-pencil-alt`).click()
    cy.get('.tag-item .fa-times').click()
    // Validate button
    cy.get('.window-footer .base-button').click()
    waitForRefresh()

    // Session shoul be updated but not the previous and next one
    cy.get(`[data-cy="${substitutedSessionList[2]}"]`).parents('a.fc-timegrid-event')
      .contains(subsitutedTeacher).should('be.visible')
    cy.get(`[data-cy="${substitutedSessionList[1]}"]`).parents('a.fc-timegrid-event')
      .contains(substituteCalendarName).should('be.visible')
    cy.get(`[data-cy="${substitutedSessionList[3]}"]`).parents('a.fc-timegrid-event')
      .contains(substituteCalendarName).should('be.visible')

    // Check that the first session next week has been change too
    cy.get(':nth-child(3) > .weeknumber-label').click()
    waitForRefresh()

    const substitutedNextSessionList = [
      '05-10_08:45',
      '05-11_10:35'
    ]

    cy.get(`[data-cy="${substitutedNextSessionList[0]}"]`).parents('a.fc-timegrid-event')
      .contains(substituteCalendarName).should('be.visible')
    cy.get(`[data-cy="${substitutedNextSessionList[1]}"]`).parents('a.fc-timegrid-event')
      .contains(subsitutedTeacher).should('be.visible')
  })

  it('Displays all teachers in substitute modal', () => {
    logAsDirection()

    // Group selection
    cy.get('.toolbar .base-dropdown').click()
    cy.contains(groupName).click()
    waitForRefresh()

    const coteachingSession = '05-03_14:30'

    // Check original teacher before substitution
    cy.get(`[data-cy="${coteachingSession}"]`).parents('a.fc-timegrid-event')
      .contains('B. Nimo Garcia').should('be.visible')

    // Check if the two teachers appears in substitute modal
    cy.get(`[data-cy="${coteachingSession}"]`).trigger('mouseover')
    cy.get(`[data-cy="${coteachingSession}"] .fa-pencil-alt`).click()
    cy.get('#teacherform').should('exist')

    cy.get('#teacherform .teacher').should('have.length', 2)

    // Select substitute
    cy.get('ul > :nth-child(2) .base-input').type(substituteSearch)

    // Tick to throw completion timeout
    cy.tick(500)
    cy.get('ul > :nth-child(2) .base-autocomplete').should('be.visible')
    // Select teacher user
    cy.contains(substituteName).click()

    // Check substitution when only same slot
    cy.get('ul > :nth-child(2) .base-dropdown > .button').click()
    cy.get('ul > :nth-child(2) .suggestion-list').should('be.visible')
    cy.get('ul > :nth-child(2) .suggestion-list li').should('have.length', 3)
    cy.get('ul > :nth-child(2) .suggestion-list').contains('10/05/2021 14:30').click()

    // Validate button
    cy.get('.window-footer .base-button').click()
    waitForRefresh()

    // Current session has changed
    cy.get(`[data-cy="${coteachingSession}"]`).parents('a.fc-timegrid-event')
      .contains(substituteCalendarName).should('be.visible')
    // Next teacher session has not been changed
    cy.get('[data-cy="05-03_15:30"]').parents('a.fc-timegrid-event')
      .contains('B. Nimo Garcia').should('be.visible')
  })
})
