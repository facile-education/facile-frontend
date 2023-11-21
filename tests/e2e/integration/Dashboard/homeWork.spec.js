import { dashboardURL } from '../../support/constants/urls'
import { MULTI_PARENT, MULTI_STUDENT1, MULTI_STUDENT2, PARENT, STUDENT } from '../../support/constants/users'
import { getHomework, getHomeworkDetails, selectChild } from '../../support/utils/dashboard'

describe('Dashboard_homeWorks', () => {
  beforeEach(() => {
    cy.loadTables('dashboard/dashboard_tables_homework.sql')
    cy.fixture('dashboard.json').as('dashboardData').then(data => {
      cy.clock(Cypress.dayjs(data.existingHomework[0].dateBefore, 'YYYY/MM/DD').toDate().getTime())
    })
  })

  it('Dashboard_Homework_DisplayHomeworksRightOrderAndContent', function () {
    const existingHomework = this.dashboardData.existingHomework
    // Login
    cy.login(STUDENT, dashboardURL)
    cy.get('[data-test="homeWork-widget"]').scrollIntoView()
    cy.get('[data-test="homeWork-widget"]').should('be.visible')
    // the first homework has a date lower than the second and therefore appears before
    cy.get('.homework-list').first().should('contain', existingHomework[0].title)
    getHomeworkDetails(existingHomework[0]).should('be.exist')
    cy.get('.homework-list').last().should('contain', existingHomework[1].title)
    getHomeworkDetails(existingHomework[1]).should('be.exist')
  })

  it('Dashboard_Homework_DisplayHomeworksFilterDoneUndone', function () {
    // Login
    cy.login(STUDENT, dashboardURL)
    cy.get('[data-test="homeWork-widget"]').scrollIntoView()
    cy.get('[data-test="homeWork-widget"]').should('be.visible').within(() => {
      // Mark first homeWork as done
      cy.get('.homework-list').first().within(() => {
        cy.get('.checkmark').click()
      })
      // Display unDone homeworks
      cy.get('[data-test="doneFilter"]').click()
      // Check if juste one homeworks is visible
      cy.get('.homework-list').should('have.length', 1)
      cy.get('[data-test="doneFilter"]').click()

      // Mark firt homeWork as unDone
      cy.get('.homework-list').first().within(() => {
        cy.get('.checkmark').click()
      })
      // Check if two homeWorks is visible
      cy.get('[data-test="doneFilter"]').click()
      cy.get('.homework-list').should('have.length', 2)
    })
  })

  it('Dashboard_Homework_DisplayHomeworksVisibilityButtonAllHomeWorks', function () {
    const existingHomework = this.dashboardData.existingHomework

    // Login
    cy.login(STUDENT, dashboardURL)
    // Set date after the homework's date
    cy.clock().invoke('setSystemTime', Cypress.dayjs(existingHomework[0].dateAfter, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
    cy.get('[data-test="homeWork-widget"]').scrollIntoView()
    cy.get('[data-test="homeWork-widget"]').should('be.visible').within(() => {
      // Check is no one is visible
      getHomework(existingHomework[0]).should('not.exist')
      getHomework(existingHomework[1]).should('not.exist')
      // Check if button all homeworks is not visible
      cy.contains('button', 'Voir tous les devoirs').should('not.exist')
      // Check if placeholder is visible
      cy.contains('.placeholder', 'Aucun devoir à faire')
    })
  })

  it('Dashboard_Homework_SetHomeworkDoneWithStudent', function () {
    // Login
    cy.login(STUDENT, dashboardURL)
    cy.get('[data-test="homeWork-widget"]').scrollIntoView()
    cy.get('[data-test="homeWork-widget"]').should('be.visible')
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

  it('Dashboard_Homework_SetHomeworkDoneWithParent', function () {
    // Login
    cy.login(PARENT, dashboardURL)
    cy.get('[data-test="homeWork-widget"]').scrollIntoView()
    cy.get('[data-test="homeWork-widget"]').should('be.visible')
    // Check if first homeWork is undone
    cy.get('.homework-list').first().within(() => {
      cy.get('.pellet').should('be.exist')
    })
    // Check if option mark as done is not visible
    cy.get('.homework-list').first().within(() => {
      cy.get('.checkmark').should('not.exist')
    })
  })

  it('Dashboard_Homework_DisplayHomeworksMultiParentChangeStudentDropDown', function () {
    const existingHomework = this.dashboardData.existingHomework

    // Login
    cy.login(MULTI_PARENT, dashboardURL)
    // Set date before the homework's date
    cy.clock().invoke('setSystemTime', Cypress.dayjs(existingHomework[2].dateBefore, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    cy.get('.personal-widgets').within(() => {
      // Select first child
      selectChild(MULTI_STUDENT1.firstName)
      cy.get('[data-test="homeWork-widget"]').within(() => {
        // Check if good homework is display for goode children
        getHomework(existingHomework[2]).should('be.visible')
        getHomework(existingHomework[3]).should('not.exist')
      })

      // Change to second child
      selectChild(MULTI_STUDENT2.firstName)
      cy.get('[data-test="homeWork-widget"]').within(() => {
        // Check if good homework is display for goode children
        getHomework(existingHomework[3]).should('be.visible')
        getHomework(existingHomework[2]).should('not.exist')
      })
    })
  })

  it('Dashboard_Homework_RedirectMultiParentDisplay_GoodChildrenWork', function () {
    const existingHomework = this.dashboardData.existingHomework

    // Login
    cy.login(MULTI_PARENT, dashboardURL)
    // Set date before the homework's date
    cy.clock().invoke('setSystemTime', Cypress.dayjs(existingHomework[2].dateBefore, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    cy.get('.personal-widgets').within(() => {
      // Select first child
      selectChild(MULTI_STUDENT1.firstName)
      cy.get('[data-test="homeWork-widget"]').within(() => {
        getHomework(existingHomework[2]).click()
      })
    })
    // Check if good homework is visible
    cy.get('.homeworks-day').within(() => {
      cy.contains('.homework', existingHomework[2].title).should('be.visible')
    })

    // Change to second Child
    // Login
    cy.login(MULTI_PARENT, dashboardURL)
    // Set date before the homework's date
    cy.clock().invoke('setSystemTime', Cypress.dayjs(existingHomework[3].dateBefore, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    cy.get('.personal-widgets').within(() => {
      // Select second child
      selectChild(MULTI_STUDENT2.firstName)
      cy.get('[data-test="homeWork-widget"]').within(() => {
        getHomework(existingHomework[3]).click()
      })
    })
    // Check if good homework is visible
    cy.get('.homeworks-day').within(() => {
      cy.contains('.homework', existingHomework[3].title).should('be.visible')
    })
  })
})
