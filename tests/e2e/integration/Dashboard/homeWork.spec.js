import { dashboardURL } from '../../support/constants/urls'
import { PARENT, STUDENT } from '../../support/constants/users'
import { getHomework } from '../../support/utils/dashboard'

describe('Dashboard_Activity', () => {
  beforeEach(() => {
    cy.loadTables('dashboard/dashboard_tables_homework.sql')
    cy.fixture('dashboard.json').as('dashboardData')
  })

  it('Dashboard_Homework_DisplayHomeworks_Display_In_RightOrder', function () {
    const existingHomework = this.dashboardData.existingHomework
    // Login
    cy.login(STUDENT, dashboardURL)
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('[data-test="schedule-widget"] > header > nav').scrollIntoView().should('be.visible')
    cy.get('.homework-list').first().should('contain', existingHomework[0].title)
    cy.get('.homework-list').last().should('contain', existingHomework[1].title)
  })

  it('Dashboard_Homework_SetHomeworkDone_WithStudent', function () {
    // Login
    cy.login(STUDENT, dashboardURL)
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('[data-test="schedule-widget"] > header > nav').scrollIntoView().should('be.visible')
    // Check if first homeWork is undone
    cy.get('.homework-list').first().within(() => {
      cy.get('.pellet').should('be.exist')
    })
    // Check if first homeWork is undone
    cy.get('.homework-list').first().within(() => {
      cy.get('.checkmark').click()
      cy.get('.pellet').should('not.exist')
    })
  })

  it('Dashboard_Homework_SetHomeworkDone_WithParent', function () {
    // Login
    cy.login(PARENT, dashboardURL)
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('[data-test="schedule-widget"] > header > nav').scrollIntoView().should('be.visible')
    // Check if first homeWork is undone
    cy.get('.homework-list').first().within(() => {
      cy.get('.pellet').should('be.exist')
    })
    // Check if option mark as done is not visible
    cy.get('.homework-list').first().within(() => {
      cy.get('.checkmark').should('not.exist')
    })
  })
})
