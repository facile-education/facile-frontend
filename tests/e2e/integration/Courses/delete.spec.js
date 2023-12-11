import { coursesURL } from '../../support/constants/urls'
import { STUDENT, TEACHER } from '../../support/constants/users'
import { changetab, getSessionContent, selectCourse } from '../../support/utils/courses'

describe('Sessions content', () => {
  beforeEach(() => {
    cy.loadTables('courses/courses_tables_homework.sql')
    cy.fixture('courses.json').as('coursesData')
  })

  it('Courses_DeleteSessionContent_DeleteFromSessionView', function () {
    const currentSessionContent = this.coursesData.existingSessionsContent[0]
    const courseList = this.coursesData.CoursesListByProfil
    const studentCourseList = courseList[1]
    const teacherCourseList = courseList[0]
    const sessions = teacherCourseList[2].Sessions

    // Login
    cy.login(TEACHER, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(currentSessionContent.sessionDate, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    // Click on session
    cy.get('[data-test="11-13_11:25"]').click()
    cy.get('.session-details').within(() => {
      // Get current session content
      cy.contains('.session-content', currentSessionContent.title).within(() => {
        cy.get('.content-title').within(() => {
          // Open edit session content panel
          cy.get('.edit-button').click()
        })
      })
    })
    // Click on delete button
    cy.get('.context-menu').within(() => {
      cy.contains('button', 'Supprimer').click()
    })
    cy.get('.session-details').within(() => {
      // Check if no session content is visible
      getSessionContent(currentSessionContent).should('not.exist')
      // Check if placeholder is visible
      cy.contains('.placeholder', 'Aucun support de cours enregistré').should('be.visible')
    })

    // Login with student to check if session content is delete for everyone
    cy.login(STUDENT, coursesURL)

    changetab('Cours')
    selectCourse(studentCourseList[11].Course)

    // Check if session content is delete within the current session
    cy.contains('.session-infos', sessions[1].headText).within(() => {
      cy.get('.session-content').should('not.exist')
    })
  })

  it('Courses_DeleteSessionContent_DisplayDeleteOptionFromCourseView', function () {
    const currentSessionContent = this.coursesData.existingSessionsContent[0]
    const courseList = this.coursesData.CoursesListByProfil
    const teacherCourseList = courseList[0]
    // Login
    cy.login(TEACHER, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(currentSessionContent.sessionDate, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    changetab('Cours')
    selectCourse(teacherCourseList[2].Course)

    cy.get('.course-details').within(() => {
      cy.contains('.session-content', currentSessionContent.title).within(() => {
        cy.get('.content-title').within(() => {
          // Open edit session content panel
          cy.get('.edit-button').click()
        })
      })
    })
    // Check if delete button is visible
    cy.get('.context-menu').within(() => {
      cy.contains('button', 'Supprimer').should('be.visible')
    })
  })

  it('Courses_DeleteSessionHomework_DeleteFromSessionView', function () {
    const currentSessionHomework = this.coursesData.existingHomework[0]
    const courseList = this.coursesData.CoursesListByProfil
    const studentCourseList = courseList[1]
    const teacherCourseList = courseList[0]
    const sessions = teacherCourseList[2].Sessions
    // Login
    cy.login(TEACHER, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(currentSessionHomework.sessionDate, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    // Click on session
    cy.get('[data-test="11-13_11:25"]').click()
    cy.get('.session-details').within(() => {
      // Get current session homeWork
      cy.contains('.homeworks', currentSessionHomework.title).within(() => {
        cy.get('.title').eq(0).within(() => {
          // Open edit session content panel
          cy.get('.edit-button').click()
        })
      })
    })
    // Click on delete button
    cy.get('.context-menu').within(() => {
      cy.contains('button', 'Supprimer').click()
    })
    cy.intercept('GET', '**/get-session-details**').as('getSessionDetails')
    cy.wait('@getSessionDetails')
    cy.get('.session-details').within(() => {
      // Check if no session homework is visible
      cy.get('.homework').contains(currentSessionHomework.title).should('not.exist')
    })

    // Login with student to check if session homework is delete for everyone
    cy.login(STUDENT, coursesURL)

    changetab('Cours')
    selectCourse(studentCourseList[11].Course)
    // Check if session homework is delete within the current session
    cy.contains('.session-infos', sessions[1].headText).within(() => {
      cy.get('.homework').should('not.exist')
    })
  })

  it('Courses_DeleteSessionHomework_DisplayDeleteOptionFromCourseView', function () {
    const currentSessionHomework = this.coursesData.existingHomework[0]
    const courseList = this.coursesData.CoursesListByProfil
    const teacherCourseList = courseList[0]
    // Login
    cy.login(TEACHER, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(currentSessionHomework.sessionDate, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    changetab('Cours')
    selectCourse(teacherCourseList[2].Cours)
    cy.get('.course-details').within(() => {
      cy.contains('.homework', currentSessionHomework.title).within(() => {
        cy.get('.title').within(() => {
          // Open edit session homework panel
          cy.get('.edit-button').click()
        })
      })
    })
    // Check if delete button is visible
    cy.get('.context-menu').within(() => {
      cy.contains('button', 'Supprimer').should('be.visible')
    })
  })
})
