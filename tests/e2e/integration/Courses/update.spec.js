import { coursesURL } from '../../support/constants/urls'
import { CLASSTEACHER2, SCHOOL_ADMIN, STUDENT, STUDENT_IN_CLASS, TEACHER } from '../../support/constants/users'
import { addFile, addH5P, addLink, addVideo, changetab, clickOnContents, getSessionContent, getSessionContentWithSupportWithoutAudio, getSessionHomework, getSessionHomeworkWithSupport, getSessionHomeworkWithSupportWithoutAudio, getWorkInWorkload, openEditHomworkModal, openEditSessionContentModal, openWorkload, selectCourse, submitHomework, submitSessionContent } from '../../support/utils/courses'

describe('Update', () => {
  beforeEach(() => {
    cy.loadTables('courses/courses_tables_homework.sql')
    cy.fixture('courses.json').as('coursesData').then((data) => {
      cy.clock(Cypress.dayjs(data.existingHomework[0].dateBefore, 'YYYY/MM/DD').toDate().getTime())
    })
  })

  it('Courses_UpdateSessionHomework_UpdateContentFromSessionView', function () {
    const courseList = this.coursesData.CoursesListByProfil
    const studentCourseList = courseList[1]
    const currentSessionHomework = this.coursesData.existingHomework[0]
    const sessionHomeworkToEdit = [
      {
        sessionDate: '2023/11/13',
        dateToDo: '2023/11/13',
        dateToDoWorkload: '13/11',
        sessionHeadText: '13 novembre - P5',
        title: 'Travail à faire modifié',
        content: 'Consigne du travail à faire',
        attachedFile: 'note.html',
        additionalText: 'Texte supplémentaire',
        link: 'Lien pour le travail à faire modifié',
        linkUrl: 'https://www.monlienmodifié.com',
        video: 'Vidéo pour le travail à faire modifié',
        videoUrl: '<iframe width="560" height="315" src="https://www.youtube.com/embed/BQCSn5YMc6s?si=r-O2MkvB1QSCqRpr" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
        h5p: 'H5P pour le travail à faire modifié',
        h5pUrl: '<iframe src="https://h5p.org/h5p/embed/617" width="1090" height="675" frameborder="0" allowfullscreen="allowfullscreen" allow="geolocation *; microphone *; camera *; midi *; encrypted-media *" title="Interactive Video"></iframe><script src="https://h5p.org/sites/all/modules/h5p/library/js/h5p-resizer.js" charset="UTF-8"></script>'
      }
    ]
    // Login with student to check if homework is visible before edit
    cy.login(TEACHER, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(currentSessionHomework.sessionDate, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    // Click on session
    openEditHomworkModal(currentSessionHomework, '11-13_11:25', 'Modifier')

    cy.get('.edit-homework-modal').should('be.visible').within(() => {
      // Set title
      cy.get('.labelled').clear()
      cy.get('.labelled').type(sessionHomeworkToEdit[0].title)
      // Delete old supports before ad new supports
      cy.get('.attached-file').within(() => {
        cy.get('.remove-button').click()
      })
      cy.get('.course-content').each($courseContent => {
        cy.wrap($courseContent).within(() => {
          cy.get('.remove-button').click()
        })
      })
    })

    // Add attached file
    addFile(sessionHomeworkToEdit[0].attachedFile)
    // Add link
    addLink(sessionHomeworkToEdit[0].link, sessionHomeworkToEdit[0].linkUrl)
    // Add video
    addVideo(sessionHomeworkToEdit[0].video, sessionHomeworkToEdit[0].videoUrl)
    // Add H5P
    addH5P(sessionHomeworkToEdit[0].h5p, sessionHomeworkToEdit[0].h5pUrl)

    // Click on button to update session homework
    submitHomework()

    // Check if session homework is visible
    getSessionHomeworkWithSupportWithoutAudio(sessionHomeworkToEdit[0]).should('be.visible')

    // Login with other teacher to check if homework modified is visible in workload
    cy.login(CLASSTEACHER2, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(sessionHomeworkToEdit[0].dateToDo, 'YYYY/MM/DD').toDate().getTime())

    // Click on session
    openWorkload('11-14_11:25')

    // Check if homework is visible
    getWorkInWorkload(sessionHomeworkToEdit[0], sessionHomeworkToEdit[0].dateToDoWorkload, 'be.visible')

    // Login with student to check if session homework modified is visible
    cy.login(STUDENT, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(sessionHomeworkToEdit[0].dateToDo, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    // Check if homework is visible in homeworks tab
    getSessionHomework(sessionHomeworkToEdit[0]).should('be.visible')
    clickOnContents(sessionHomeworkToEdit[0])

    changetab('Cours')
    selectCourse(studentCourseList[11].Course)

    // Check if session homework modified is visible within the current session
    cy.contains('.session-infos', sessionHomeworkToEdit[0].sessionHeadText).within(() => {
      getSessionHomeworkWithSupportWithoutAudio(sessionHomeworkToEdit[0]).scrollIntoView().should('be.visible')
    })
  })

  it('Courses_UpdateSessionHomework_UpdateDatetFromSessionView', function () {
    const currentSessionHomework = this.coursesData.existingHomework[0]
    const courseList = this.coursesData.CoursesListByProfil
    const studentCourseList = courseList[1]
    const sessionHomeworkToEdit = [
      {
        sessionHeadText: '28 novembre - P4',
        setDate: 'mardi 28 nov. 2023 à 10:35',
        cyClockDate: '2023/11/28',
        dateToDoWorkload: '28/11',
        dateToDo: '2023/11/28'
      }
    ]
    // Login with student to check if session homework modified is not visible
    cy.login(STUDENT, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(sessionHomeworkToEdit[0].cyClockDate, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    // Check if homework is visible
    cy.get('.homework').should('not.exist')

    cy.login(TEACHER, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(currentSessionHomework.sessionDate, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    // Click on session
    openEditHomworkModal(currentSessionHomework, '11-13_11:25', 'Modifier')

    cy.get('.edit-homework-modal').should('be.visible').within(() => {
      cy.get('.target-session').within(() => {
        cy.get('.next-sessions-dropdown').click()
        cy.get('.suggestion-list').within(() => {
          cy.get('li').contains(sessionHomeworkToEdit[0].setDate).click()
        })
      })
    })
    // Click on button to update session homework
    submitHomework()

    // Login with other teacher to check if homework modified is visible in workload
    cy.login(CLASSTEACHER2, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(sessionHomeworkToEdit[0].dateToDo, 'YYYY/MM/DD').toDate().getTime())

    // Click on session
    openWorkload('11-28_11:25')
    // Check if homework is visible
    getWorkInWorkload(currentSessionHomework, sessionHomeworkToEdit[0].dateToDoWorkload, 'be.visible')

    // Login with student to check if session homework modified is visible
    cy.login(STUDENT, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(sessionHomeworkToEdit[0].cyClockDate, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    // Check if homework is visible in homeworks tab
    getSessionHomework(currentSessionHomework).should('be.visible')

    // Check if homework is visible in courses tab
    changetab('Cours')
    selectCourse(studentCourseList[11].Course)

    // Check if session homework modified is visible within the current session
    cy.contains('.session-infos', sessionHomeworkToEdit[0].sessionHeadText).within(() => {
      getSessionHomeworkWithSupport(currentSessionHomework).scrollIntoView().should('be.visible')
    })
  })

  it('Courses_UpdateSessionHomework_UpdateStudentListToEveryoneFromSessionView', function () {
    const currentSessionHomework = this.coursesData.existingHomework[0]

    // Login with an other student in class to see if this work is not visible
    cy.login(STUDENT, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(currentSessionHomework.dateBefore, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    // Check if homework is visible
    getSessionHomework(currentSessionHomework).should('be.visible')

    // Login with an other student in class to see if this work is not visible
    cy.login(STUDENT_IN_CLASS, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(currentSessionHomework.dateBefore, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    // Check if homework is not visible
    cy.get('.homework').should('not.exist')

    cy.login(TEACHER, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(currentSessionHomework.sessionDate, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    // Click on session
    openEditHomworkModal(currentSessionHomework, '11-13_11:25', 'Modifier')

    cy.get('.edit-homework-modal').should('be.visible').within(() => {
      // Select one student
      cy.get('.target-students').within(() => {
        cy.get('.target-students-button').click()
      })
    })
    cy.get('.studentListWindow').within(() => {
      // Click to choose specific student
      cy.get('.class-selector').contains('Toute la classe').click()
      cy.get('.footer').contains('button', 'Enregistrer').click()
    })
    // Click on button to update session homework
    submitHomework()

    // Login with an other student in class to see if this work is not visible
    cy.login(STUDENT_IN_CLASS, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(currentSessionHomework.dateBefore, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    // Check if homework is visible
    getSessionHomework(currentSessionHomework).should('be.visible')
  })

  it('Courses_UpdateSessionHomework_DisplayUpdateOptionFromCourseView', function () {
    const currentSessionHomework = this.coursesData.existingHomework[0]
    const courseList = this.coursesData.CoursesListByProfil
    const teacherCourseList = courseList[0]
    // Login
    cy.login(TEACHER, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(currentSessionHomework.sessionDate, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    changetab('Cours')
    selectCourse(teacherCourseList[2].Course)

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
      cy.contains('button', 'Modifier').should('be.visible')
    })
  })

  it('Courses_UpdateSessionHomework_CoTeacherCanEdit', function () {
    cy.loadTables('courses/courses_tables_coTeacher.sql')
    const currentSessionHomework = this.coursesData.existingHomework[4]
    const sessionHomeworkToEdit = [
      {
        title: 'Travail à faire modifié'
      }
    ]

    // Login
    cy.login(SCHOOL_ADMIN, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(currentSessionHomework.sessionDate, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    // Click on session
    openEditHomworkModal(currentSessionHomework, '12-12_11:25', 'Modifier')

    // Set new informations
    cy.get('.edit-homework-modal').should('be.visible').within(() => {
      cy.get('.labelled').clear()
      cy.get('.labelled').type(sessionHomeworkToEdit[0].title)
    })
    submitHomework()

    // Check if homework is modified
    getSessionHomework(sessionHomeworkToEdit[0]).should('be.visible')
  })

  it('Courses_UpdateSessionContent_UpdateFormSessionView', function () {
    const currentSessionContent = this.coursesData.existingSessionsContent[0]
    const courseList = this.coursesData.CoursesListByProfil
    const studentCourseList = courseList[1]
    const teacherCourseList = courseList[0]
    const sessions = teacherCourseList[2].Sessions
    const sessionContentToEdit = [
      {
        title: 'Support de cours modifié',
        content: 'Description du support de cours modifié',
        attachedFile: 'note.html',
        additionalText: 'Texte supplémentaire pour le support de cours',
        link: 'Lien pour le support de cours modifié',
        linkUrl: 'https://www.monlienmodifié.com',
        video: 'Vidéo pour le support de cours modifié',
        videoUrl: '<iframe width="560" height="315" src="https://www.youtube.com/embed/BQCSn5YMc6s?si=r-O2MkvB1QSCqRpr" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
        h5p: 'H5P pour le support de cours modifié',
        h5pUrl: '<iframe src="https://h5p.org/h5p/embed/617" width="1090" height="675" frameborder="0" allowfullscreen="allowfullscreen" allow="geolocation *; microphone *; camera *; midi *; encrypted-media *" title="Interactive Video"></iframe><script src="https://h5p.org/sites/all/modules/h5p/library/js/h5p-resizer.js" charset="UTF-8"></script>'
      }
    ]

    // Login
    cy.login(TEACHER, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(currentSessionContent.sessionDate, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    // Click on session
    openEditSessionContentModal(currentSessionContent, '11-13_11:25', 'Modifier')

    // Set new informations
    cy.get('.edit-course-modal').should('be.visible').within(() => {
      // Set title
      cy.get('.labelled').clear()
      cy.get('.labelled').type(sessionContentToEdit[0].title)
      // Set description
      cy.type_ckeditor(sessionContentToEdit[0].content, 'contentItem_0')
      // Add cy.tick beacause cy.clock()
      cy.tick(1000)

      // // Delete old supports before add new supports
      cy.get('.attached-file').within(() => {
        cy.get('.remove-button').click()
      })
      cy.get('.course-content').each($courseContent => {
        cy.wrap($courseContent).within(() => {
          cy.get('.remove-button').click()
        })
      })
    })

    // Add attached file
    addFile(sessionContentToEdit[0].attachedFile)
    // Add link
    addLink(sessionContentToEdit[0].link, sessionContentToEdit[0].linkUrl)
    // Add video
    addVideo(sessionContentToEdit[0].video, sessionContentToEdit[0].videoUrl)
    // Add H5P
    addH5P(sessionContentToEdit[0].h5p, sessionContentToEdit[0].h5pUrl)

    // Click on button to create session content
    submitSessionContent()

    // Check if session content is visible
    cy.get('.session-details').within(() => {
      // Check if session content and session homework is visible
      getSessionContentWithSupportWithoutAudio(sessionContentToEdit[0]).should('be.visible')
    })

    // Login with student to check if session content modified is visible
    cy.login(STUDENT, coursesURL)

    // Open courses tab
    changetab('Cours')
    // Click on right course
    selectCourse(studentCourseList[11].Course)

    // Check if session content modified is visible within the current session
    cy.contains('.session-infos', sessions[1].headText).within(() => {
      getSessionContentWithSupportWithoutAudio(sessionContentToEdit[0]).should('be.visible')
    })
  })

  it('Courses_UpdateSessionContent_DisplayUpdateOptionFromCourseView', function () {
    const currentSessionContent = this.coursesData.existingSessionsContent[0]
    const courseList = this.coursesData.CoursesListByProfil
    const teacherCourseList = courseList[0]
    // Login
    cy.login(TEACHER, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(currentSessionContent.sessionDate, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    // Open courses tab
    changetab('Cours')
    // Click on right course
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
      cy.contains('button', 'Modifier').should('be.visible')
    })
  })

  it('Courses_UpdateSessionContent_CoTeacherCanEdit', function () {
    cy.loadTables('courses/courses_tables_coTeacher.sql')
    const currentSessionContent = this.coursesData.existingSessionsContent[1]
    const sessionContentToEdit = [
      {
        title: 'Contenu de cours modifié'
      }
    ]

    // Login
    cy.login(SCHOOL_ADMIN, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(currentSessionContent.sessionDate, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    // Click on session
    openEditSessionContentModal(currentSessionContent, '12-12_11:25', 'Modifier')

    // Set new informations
    cy.get('.edit-course-modal').should('be.visible')
    cy.get('.edit-course-modal').should('be.visible').within(() => {
      // Set title
      cy.get('.labelled').clear()
      cy.get('.labelled').type(sessionContentToEdit[0].title)
    })

    // Click on button to create session content
    submitSessionContent()

    // Check if session content is visible
    cy.get('.session-details').within(() => {
    // Check if session content and session homework is visible
      getSessionContent(sessionContentToEdit[0]).should('be.visible')
    })
  })
})
