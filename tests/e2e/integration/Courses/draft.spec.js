import { coursesURL } from '../../support/constants/urls'
import { CLASSTEACHER2, STUDENT, TEACHER } from '../../support/constants/users'
import { changetab, getSessionContent, getSessionHomework, getWorkInWorkload, openEditHomworkModal, openEditSessionContentModal, openHomeworkCreateModal, openSessionContentCreateModal, selectCourse } from '../../support/utils/courses'

describe('Draft', () => {
  beforeEach(() => {
    cy.fixture('courses.json').as('coursesData')
  })

  it('Courses_ScheduleHomeworkDraftStatus_CreateHomeworkAsDraft', function () {
    cy.loadTables('courses/courses_tables_homework_empty.sql')
    const sessionHomeworkToCreate = [
      {
        dateToDo: '2023/09/12',
        creationDate: '2023/09/11',
        title: 'Travail à faire enregistrer en tant que brouillon',
        content: 'Description du travail à faire enregistrer en tant que brouillon',
        dateToDoWorkload: '12/09'
      }
    ]
    // Login
    cy.login(TEACHER, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(sessionHomeworkToCreate[0].creationDate, 'YYYY/MM/DD').toDate().getTime())

    // Click on session
    openHomeworkCreateModal('09-11_11:25')

    cy.get('.edit-homework-modal').should('be.visible').within(() => {
      // Set title
      cy.get('.labelled').type(sessionHomeworkToCreate[0].title)
      // Set description
      cy.type_ckeditor(sessionHomeworkToCreate[0].content)
      // Add cy.tick beacause cy.clock()
      cy.tick(1000)
    })

    // Click on button to create session homework
    cy.get('.edit-homework-modal').within(() => {
      cy.get('.toggle-options-list-button').click()
      cy.get('.suggestion-list').within(() => {
        cy.contains('li', 'Enregistrer en brouillon').click()
      })
    })
    // Check if session homework is visible
    cy.get('.session-details').within(() => {
      getSessionHomework(sessionHomeworkToCreate[0]).should('be.visible').within(() => {
        cy.get('.status').should('contain', 'Brouillon')
      })
    })

    // Login with other teacher in class to check if homework is visible in worload
    cy.login(CLASSTEACHER2, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(sessionHomeworkToCreate[0].creationDate, 'YYYY/MM/DD').toDate().getTime())

    // Click on session
    openHomeworkCreateModal('09-12_11:25')
    // TO DO Remove after fix
    cy.wait(2000)
    cy.get('.edit-homework-modal').should('be.visible').within(() => {
      cy.get('.work-load-button').click()
    })
    // Check if homework is visible in workload
    getWorkInWorkload(sessionHomeworkToCreate[0], sessionHomeworkToCreate[0].dateToDoWorkload, 'not.exist')

    // Login with student to check if session homework save as draft is not visible
    cy.login(STUDENT, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(sessionHomeworkToCreate[0].dateToDo, 'YYYY/MM/DD').toDate().getTime())
    // Check in homeworks tab
    getSessionHomework(sessionHomeworkToCreate[0]).should('not.exist')
  })

  it('Courses_ScheduleHomeworkDraftStatus_UpdateHomeworkAsDraft', function () {
    cy.loadTables('courses/courses_tables_homework.sql')
    const currentSessionHomework = this.coursesData.existingHomework[0]

    // Login with student to check if session homework is visible
    cy.login(STUDENT, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(currentSessionHomework.dateBefore, 'YYYY/MM/DD').toDate().getTime())

    // Check if homework is visible in homeworks tab
    getSessionHomework(currentSessionHomework).should('be.visible')

    // Login with student to check if homework is visible before edit
    cy.login(TEACHER, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(currentSessionHomework.sessionDate, 'YYYY/MM/DD').toDate().getTime())

    // Click on session
    openEditHomworkModal(currentSessionHomework, '11-13_11:25', 'Modifier')

    cy.get('.edit-homework-modal').should('be.visible').within(() => {
      // Update as draft
      cy.get('.toggle-options-list-button').click()
      cy.get('.suggestion-list').within(() => {
        cy.contains('li', 'Enregistrer en brouillon').click()
      })
    })
    // Check if session homework is visible
    cy.get('.session-details').within(() => {
      getSessionHomework(currentSessionHomework).should('be.visible').within(() => {
        cy.get('.status').should('contain', 'Brouillon')
      })
    })

    // Login with student to check if session homework update as draft is not visible
    cy.login(STUDENT, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(currentSessionHomework.dateBefore, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    // Check if homework is visible in homeworks tab
    getSessionHomework(currentSessionHomework).should('not.exist')
  })

  it('Courses_ScheduleSessionDraftStatus_CreateSessionContentAsDraft', function () {
    cy.loadTables('courses/courses_tables_homework_empty.sql')
    const sessionContentToCreate = [
      {
        Sessiondate: '2023/09/11',
        title: 'Support de cours créé en tant que brouillon',
        content: 'Description du support de cours créé en tant que brouillon'
      }
    ]
    // Login
    cy.login(TEACHER, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(sessionContentToCreate[0].Sessiondate, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
    // Click on session
    openSessionContentCreateModal('09-11_11:25')

    cy.get('.edit-course-modal').should('be.visible').within(() => {
      // Set title
      cy.get('.labelled').type(sessionContentToCreate[0].title)
      // Set description
      cy.type_ckeditor(sessionContentToCreate[0].content, 'contentItem_0')
      // Add cy.tick beacause cy.clock()
      cy.tick(1000)
    })

    // Click on button to create session content
    cy.get('.edit-course-modal').within(() => {
      cy.get('.toggle-options-list-button').click()
      cy.get('.suggestion-list').within(() => {
        cy.contains('li', 'Enregistrer en brouillon').click()
      })
    })
    // Check if session content is visible
    cy.get('.session-details').within(() => {
      // Check if session content and session homework is visible
      getSessionContent(sessionContentToCreate[0]).should('be.visible').within(() => {
        cy.get('.status').should('contain', 'Brouillon')
      })
    })

    // Login with student to check if session content create as draft is not visible
    cy.login(STUDENT, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(sessionContentToCreate[0].Sessiondate, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    // Check in homeworks tab
    getSessionContent(sessionContentToCreate[0]).should('not.exist')
  })

  it('Courses_UpdateSessionContent_UpdateSessionContentAsDraft', function () {
    cy.loadTables('courses/courses_tables_homework.sql')
    const currentSessionContent = this.coursesData.existingSessionsContent[0]
    const courseList = this.coursesData.CoursesListByProfil
    const studentCourseList = courseList[1]
    const teacherCourseList = courseList[0]
    const sessions = teacherCourseList[2].Sessions

    // Login
    cy.login(TEACHER, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(currentSessionContent.sessionDate, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    // Click on session
    openEditSessionContentModal(currentSessionContent, '11-13_11:25', 'Modifier')

    // Set new informations
    cy.get('.edit-course-modal').should('be.visible').within(() => {
      // Update as draft
      cy.get('.toggle-options-list-button').click()
      cy.get('.suggestion-list').within(() => {
        cy.contains('li', 'Enregistrer en brouillon').click({ force: true })
      })
    })
    // Check if session content is visible
    cy.get('.session-details').within(() => {
      // Check if session content and session homework is visible
      getSessionContent(currentSessionContent).should('be.visible').within(() => {
        cy.get('.status').should('contain', 'Brouillon')
      })
    })

    // Login with student to check if session content modified as draft is visible
    cy.login(STUDENT, coursesURL)

    changetab('Cours')
    selectCourse(studentCourseList[11].Course)

    // Check if session content modified is visible within the current session
    cy.contains('.session-infos', sessions[1].headText).within(() => {
      getSessionContent(currentSessionContent).should('not.exist')
    })
  })
})
