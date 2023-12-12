import { coursesURL } from '../../support/constants/urls'
import { HEADMASTER, MULTI_PARENT, MULTI_STUDENT2, PARENT, PSYCHOLOGIST, STUDENT, TEACHER } from '../../support/constants/users'
import { selectChild } from '../../support/utils/dashboard'

describe('navigationAndDisplay', () => {
  beforeEach(() => {
    cy.fixture('courses.json').as('coursesData')
  })
  it('Courses_Initialisation_InitialisationGoodTabsByProfil', function () {
    // Login with teacher
    cy.login(TEACHER, coursesURL)
    // Check if good tab has active class
    cy.get('.tabs').within(() => {
      cy.contains('li', 'Séances').should('have.class', 'active')
      cy.contains('li', 'Cours').should('have.not.class', 'active')
    })
    // Check if good tab content is visible
    cy.get('.schedule-tab').should('be.visible')
    cy.get('.course-tab').should('not.exist')

    // Login with student
    cy.login(STUDENT, coursesURL)
    // Check if good tab has active class
    cy.get('.tabs').within(() => {
      cy.contains('li', 'À faire').should('have.class', 'active')
      cy.contains('li', 'Cours').should('have.not.class', 'active')
    })
    // Check if good tab content is visible
    cy.get('.homework-tab').should('be.visible')
    cy.get('.course-tab').should('not.exist')

    // Login with student
    cy.login(PARENT, coursesURL)
    // Check if good tab has active class
    cy.get('.tabs').within(() => {
      cy.contains('li', 'À faire').should('have.class', 'active')
      cy.contains('li', 'Cours').should('have.not.class', 'active')
    })
    // Check if good tab content is visible
    cy.get('.homework-tab').should('be.visible')
    cy.get('.course-tab').should('not.exist')
  })

  it('Courses_Initialisation_UnVisibleForGoodProfil', function () {
    // Login with HEADMASTER
    cy.login(HEADMASTER, coursesURL)
    // Check if Course is not visible in menu
    cy.get('.menu-item-list').within(() => {
      cy.contains('li', 'Cours & devoirs').should('not.exist')
    })
    cy.url().should('eq', 'https://dev-ent-gve.com/cours-et-devoirs')
    cy.contains('h2', "Oups, cette page n'existe pas").should('be.visible')

    // Login with PSYCHOLOGIST
    cy.login(PSYCHOLOGIST, coursesURL)
    // Check if Course is not visible in menu
    cy.get('.menu-item-list').within(() => {
      cy.contains('li', 'Cours & devoirs').should('not.exist')
    })
    cy.url().should('eq', 'https://dev-ent-gve.com/cours-et-devoirs')
    cy.contains('h2', "Oups, cette page n'existe pas").should('be.visible')
  })

  it('Courses_DisplayCourseList_DisplayGoodCourseListByProfil', function () {
    const courseList = this.coursesData.CoursesListByProfil
    const teacherCourseList = courseList[0]
    const studentCourseList = courseList[1]
    const multiParentChild1CourseList = courseList[2]
    const multiParentChild2CourseList = courseList[3]

    cy.login(TEACHER, coursesURL)
    cy.get('.tabs').within(() => {
      cy.contains('li', 'Cours').should('have.not.class', 'active').click()
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
      cy.contains('li', 'Cours').should('have.not.class', 'active').click()
    })
    cy.get('.courses').should('be.visible').within(() => {
      for (let i = 0; i < studentCourseList.length - 1; i++) {
        cy.get('li').should('contain', studentCourseList[i].Course, studentCourseList[i].teacher)
      }
    })

    cy.login(MULTI_PARENT, coursesURL)
    cy.get('.tabs').within(() => {
      cy.contains('li', 'Cours').should('have.not.class', 'active').click()
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

  it('Courses_DisplaySessionDetails_DailyScheduleSessionNavigationGoForward', function () {
    const sessionDateBeforeHolyday = '2023/10/20'
    const holydayStart = '20/10'
    const holydayEnd = '30/10'

    cy.loadTables('courses/courses_tables_homework.sql')

    cy.login(TEACHER, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(sessionDateBeforeHolyday, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    // Click on session
    cy.get('[data-test="10-20_07:55"]').click()
    cy.get('.daily-schedule').within(() => {
      // Click on button next day
      cy.get('[data-test="NextDay"]').click()
      // Check if next day is backToSchool day
      cy.get('[data-test="date"]').should('contain', holydayEnd)
      cy.get('[data-test="date"]').should('contain', 'lun')
      // Click on previous day button
      cy.get('[data-test="PreviousDay"]').click()
      // Check if previous day is last day before holiday
      cy.get('[data-test="date"]').should('contain', holydayStart)
      cy.get('[data-test="date"]').should('contain', 'ven')
    })
  })

  it('Courses_DisplaySessionDetails_DailyScheduleSessionClickOnSession', function () {
    const sessionDate = '2023/10/20'
    const sessions = this.coursesData.sessionsLists[0].sessions

    cy.loadTables('courses/courses_tables_homework.sql')

    cy.login(TEACHER, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(sessionDate, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    // Click on session
    cy.get('[data-test="10-20_07:55"]').click()
    for (let i = 0; i < sessions.length - 1; i++) {
      cy.get('.daily-schedule').within(() => {
        cy.get('.calendar-event').eq(i).should('contain', sessions[i].course).click()
      })
      cy.get('.session-infos').within(() => {
        cy.get('.first-flex-section > header').should('contain', sessions[i].courseDetailHeadText)
      })
    }
  })
})
