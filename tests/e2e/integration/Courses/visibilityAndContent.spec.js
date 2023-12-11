import { coursesURL } from '../../support/constants/urls'
import { MULTI_PARENT, MULTI_STUDENT2, PARENT, STUDENT, TEACHER } from '../../support/constants/users'
import { getCourseSession, getCourseSessionWithSupport, getSessionContentWithSupport, getSessionHomework, getSessionHomeworkWithSupport } from '../../support/utils/courses'
import { selectChild } from '../../support/utils/dashboard'

describe('Visibility and content', () => {
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
        getSessionHomeworkWithSupport(existingHomework[0]).should('be.visible')
        getSessionHomework(existingHomework[1]).scrollIntoView()
        getSessionHomework(existingHomework[1]).should('be.visible')
      })
    })

    cy.login(PARENT, coursesURL)
    cy.get('.homework-tab').within(() => {
      cy.get('.homeworks-by-day-list').within(() => {
        getSessionHomeworkWithSupport(existingHomework[0]).should('be.visible')
        getSessionHomework(existingHomework[1]).scrollIntoView()
        getSessionHomework(existingHomework[1]).should('be.visible')
      })
    })

    cy.login(MULTI_PARENT, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(existingHomework[2].dateBefore, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
    cy.get('.homework-tab').within(() => {
      cy.get('.homeworks-by-day-list').within(() => {
        getSessionHomework(existingHomework[2]).should('be.visible')
      })
    })
    cy.login(MULTI_PARENT, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(existingHomework[3].dateBefore, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
    selectChild(MULTI_STUDENT2.firstName)
    cy.get('.homework-tab').within(() => {
      cy.get('.homeworks-by-day-list').within(() => {
        getSessionHomework(existingHomework[3]).should('be.visible')
      })
    })
  })

  it('Courses_DisplayCourseList_DisplayGoodCourseListByProfil', function () {
    const courseList = this.coursesData.CoursesListByProfil
    const teacherCourseList = courseList[0]
    const studentCourseList = courseList[1]
    const multiParentChild1CourseList = courseList[2]
    const multiParentChild2CourseList = courseList[3]

    cy.login(TEACHER, coursesURL)
    cy.get('.tabs').within(() => {
      cy.contains('li', 'Cours').click()
    })
    cy.get('.courses').should('be.visible').within(() => {
      for (let i = 0; i < teacherCourseList.length - 1; i++) {
        cy.contains('li', teacherCourseList[i].Course).should('be.visible')
      }
    })

    cy.login(STUDENT, coursesURL)
    cy.get('.tabs').within(() => {
      cy.contains('li', 'Cours').should('have.not.class', 'active').click()
    })
    cy.get('.courses').should('be.visible').within(() => {
      for (let i = 0; i < studentCourseList.length - 1; i++) {
        cy.get('li').should('contain', studentCourseList[i].Course, studentCourseList[i].teacher)
      }
    })

    cy.login(PARENT, coursesURL)
    cy.get('.tabs').within(() => {
      cy.contains('li', 'Cours').click()
    })
    cy.get('.courses').should('be.visible').within(() => {
      for (let i = 0; i < studentCourseList.length - 1; i++) {
        cy.get('li').should('contain', studentCourseList[i].Course, studentCourseList[i].teacher)
      }
    })

    cy.login(MULTI_PARENT, coursesURL)
    cy.get('.tabs').within(() => {
      cy.contains('li', 'Cours').click()
    })
    cy.get('.courses').should('be.visible').within(() => {
      for (let i = 0; i < multiParentChild1CourseList.length - 1; i++) {
        cy.get('li').should('contain', multiParentChild1CourseList[i].Course, multiParentChild1CourseList[i].teacher)
      }
    })
    selectChild(MULTI_STUDENT2.firstName)
    cy.get('.courses').should('be.visible').within(() => {
      for (let i = 0; i < multiParentChild2CourseList.length - 1; i++) {
        cy.get('li').should('contain', multiParentChild2CourseList[i].Course, multiParentChild2CourseList[i].teacher)
      }
    })
  })

  it('Courses_DisplayCourseDetails_CheckCourseContent', function () {
    cy.loadTables('courses/courses_tables_homework.sql')
    const courseList = this.coursesData.CoursesListByProfil
    const teacherCourseList = courseList[0]
    const sessions = teacherCourseList[2].Sessions
    const existingHomework = this.coursesData.existingHomework
    const existingSessionsSupport = this.coursesData.existingSessionsContent
    cy.login(TEACHER, coursesURL)
    cy.get('.tabs').within(() => {
      cy.contains('li', 'Cours').click()
    })
    cy.get('.courses').should('be.visible').within(() => {
      cy.contains('li', teacherCourseList[2].Course).click()
    })
    cy.get('.course-details').within(() => {
      cy.get('header').within(() => {
        cy.contains(teacherCourseList[2].courseTeacher)
        cy.contains(teacherCourseList[2].courseName)
      })
      getCourseSession(existingHomework[1], sessions[0])
      getCourseSessionWithSupport(existingHomework[0], sessions[1], existingSessionsSupport[0])
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
      getSessionContentWithSupport(currentSessionContent).should('be.visible')
      getSessionHomeworkWithSupport(existingHomework[0]).should('be.visible')
    })
  })
})
