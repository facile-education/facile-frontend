import { coursesURL } from '../../support/constants/urls'
import { MULTI_PARENT, MULTI_STUDENT2, PARENT, STUDENT } from '../../support/constants/users'
import { getHomework } from '../../support/utils/courses'
import { selectChild } from '../../support/utils/dashboard'

describe('navigationAndDisplay', () => {
  beforeEach(() => {
    cy.loadTables('courses/courses_tables_homework.sql')
    cy.fixture('courses.json').as('coursesData').then((data) => {
      cy.clock(Cypress.dayjs(data.existingHomework[0].dateBefore, 'YYYY/MM/DD').toDate().getTime())
    })
  })
  it('Courses_SetHomeworkDone_StudentCanMarkAsDone', function () {
    cy.login(STUDENT, coursesURL)
    cy.get('.homework-tab').within(() => {
      cy.get('header').should('contain', '2 Travaux')
      cy.get('.homeworks-by-day-list').within(() => {
        cy.get('.homework').eq(0).within(() => {
          cy.get('.pellet').should('be.visible')
          cy.get('[data-test="toggleDoneUndone"]').eq(0).click()
          cy.get('.pellet').should('not.exist')
        })
      })
      cy.get('header').should('contain', '1 Travail')
      cy.get('.homework').eq(0).within(() => {
        cy.get('.pellet').should('not.exist')
        cy.get('[data-test="toggleDoneUndone"]').eq(0).click()
        cy.get('.pellet').should('be.visible')
      })
    })
  })

  it('Courses_SetHomeworkDone_ParentCantMarkAsDone', function () {
    cy.login(PARENT, coursesURL)
    cy.get('.homework-tab').within(() => {
      cy.get('header').should('contain', '2 Travaux')
      cy.get('.homeworks-by-day-list').within(() => {
        cy.get('.homework').eq(0).within(() => {
          cy.get('.pellet').should('be.visible')
          cy.get('[data-test="toggleDoneUndone"]').should('not.exist')
        })
      })
    })
  })
  it('Courses_DisplayWorkToDo_CheckVisibilityAndContent', function () {
    const existingHomework = this.coursesData.existingHomework
    cy.login(STUDENT, coursesURL)
    cy.get('.homework-tab').within(() => {
      cy.get('.homeworks-by-day-list').within(() => {
        getHomework(existingHomework[0]).should('be.visible')
        getHomework(existingHomework[1]).should('be.visible')
      })
    })

    cy.login(PARENT, coursesURL)
    cy.get('.homework-tab').within(() => {
      cy.get('.homeworks-by-day-list').within(() => {
        getHomework(existingHomework[0]).should('be.visible')
        getHomework(existingHomework[1]).should('be.visible')
      })
    })

    cy.login(MULTI_PARENT, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(existingHomework[2].dateBefore, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
    cy.get('.homework-tab').within(() => {
      cy.get('.homeworks-by-day-list').within(() => {
        getHomework(existingHomework[2]).should('be.visible')
      })
    })
    cy.login(MULTI_PARENT, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(existingHomework[3].dateBefore, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
    selectChild(MULTI_STUDENT2.firstName)
    cy.get('.homework-tab').within(() => {
      cy.get('.homeworks-by-day-list').within(() => {
        getHomework(existingHomework[3]).should('be.visible')
      })
    })
  })
})
