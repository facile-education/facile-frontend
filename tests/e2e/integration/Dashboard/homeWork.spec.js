import { dashboardURL } from '../../support/constants/urls'
import { MULTI_PARENT, PARENT, STUDENT } from '../../support/constants/users'
import { getHomework, getHomeworkDetails } from '../../support/utils/dashboard'

describe('Dashboard_Activity', () => {
  beforeEach(() => {
    cy.loadTables('dashboard/dashboard_tables_homework.sql')
    cy.fixture('dashboard.json').as('dashboardData')
  })

  it('Dashboard_Homework_DisplayHomeworks_Display_In_RightOrder', function () {
    const existingHomework = this.dashboardData.existingHomework
    // Login
    cy.login(STUDENT, dashboardURL)
    // Set date before the homework's date
    cy.clock().invoke('setSystemTime', Cypress.dayjs(existingHomework[0].dateBefore, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('[data-test="schedule-widget"] > header > nav').scrollIntoView().should('be.visible')
    // the first homework has a date lower than the second and therefore appears before
    cy.get('.homework-list').first().should('contain', existingHomework[0].title)
    cy.get('.homework-list').last().should('contain', existingHomework[1].title)
  })

  it('Dashboard_Homework_DisplayHomeworks_Verify_Content', function () {
    const existingHomework = this.dashboardData.existingHomework
    // Login
    cy.login(STUDENT, dashboardURL)
    // Set date before the homework's date
    cy.clock().invoke('setSystemTime', Cypress.dayjs(existingHomework[0].dateBefore, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('[data-test="schedule-widget"] > header > nav').scrollIntoView().should('be.visible')
    // Check if the content is good
    getHomeworkDetails(existingHomework[0]).should('be.exist')
    getHomeworkDetails(existingHomework[1]).should('be.exist')
  })

  it('Dashboard_Homework_DisplayHomeworks_Filter_Done_Undone', function () {
    const existingHomework = this.dashboardData.existingHomework
    // Login
    cy.login(STUDENT, dashboardURL)
    // Set date before the homework's date
    cy.clock().invoke('setSystemTime', Cypress.dayjs(existingHomework[0].dateBefore, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('[data-test="schedule-widget"] > header > nav').scrollIntoView().should('be.visible')
    cy.get('[data-test="homeWork-widget"]').within(() => {
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

  it('Dashboard_Homework_DisplayHomeworks_Visibility_Button_AllHomeWorks', function () {
    const existingHomework = this.dashboardData.existingHomework

    // Login
    cy.login(STUDENT, dashboardURL)
    // Set date after the homework's date
    cy.clock().invoke('setSystemTime', Cypress.dayjs(existingHomework[0].dateAfter, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('[data-test="schedule-widget"] > header > nav').scrollIntoView().should('be.visible')
    cy.get('[data-test="homeWork-widget"]').within(() => {
      getHomework(existingHomework[0]).should('not.exist')
      getHomework(existingHomework[1]).should('not.exist')
      cy.contains('button', 'Voir tous les devoirs').should('not.exist')
    })

    // Login
    cy.login(STUDENT, dashboardURL)
    // Set date before the homework's date
    cy.clock().invoke('setSystemTime', Cypress.dayjs(existingHomework[0].dateBefore, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('[data-test="schedule-widget"] > header > nav').scrollIntoView().should('be.visible')
    cy.get('[data-test="homeWork-widget"]').within(() => {
      getHomework(existingHomework[0]).should('be.visible')
      getHomework(existingHomework[1]).should('be.visible')
      cy.contains('button', 'Voir tous les devoirs').should('be.visible')
    })
  })

  it('Dashboard_Homework_SetHomeworkDone_WithStudent', function () {
    const existingHomework = this.dashboardData.existingHomework

    // Login
    cy.login(STUDENT, dashboardURL)
    // Set date before the homework's date
    cy.clock().invoke('setSystemTime', Cypress.dayjs(existingHomework[0].dateBefore, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
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
    const existingHomework = this.dashboardData.existingHomework

    // Login
    cy.login(PARENT, dashboardURL)
    // Set date before the homework's date
    cy.clock().invoke('setSystemTime', Cypress.dayjs(existingHomework[0].dateBefore, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
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

  it('Dashboard_Homework_DisplayHomeworks_MultiParent_ChangeStudent_DropDown', function () {
    const existingHomework = this.dashboardData.existingHomework

    // Login
    cy.login(MULTI_PARENT, dashboardURL)
    // Set date before the homework's date
    cy.clock().invoke('setSystemTime', Cypress.dayjs(existingHomework[2].dateBefore, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    cy.get('.personal-widgets').within(() => {
      // Select first child
      cy.contains('button', existingHomework[2].student).click()
      cy.get('.suggestion-list').within(() => {
        cy.contains('li', existingHomework[2].student).click()
      })
      cy.get('[data-test="homeWork-widget"]').within(() => {
        getHomework(existingHomework[2]).should('be.visible')
        getHomework(existingHomework[3]).should('not.exist')
      })

      // Change to second child

      cy.contains('button', existingHomework[2].student).click()
      cy.get('.suggestion-list').within(() => {
        cy.contains('li', existingHomework[3].student).click()
      })
      cy.get('[data-test="homeWork-widget"]').within(() => {
        getHomework(existingHomework[3]).should('be.visible')
        getHomework(existingHomework[2]).should('not.exist')
      })
    })
  })

  it('Dashboard_Homework_Redirect_MultiParent_Display_Good_ChildrenWork', function () {
    const existingHomework = this.dashboardData.existingHomework

    // Login
    cy.login(MULTI_PARENT, dashboardURL)
    // Set date before the homework's date
    cy.clock().invoke('setSystemTime', Cypress.dayjs(existingHomework[2].dateBefore, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    cy.get('.personal-widgets').within(() => {
      // Select first child
      cy.contains('button', existingHomework[2].student).click()
      cy.get('.suggestion-list').within(() => {
        cy.contains('li', existingHomework[2].student).click()
      })
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
      // Select first child
      cy.contains('button', existingHomework[2].student).click()
      cy.get('.suggestion-list').within(() => {
        cy.contains('li', existingHomework[3].student).click()
      })
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
