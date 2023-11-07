import { dashboardURL } from '../../support/constants/urls'
import { PARENT, STUDENT, TEACHER } from '../../support/constants/users'
import { getInformation, getInformationDetail } from '../../support/utils/dashboard'

describe('Dashboard_Activity', () => {
  beforeEach(() => {
    cy.loadTables('dashboard/dashboard_tables_activity.sql')
    cy.loadTables('schoollife/schoollife_tables.sql')
    cy.fixture('dashboard.json').as('dashboardData')
  })

  it('Dashboard_Activities_CreateActivity_Button_HeaderActivity', function () {
    const activityToCreate = this.dashboardData.ActivityToCreate

    // Login
    cy.login(TEACHER, dashboardURL)
    cy.get('[data-test="activity-widget"]').within(() => {
      cy.get('[data-test="CreateActivity"]').click()
    })
    // Set informations
    cy.get('[data-test="update-news-modal"]').within(() => {
      cy.get('.base-tags-input').click()
      cy.get('.suggestion-list').contains('li', activityToCreate.recipient).click()
      cy.get('.labelled').type(activityToCreate.title)
      cy.get('.ck-editor')
      cy.type_ckeditor(activityToCreate.content)
      // submit
      cy.get('[data-test="submitButton"]').click()
    })
    // Check if the new activity is visible
    cy.get('[data-test="activity-widget"]').within(() => {
      getInformation(activityToCreate).should('be.visible').click()
    })
    getInformationDetail(activityToCreate)

    // Login
    cy.login(STUDENT, dashboardURL)
    // Check if a student the new actvity is visible
    cy.get('[data-test="activity-widget"]').within(() => {
      getInformation(activityToCreate).should('be.visible').click()
    })
    getInformationDetail(activityToCreate)
  })
})
