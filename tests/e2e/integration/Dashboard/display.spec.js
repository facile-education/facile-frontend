import { dashboardURL } from '../../support/constants/urls'
import { HEADMASTER, PARENT, SECRETARY, STUDENT, TEACHER } from '../../support/constants/users'

describe('Dashboard_DisplayCorrectWidgets', () => {
  beforeEach(() => {
    cy.loadTables('messaging/messaging_tables.sql')
    cy.fixture('messaging.json').as('messagingData')
  })
  it('Dashboard_DisplayCorrectWidgets_desktop', function () {
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

  it('Dashboard_DisplayCorrectWidgets_mobile', function () {
    cy.viewport('iphone-5')
    // For a student
    cy.login(STUDENT, dashboardURL)
    cy.get('[data-test="diary-widget"]').should('be.visible')
    cy.get('[data-test="activity-widget"]').should('be.visible')
    cy.get('[data-test="announcement-widget"]').should('be.visible')
    cy.get('[data-test="schedule-widget"]').should('be.visible')
    cy.get('.nero-body').scrollTo('bottom')
    cy.get('[data-test="homeWork-widget"]').should('be.visible')
    cy.get('[data-test="statistics-widget"]').should('not.exist')

    // For a parent
    cy.login(PARENT, dashboardURL)
    cy.get('[data-test="diary-widget"]').should('be.visible')
    cy.get('[data-test="activity-widget"]').should('be.visible')
    cy.get('[data-test="announcement-widget"]').should('be.visible')
    cy.get('[data-test="schedule-widget"]').should('be.visible')
    cy.get('.nero-body').scrollTo('bottom')
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
})
