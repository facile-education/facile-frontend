// https://docs.cypress.io/api/introduction/api.html
import {
  url, now,
  studentName,
  studentSearch
} from '../../support/constants/horaires'

describe('Mobile tests', () => {
  beforeEach(() => {
    cy.clock(now.toDate().getTime())
    cy.viewport('iphone-5')
    cy.login(url)
  })

  it('Displays initial view and filters', () => {
    // User input and datepicker button should be visible
    cy.get('.toolbar .selection').should('be.visible')
    cy.get('.toolbar .search .base-input').should('be.visible')
    cy.get('.toolbar .date-picker').should('be.visible')

    // Calendar should be visible with today date only
    cy.get('.fc').should('be.visible')
    cy.contains(now.format('dddd DD/MM')).should('exist')
    cy.contains(now.add(1, 'day').format('dddd DD/MM')).should('not.exist')
    cy.contains(now.subtract(1, 'day').format('dddd DD/MM')).should('not.exist')

    // Should toggle to group filter
    cy.get('.toolbar .selection').click()
    cy.wait(100)
    cy.get('.toolbar .base-dropdown').should('be.visible')
  })

  it('Navigates on select date', () => {
    cy.get('.toolbar .date-picker').click()
    cy.tick(500)

    cy.get('.vc-popover-content').should('be.visible')
    // Current day should be visible and highlighted
    cy.get(`.id-${now.format('YYYY-MM-DD')} > .vc-highlights`).should('exist')

    // Go to previous month
    cy.get('.is-left > .vc-svg-icon').click()
    cy.tick(500)
    cy.wait(100)

    // Go a Month earlier to a tuesday (which is worked)
    const monthEarlier = now.subtract(1, 'month').weekday(1)

    // Today date should not be displayed anymore
    cy.get(`.id-${now.format('YYYY-MM-DD')}`).should('exist')
    // Next month date should be visible
    cy.contains(monthEarlier.format('MMMM YYYY')).should('be.visible')
    cy.get(`.id-${monthEarlier.format('YYYY-MM-DD')}`).click()
    cy.wait(100)
    cy.contains(monthEarlier.format('dddd DD/MM')).should('be.visible')
  })

  // TODO Cannot get swipe to work
  // https://github.com/cypress-io/cypress/issues/1418
  // it.only('Navigates calendar on swipe', () => {
  //   cy.swipeLeft('.fc')
  // })

  it('Displays event list', () => {
    cy.get('.search .base-input').type(studentSearch)
    // Tick to throw completion timeout
    cy.tick(500)

    cy.get('.search .base-autocomplete').should('be.visible')
    // Select student user
    cy.contains(studentName).click()
    cy.wait(500)

    // Check events number
    cy.get('.fc-timegrid-event').should('have.length', 4)

    cy.get('[data-cy="05-05_08:45"]').parents('a.fc-timegrid-event')
      .within(() => {
        cy.contains('AN1051AC').should('be.visible')
        cy.contains('S. De Miras').should('be.visible')
        cy.contains('J102').should('be.visible')
        cy.root().should('have.css', 'background-color', 'rgb(23, 127, 69)')
      })

    cy.get('[data-cy="05-05_10:35"]').parents('a.fc-timegrid-event')
      .within(() => {
        cy.contains('AL1051AC').should('be.visible')
        cy.contains('L. Kronegg De Melo').should('be.visible')
        cy.contains('J102').should('be.visible')
        cy.root().should('have.css', 'background-color', 'rgb(123, 135, 201)')
      })

    // Nav to next day
    cy.get('.toolbar .date-picker').click()
    cy.tick(500)

    const tomorrow = now.add(1, 'day')
    cy.get(`.id-${tomorrow.format('YYYY-MM-DD')}`).click()
    cy.wait(100)

    // Check events number
    cy.get('.fc-timegrid-event').should('have.length', 7)
  })
})
