import { coursesURL } from '../../support/constants/urls'
import { CLASSTEACHER2, STUDENT, STUDENT_IN_CLASS, TEACHER } from '../../support/constants/users'
import { addFile, addH5P, addLink, addVideo, changetab, getSessionContentWithSupportWithoutAudio, getSessionHomework, getSessionHomeworkWithSupportWithoutAudio, getWorkInWorkload, selectCourse } from '../../support/utils/courses'

describe('Create', () => {
  beforeEach(() => {
    cy.loadTables('courses/courses_tables_homework_empty.sql')
    cy.fixture('courses.json').as('coursesData')
  })

  it('Courses_CreateSessionHomework_CreateWithAllContentsTypesForFuturSession', function () {
    const courseList = this.coursesData.CoursesListByProfil
    const studentCourseList = courseList[1]
    const sessionHomeworkToCreate = [
      {
        sessionHeadText: '12 septembre - P4',
        dateToDoWorkload: '12/09',
        dateToDo: '2023/09/12',
        creationDate: '2023/09/11',
        title: 'Travail à faire créé',
        content: 'Description du travail à faire créé',
        estimatedTime: '1h30',
        attachedFile: 'note.html',
        additionalText: 'Texte supplémentaire pour le travail à faire créé',
        link: 'Lien pour le travail à faire créé',
        linkUrl: 'https://www.monliencréé.com',
        video: 'Vidéo pour le travail à faire créé',
        videoUrl: '<iframe width="560" height="315" src="https://www.youtube.com/embed/BQCSn5YMc6s?si=r-O2MkvB1QSCqRpr" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
        h5p: 'H5P pour le travail à faire créé',
        h5pUrl: '<iframe src="https://h5p.org/h5p/embed/617" width="1090" height="675" frameborder="0" allowfullscreen="allowfullscreen" allow="geolocation *; microphone *; camera *; midi *; encrypted-media *" title="Interactive Video"></iframe><script src="https://h5p.org/sites/all/modules/h5p/library/js/h5p-resizer.js" charset="UTF-8"></script>'
      }
    ]
    // Login
    cy.login(TEACHER, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(sessionHomeworkToCreate[0].creationDate, 'YYYY/MM/DD').toDate().getTime())

    // Click on session
    cy.get('[data-test="09-11_11:25"]').click()
    cy.get('.homeworks').within(() => {
      // Click on create homework button
      cy.get('[data-test="createSessionHomework"]').click()
    })
    cy.get('.edit-homework-modal').should('be.visible').within(() => {
      // Set title
      cy.get('.labelled').type(sessionHomeworkToCreate[0].title)
      // Set description
      cy.type_ckeditor(sessionHomeworkToCreate[0].content)
      // Add cy.tick beacause cy.clock()
      cy.tick(1000)
      // Set estimated time
      cy.get('.duration').within(() => {
        cy.get('.base-dropdown').click()
      })
      cy.get('.suggestion-list').within(() => {
        cy.get('li').contains(sessionHomeworkToCreate[0].estimatedTime).click()
      })
    })
    // Add attached file
    addFile(sessionHomeworkToCreate[0].attachedFile)
    // Add link
    addLink(sessionHomeworkToCreate[0].link, sessionHomeworkToCreate[0].linkUrl)
    // Add video
    addVideo(sessionHomeworkToCreate[0].video, sessionHomeworkToCreate[0].videoUrl)
    // Add H5P
    addH5P(sessionHomeworkToCreate[0].h5p, sessionHomeworkToCreate[0].h5pUrl)

    // Click on button to create session homework
    cy.get('.edit-homework-modal').within(() => {
      cy.contains('button', 'Publier').click()
    })
    // Check if session homework is visible
    cy.get('.session-details').within(() => {
      getSessionHomeworkWithSupportWithoutAudio(sessionHomeworkToCreate[0]).should('be.visible')
    })

    // Check visibility in workload for an other teacher in class
    // Login
    cy.login(CLASSTEACHER2, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(sessionHomeworkToCreate[0].creationDate, 'YYYY/MM/DD').toDate().getTime())

    // Click on session
    cy.get('[data-test="09-12_11:25"]').click()

    cy.get('.homeworks').within(() => {
      // TO DO Remove after fix
      cy.wait(2000)
      // Click on create homework button
      cy.get('[data-test="createSessionHomework"]').click()
    })
    getWorkInWorkload(sessionHomeworkToCreate[0], sessionHomeworkToCreate[0], 'be.visible')

    // Login with student to check if session homework modified is visible
    cy.login(STUDENT, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(sessionHomeworkToCreate[0].dateToDo, 'YYYY/MM/DD').toDate().getTime())
    // Check in homeworks tab
    getSessionHomework(sessionHomeworkToCreate[0]).should('be.visible')

    // Check in courses tab
    changetab('Cours')
    selectCourse(studentCourseList[11].Course)
    // Check if session homework created is visible within the current session
    cy.contains('.session-infos', sessionHomeworkToCreate[0].sessionHeadText).within(() => {
      getSessionHomeworkWithSupportWithoutAudio(sessionHomeworkToCreate[0]).scrollIntoView().should('be.visible')
    })
  })

  it('Courses_CreateSessionHomework_CreateForCurrentSession', function () {
    const courseList = this.coursesData.CoursesListByProfil
    const studentCourseList = courseList[1]
    const sessionHomeworkToCreate = [
      {
        sessionHeadText: '11 septembre - P5',
        creationDate: '2023/09/11',
        title: 'Travail à faire créé pour cette séance',
        content: 'Description du travail à faire créé pour cette séance'
      }
    ]
    // Login
    cy.login(TEACHER, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(sessionHomeworkToCreate[0].creationDate, 'YYYY/MM/DD').toDate().getTime())

    cy.get('[data-test="09-11_11:25"]').click()
    cy.get('.homeworks').within(() => {
      // Click on create homework button
      cy.get('[data-test="createSessionHomework"]').click()
    })
    cy.get('.edit-homework-modal').should('be.visible').within(() => {
      // Set title
      cy.get('.labelled').type(sessionHomeworkToCreate[0].title)
      // Set description
      cy.type_ckeditor(sessionHomeworkToCreate[0].content)
      // Add cy.tick beacause cy.clock()
      cy.tick(1000)
      cy.get('.target-session').within(() => {
        // Set homework for this session
        cy.contains('label', 'À faire pendant la séance').click()
        // Check if set date dropdown is visible
        cy.get('.next-sessions-dropdown').within(() => {
          cy.get('.button').should('have.attr', 'disabled')
        })
      })
    })

    // Click on button to create session homework
    cy.get('.edit-homework-modal').within(() => {
      cy.contains('button', 'Publier').click()
    })
    // Check if session content is visible
    cy.get('.session-details').within(() => {
      // Check if session homework is visible
      getSessionHomework(sessionHomeworkToCreate[0]).should('be.visible')
    })

    // Login with student to check if session homework is visible
    cy.login(STUDENT, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(sessionHomeworkToCreate[0].creationDate, 'YYYY/MM/DD').toDate().getTime())

    // Open courses tab
    changetab('Cours')
    // Click on right course
    selectCourse(studentCourseList[11].Course)
    // Check if session homework created is visible within the current session
    cy.contains('.session-infos', sessionHomeworkToCreate[0].sessionHeadText).within(() => {
      getSessionHomework(sessionHomeworkToCreate[0]).scrollIntoView().should('be.visible')
    })
  })

  it('Courses_CreateSessionHomework_CreateForOneStudent', function () {
    const sessionHomeworkToCreate = [
      {
        sessionHeadText: '12 septembre - P4',
        creationDate: '2023/09/11',
        dateToDo: '2023/09/12',
        dateToDoWorkload: '12/09',
        title: 'Travail à faire créé pour un seul élève',
        content: 'Description du travail à faire créé pour un seul élève'
      }
    ]
    // Login
    cy.login(TEACHER, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(sessionHomeworkToCreate[0].creationDate, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
    // Click on session
    cy.get('[data-test="09-11_11:25"]').click()
    cy.get('.homeworks').within(() => {
      // Click on create homework button
      cy.get('[data-test="createSessionHomework"]').click()
    })
    cy.get('.edit-homework-modal').should('be.visible').within(() => {
      // Set title
      cy.get('.labelled').type(sessionHomeworkToCreate[0].title)
      // Set description
      cy.type_ckeditor(sessionHomeworkToCreate[0].content)
      // Add cy.tick beacause cy.clock()
      cy.tick(1000)
      // Select one student
      cy.get('.target-students').within(() => {
        cy.get('.target-students-button').click()
      })
    })
    cy.get('.studentListWindow').within(() => {
      // Click to choose specific student
      cy.get('.class-selector').contains('Spécifique').click()
      // Click on Penelope Ribeiro
      cy.get('li').contains(`${STUDENT.lastName} ${STUDENT.firstName}`).click()
      cy.get('.footer').contains('button', 'Enregistrer').click()
    })

    // Click on button to create session homework
    cy.get('.edit-homework-modal').within(() => {
      cy.contains('button', 'Publier').click()
    })
    // Check if session homework is visible
    cy.get('.session-details').within(() => {
      // Check if session homework is visible
      getSessionHomework(sessionHomeworkToCreate[0]).should('be.visible')
    })

    // Check visibility in workload for an other teacher in class
    // Login
    cy.login(CLASSTEACHER2, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(sessionHomeworkToCreate[0].creationDate, 'YYYY/MM/DD').toDate().getTime())

    // Click on session
    cy.get('[data-test="09-12_11:25"]').click()

    cy.get('.homeworks').within(() => {
      // TO DO Remove after fix
      cy.wait(2000)
      // Click on create homework button
      cy.get('[data-test="createSessionHomework"]').click()
    })
    cy.get('.edit-homework-modal').should('be.visible').within(() => {
      // Select one student
      cy.get('.target-students').within(() => {
        cy.get('.target-students-button').click()
      })
    })
    cy.get('.studentListWindow').within(() => {
      // Click to choose specific student
      cy.get('.class-selector').contains('Spécifique').click()
      // Click on Penelope Ribeiro
      cy.get('li').contains(`${STUDENT_IN_CLASS.lastName} ${STUDENT_IN_CLASS.firstName}`).click()
      cy.get('.footer').contains('button', 'Enregistrer').click()
    })
    getWorkInWorkload(sessionHomeworkToCreate[0], sessionHomeworkToCreate[0], 'not.exist')

    // Login with the only student who should see this homework
    cy.login(STUDENT, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(sessionHomeworkToCreate[0].dateToDo, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
    // Chech if homework created is visible
    getSessionHomework(sessionHomeworkToCreate[0]).should('be.visible')

    // Login with other student in class to check if not see this homework
    cy.login(STUDENT_IN_CLASS, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(sessionHomeworkToCreate[0].dateToDo, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
    // Chech if homework created is not visible
    cy.get('.homework').should('not.exist')
    cy.get('.placeholder').should('be.visible')
  })

  it('Courses_CreateSessionContent_CreateWithAllContentsTypes', function () {
    const courseList = this.coursesData.CoursesListByProfil
    const studentCourseList = courseList[1]
    const sessionContentToCreate = [
      {
        sessionHeadText: '11 septembre - P5',
        date: '2023/09/11',
        title: 'Support de cours créé',
        content: 'Description du support de cours créé',
        attachedFile: 'note.html',
        additionalText: 'Texte supplémentaire pour le support de cours',
        audio: 'Audio du support de cours',
        link: 'Lien pour le support de cours',
        linkUrl: 'https://www.monliencréé.com',
        video: 'Vidéo pour le support de cours',
        videoUrl: '<iframe width="560" height="315" src="https://www.youtube.com/embed/BQCSn5YMc6s?si=r-O2MkvB1QSCqRpr" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
        h5p: 'H5P pour le support de cours',
        h5pUrl: '<iframe src="https://h5p.org/h5p/embed/617" width="1090" height="675" frameborder="0" allowfullscreen="allowfullscreen" allow="geolocation *; microphone *; camera *; midi *; encrypted-media *" title="Interactive Video"></iframe><script src="https://h5p.org/sites/all/modules/h5p/library/js/h5p-resizer.js" charset="UTF-8"></script>'
      }
    ]
    // Login
    cy.login(TEACHER, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(sessionContentToCreate[0].date, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    // Click on session
    cy.get('[data-test="09-11_11:25"]').click()
    cy.get('.session-content').within(() => {
      cy.get('[data-test="createSessionContent"]').click()
    })
    cy.get('.edit-course-modal').should('be.visible').within(() => {
      // Set title
      cy.get('.labelled').type(sessionContentToCreate[0].title)
      // Set description
      cy.type_ckeditor(sessionContentToCreate[0].content, 'contentItem_0')
      // Add cy.tick beacause cy.clock()
      cy.tick(1000)
    })
    // Add attached file
    addFile(sessionContentToCreate[0].attachedFile)

    // Add texte
    cy.get('[title="Ajouter du texte"]').click()
    cy.type_ckeditor(sessionContentToCreate[0].additionalText, 'contentItem_2')
    // Add cy.tick beacause cy.clock()
    cy.tick(1000)

    // Add link
    addLink(sessionContentToCreate[0].link, sessionContentToCreate[0].linkUrl)
    // Add video
    addVideo(sessionContentToCreate[0].video, sessionContentToCreate[0].videoUrl)
    // Add H5P
    addH5P(sessionContentToCreate[0].h5p, sessionContentToCreate[0].h5pUrl)

    // Click on button to create session content
    cy.get('.edit-course-modal').should('be.visible').within(() => {
      cy.contains('button', 'Publier').click()
    })
    // Check if session content is visible
    cy.get('.session-details').within(() => {
      // Check if session content and session homework is visible
      getSessionContentWithSupportWithoutAudio(sessionContentToCreate[0]).should('be.visible')
    })

    // Login with student to check if session content modified is visible
    cy.login(STUDENT, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(sessionContentToCreate[0].date, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    changetab('Cours')
    selectCourse(studentCourseList[11].Course)

    // Check if session content created is visible within the current session
    cy.contains('.session-infos', sessionContentToCreate[0].sessionHeadText).within(() => {
      getSessionContentWithSupportWithoutAudio(sessionContentToCreate[0]).scrollIntoView().should('be.visible')
    })
  })
})
