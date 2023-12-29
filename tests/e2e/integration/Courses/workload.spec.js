import { coursesURL } from '../../support/constants/urls'
import { TEACHER } from '../../support/constants/users'
import { openWorkload } from '../../support/utils/courses'

describe('Workload', () => {
  beforeEach(() => {
    cy.loadTables('courses/courses_tables_homework.sql')
    cy.fixture('courses.json').as('coursesData')
  })

  it('Course_Workload_CheckDesktopNavigationAndContent', function () {
    const existingSessionHomework = this.coursesData.existingHomework

    // Login
    cy.login(TEACHER, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(existingSessionHomework[0].sessionDate, 'YYYY/MM/DD').toDate().getTime())

    openWorkload('11-13_11:25')
    cy.get('[data-test="workLoadModal"]').within(() => {
      // Check if current week is selected
      cy.get('li').contains('S.13').should('have.class', 'theme-background-color')
      // Check if homework in current week is visible
      cy.contains('.work-item', existingSessionHomework[0].title).should('be.visible')
      // Click on next week
      cy.get('li').contains('S.14').click()
      // Check if right week is selected
      cy.get('li').contains('S.13').should('not.have.class', 'theme-background-color')
      cy.get('li').contains('S.14').should('have.class', 'theme-background-color')
      // Check if homework in current week is not visible
      cy.contains('.work-item', existingSessionHomework[0].title).should('not.exist')
      cy.get('li').contains('S.13').within(() => {
        // Check if current week is already marked
        cy.get('span').should('have.class', 'theme-background-color')
      })
    })
  })

  it('Course_Workload_CheckResponsivityDispositionAndContent', function () {
    const existingSessionHomework = this.coursesData.existingHomework
    cy.viewport('iphone-5')

    // Login
    cy.login(TEACHER, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(existingSessionHomework[0].sessionDate, 'YYYY/MM/DD').toDate().getTime())

    openWorkload('11-13_11:25')
    cy.get('[data-test="workLoadModal"]').within(() => {
      cy.get('[data-test="date"]').should('contain', existingSessionHomework[1].dateToDoWorkload)
      cy.contains('.work-item', existingSessionHomework[1].title).should('be.visible')
      cy.contains('.work-item', existingSessionHomework[0].title).should('not.exist')
      cy.get('[data-test="PreviousDay"]').click()
      cy.get('[data-test="date"]').should('contain', existingSessionHomework[0].dateToDoWorkload)
      cy.contains('.work-item', existingSessionHomework[0].title).should('be.visible')
      cy.contains('.work-item', existingSessionHomework[1].title).should('not.exist')
    })
  })

  it('Course_Workload_CheckResponsivityNavigation', function () {
    const sessionDateBeforeHolyday = '2023/10/20'
    const holydayStart = '20/10'
    const holydayEnd = '30/10'

    cy.viewport('iphone-5')

    cy.login(TEACHER, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(sessionDateBeforeHolyday, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    // Click on session
    openWorkload('10-20_11:25')
    cy.get('[data-test="workLoadModal"]').within(() => {
      // Click on button next day
      cy.get('[data-test="PreviousDay"]').click()
      // Check if next day is backToSchool day
      cy.get('[data-test="date"]').should('contain', holydayStart)
      cy.get('[data-test="date"]').should('contain', 'ven')
      // Click on previous day button
      cy.get('[data-test="NextDay"]').click()
      // Check if previous day is last day before holiday
      cy.get('[data-test="date"]').should('contain', holydayEnd)
      cy.get('[data-test="date"]').should('contain', 'lun')
    })
  })
})
