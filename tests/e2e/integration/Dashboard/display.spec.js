import { dashboardURL } from '../../support/constants/urls'
import { HEADMASTER, PARENT, SECRETARY, STUDENT, TEACHER } from '../../support/constants/users'
import { ScrollToAndCheckVisibility } from '../../support/utils/dashboard'

describe('Dashboard_DisplayCorrectWidgets', () => {
  it('Dashboard_DisplayCorrectWidgets_ByProfilDesktop', function () {
    // For a student
    cy.login(STUDENT, dashboardURL)
    ScrollToAndCheckVisibility('[data-test="diary-widget"]')
    ScrollToAndCheckVisibility('[data-test="activity-widget"]')
    ScrollToAndCheckVisibility('[data-test="announcement-widget"]')
    ScrollToAndCheckVisibility('[data-test="schedule-widget"]')
    ScrollToAndCheckVisibility('[data-test="homeWork-widget"]')
    cy.get('[data-test="statistics-widget"]').should('not.exist')

    // For a parent
    cy.login(PARENT, dashboardURL)
    ScrollToAndCheckVisibility('[data-test="diary-widget"]')
    ScrollToAndCheckVisibility('[data-test="activity-widget"]')
    ScrollToAndCheckVisibility('[data-test="announcement-widget"]')
    ScrollToAndCheckVisibility('[data-test="schedule-widget"]')
    ScrollToAndCheckVisibility('[data-test="homeWork-widget"]')
    cy.get('[data-test="statistics-widget"]').should('not.exist')

    // For a teacher
    cy.login(TEACHER, dashboardURL)
    ScrollToAndCheckVisibility('[data-test="diary-widget"]')
    ScrollToAndCheckVisibility('[data-test="activity-widget"]')
    ScrollToAndCheckVisibility('[data-test="announcement-widget"]')
    ScrollToAndCheckVisibility('[data-test="schedule-widget"]')
    cy.get('[data-test="homeWork-widget"]').should('not.exist')
    cy.get('[data-test="statistics-widget"]').should('not.exist')

    // For the director
    cy.login(HEADMASTER, dashboardURL)
    ScrollToAndCheckVisibility('[data-test="diary-widget"]')
    ScrollToAndCheckVisibility('[data-test="activity-widget"]')
    ScrollToAndCheckVisibility('[data-test="announcement-widget"]')
    cy.get('[data-test="schedule-widget"]').should('not.exist')
    cy.get('[data-test="homeWork-widget"]').should('not.exist')
    ScrollToAndCheckVisibility('[data-test="statistics-widget"]')

    // For an other personel
    cy.login(SECRETARY, dashboardURL)
    ScrollToAndCheckVisibility('[data-test="diary-widget"]')
    ScrollToAndCheckVisibility('[data-test="activity-widget"]')
    ScrollToAndCheckVisibility('[data-test="announcement-widget"]')
    cy.get('[data-test="schedule-widget"]').should('not.exist')
    cy.get('[data-test="homeWork-widget"]').should('not.exist')
    cy.get('[data-test="statistics-widget"]').should('not.exist')
  })

  it('Dashboard_DisplayCorrectWidgets_Responsivity', function () {
    cy.viewport('iphone-5')
    // Test Responsivity
    cy.login(STUDENT, dashboardURL)
    cy.get('[data-test="diary-widget"]').should('be.visible')
    cy.get('[data-test="activity-widget"]').should('be.visible')
    cy.get('[data-test="announcement-widget"]').should('be.visible')
    cy.get('[data-test="schedule-widget"]').should('be.visible')
    // Assert that homework widget is below the bottom of the viewport
    cy.get('[data-test="homeWork-widget"]').then(($homeWorkWidget) => {
      // Get homwork widget position
      const homeWorkWidgetTop = $homeWorkWidget[0].getBoundingClientRect().top
      expect(homeWorkWidgetTop).to.be.greaterThan(Cypress.config('viewportHeight'))
    })
  })
})
