import { dashboardURL } from '../../support/constants/urls'
import { HEADMASTER, PARENT, SECRETARY, STUDENT, TEACHER } from '../../support/constants/users'

describe('Dashboard_DisplayCorrectWidgets', () => {
  it('Dashboard_DisplayCorrectWidgets_ByProfilDesktop', function () {
    // For a student
    cy.login(STUDENT, dashboardURL)
    cy.get('[data-test="diary-widget"]').should('be.visible')
    cy.get('[data-test="activity-widget"]').should('be.visible')
    cy.get('[data-test="announcement-widget"]').should('be.visible')
    cy.get('[data-test="schedule-widget"]').should('be.visible')
    cy.get('[data-test="homeWork-widget"]').should('be.visible')
    cy.get('[data-test="statistics-widget"]').should('not.exist')

    // For a parent
    cy.login(PARENT, dashboardURL)
    cy.get('[data-test="diary-widget"]').should('be.visible')
    cy.get('[data-test="activity-widget"]').should('be.visible')
    cy.get('[data-test="announcement-widget"]').should('be.visible')
    cy.get('[data-test="schedule-widget"]').should('be.visible')
    cy.get('[data-test="homeWork-widget"]').should('be.visible')
    cy.get('[data-test="statistics-widget"]').should('not.exist')

    // For a teacher
    cy.login(TEACHER, dashboardURL)
    cy.get('[data-test="diary-widget"]').should('be.visible')
    cy.get('[data-test="activity-widget"]').should('be.visible')
    cy.get('[data-test="announcement-widget"]').should('be.visible')
    cy.get('[data-test="schedule-widget"]').should('be.visible')
    cy.get('[data-test="homeWork-widget"]').should('not.exist')
    cy.get('[data-test="statistics-widget"]').should('not.exist')

    // For the director
    cy.login(HEADMASTER, dashboardURL)
    cy.get('[data-test="diary-widget"]').should('be.visible')
    cy.get('[data-test="activity-widget"]').should('be.visible')
    cy.get('[data-test="announcement-widget"]').should('be.visible')
    cy.get('[data-test="schedule-widget"]').should('not.exist')
    cy.get('[data-test="homeWork-widget"]').should('not.exist')
    cy.get('[data-test="statistics-widget"]').should('be.visible')

    // For an other personel
    cy.login(SECRETARY, dashboardURL)
    cy.get('[data-test="diary-widget"]').should('be.visible')
    cy.get('[data-test="activity-widget"]').should('not.exist')
    cy.get('[data-test="announcement-widget"]').should('be.visible')
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
