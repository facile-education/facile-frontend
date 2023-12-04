import { coursesURL } from '../../support/constants/urls'
import { MULTI_PARENT, MULTI_STUDENT2, PARENT, STUDENT, TEACHER } from '../../support/constants/users'
import { getCourseDetails } from '../../support/utils/courses'
import { selectChild } from '../../support/utils/dashboard'

describe('navigationAndDisplay', () => {
  beforeEach(() => {
    cy.fixture('courses.json').as('coursesData').then((data) => {
      cy.clock(Cypress.dayjs(data.existingHomework[0].dateBefore, 'YYYY/MM/DD').toDate().getTime())
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
  it('Courses_DisplayCourseDetails_CheckSessionsContent', function () {
    const courseList = this.coursesData.CoursesListByProfil
    const teacherCourseList = courseList[0]
    const courseDetails = teacherCourseList[2].sessions
    cy.login(TEACHER, coursesURL)
    cy.get('.tabs').within(() => {
      cy.contains('li', 'Cours').click()
    })
    cy.get('.courses').should('be.visible').within(() => {
      cy.contains('li', teacherCourseList[2].Course).click()
    })
    for (let i = 0; i < courseDetails.length - 1; i++) {
      getCourseDetails(courseDetails[i], i).should('be.visible')
    }
  })
})
