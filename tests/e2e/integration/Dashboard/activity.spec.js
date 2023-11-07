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
      // For wait to page load
      cy.get('.activities').should('be.visible')
      // Display all activity
      cy.contains('button', 'Voir toutes les activités').click()
      getInformation(activityToCreate).should('be.visible').click()
    })
    getInformationDetail(activityToCreate)
  })

  it.skip('Dashboard_Activities_CreateActivity_Button_AllActivity', function () {
    // Login
    cy.login(TEACHER, dashboardURL)
    cy.get('[data-test="activity-widget"]').should('be.visible').within(() => {
      // For wait to page load
      cy.get('.activities').should('be.visible')
      // Display all activity
      cy.contains('button', 'Voir toutes les activités').click()
      // Click on button to display modal createActivity
      cy.get('[data-test="CreateActivity"]').click()
    })
    // Check if modal is visible
    cy.get('[data-test="update-news-modal"]').should('be.visible')
  })

  it('Dashboard_Activities_UpdateActivity_mouseover', function () {
    const existingActivity = this.dashboardData.existingActivity
    const activityToEdit = this.dashboardData.activityToEdit

    // Login with student to chech if he don't see the information
    cy.login(PARENT, dashboardURL)
    getInformation(existingActivity[0]).should('not.exist')

    // Login to update information
    cy.login(TEACHER, dashboardURL)

    // Mouse over on the information
    getInformation(existingActivity[0]).trigger('mouseover').within(() => {
      cy.get('[data-test="buttonEditInformation"]').click({ force: true })
    })
    // Set new informations
    cy.get('[data-test="update-news-modal"]').within(() => {
      cy.get('.base-tags-input').click()
      // Add all students in recipients
      cy.get('.suggestion-list').contains('li', activityToEdit.recipient).click()
      cy.get('.labelled').clear()
      cy.get('.labelled').type(activityToEdit.title)
      cy.get('.ck-editor')
      cy.type_ckeditor(activityToEdit.content)
      cy.get('[data-test="submitButton"]').click()
    })
    // Check if the modification exist
    getInformation(activityToEdit).should('be.exist')
    cy.get('[data-test="activity-widget"]').within(() => {
      cy.contains('button', 'Voir toutes les activités').click()
    })
    // Check the content
    getInformation(activityToEdit).should('be.exist').click()
    // Check the content
    getInformationDetail(activityToEdit).should('be.exist')

    // Login with a student to see if now he can see the information
    cy.login(PARENT, dashboardURL)
    getInformation(activityToEdit).should('be.exist').click()
    // Check the content
    getInformationDetail(activityToEdit).should('be.exist')
  })

  it('Dashboard_Activities_UpdateActivity_clickActivity', function () {
    const existingActivity = this.dashboardData.existingActivity
    cy.login(TEACHER, dashboardURL)

    getInformation(existingActivity[0]).click()
    cy.get('[data-test="updateButton"]').click()
    cy.get('[data-test="update-news-modal"]').should('be.visible')
  })

  it('Dashboard_Activities_UpdateActivity_allActivity', function () {
    const existingActivity = this.dashboardData.existingActivity
    cy.login(TEACHER, dashboardURL)

    cy.get('[data-test="activity-widget"]').within(() => {
      cy.contains('button', 'Voir toutes les activités').click()
    })
    getInformation(existingActivity[0]).click()
    cy.get('[data-test="updateButton"]').click()
    cy.get('[data-test="update-news-modal"]').should('be.visible')
  })

  it('Dashboard_Activities_DeleteActivity_mouseover', function () {
    const existingActivity = this.dashboardData.existingActivity

    cy.login(TEACHER, dashboardURL)

    // Mouseover and click on delete button
    getInformation(existingActivity[0]).trigger('mouseover').within(() => {
      cy.get('[data-test="buttonDeleteInformation"]').click({ force: true })
    })
    // Confirm the delete
    cy.get('[data-test="confirmButton"]').click()

    // Check if news is delete
    getInformation(existingActivity[0]).should('not.exist')

    // Check if for the parents the news is delete
    cy.login(STUDENT, dashboardURL)
    getInformation(existingActivity[0]).should('not.exist')
  })

  it('Dashboard_Activities_DeleteActivity_clickActivity', function () {
    const existingActivity = this.dashboardData.existingActivity

    cy.login(TEACHER, dashboardURL)

    getInformation(existingActivity[0]).click()
    cy.get('[data-test="deleteButton"]').click()
    // Check if in the warning modal content there is the news title
    cy.get('[data-test="warning-modal"]').should('be.visible')
  })

  it('Dashboard_Activities_DeleteActivity_allActivity', function () {
    const existingActivity = this.dashboardData.existingActivity

    cy.login(TEACHER, dashboardURL)

    cy.get('[data-test="activity-widget"]').within(() => {
      cy.contains('button', 'Voir toutes les activités').click()
    })
    getInformation(existingActivity[0]).should('be.visible').click()
    cy.get('[data-test="deleteButton"]').click()
    cy.get('[data-test="warning-modal"]').should('be.visible')
  })
})
