import { coursesURL } from '../../support/constants/urls'
import { TEACHER } from '../../support/constants/users'
import { getHomeworkDetailsSupport, getSessionDetailsSupport } from '../../support/utils/courses'

describe('Sessions', () => {
  beforeEach(() => {
    cy.loadTables('courses/courses_tables_homework.sql')
    cy.fixture('courses.json').as('coursesData').then((data) => {
      cy.clock(Cypress.dayjs(data.existingHomework[0].dateBefore, 'YYYY/MM/DD').toDate().getTime())
    })
  })
  it('Courses_DisplaySessionDetails_CheckSessionContentAndHomeworkContent', function () {
    const courseList = this.coursesData.CoursesListByProfil
    const teacherCourseList = courseList[0]
    const currentSession = teacherCourseList[2].Sessions[1]
    const currentSessionContent = this.coursesData.existingSessionsContent[0]
    const existingHomework = this.coursesData.existingHomework
    // Login
    cy.login(TEACHER, coursesURL)

    // Click on session
    cy.get('[data-test="11-13_11:25"]').eq(0).click()
    cy.get('.session-details').within(() => {
      // Check if text in header is right
      cy.get('header').should('contain', currentSession.headText)
      // Check if session content and session homework is visible
      getSessionDetailsSupport(currentSessionContent).should('be.visible')
      getHomeworkDetailsSupport(existingHomework[0]).should('be.visible')
    })
  })
})
