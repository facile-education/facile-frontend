import { coursesURL } from '../../support/constants/urls'
import { STUDENT, TEACHER } from '../../support/constants/users'
import { getSessionContent, getSessionContentWithSupportWithoutAudio } from '../../support/utils/courses'

describe('Sessions content', () => {
  beforeEach(() => {
    cy.loadTables('courses/courses_tables_homework.sql')
    cy.fixture('courses.json').as('coursesData')
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
    cy.get('[title="Ajouter une pièce jointe depuis vos documents de l\'ENTA"]').click()
    cy.get('[data-test="documentFile"]').within(() => {
      cy.contains('.file', sessionContentToCreate[0].attachedFile).click()
      cy.get('[data-test="submitButton"]').click()
    })

    // Add texte
    cy.get('[title="Ajouter du texte"]').click()
    cy.type_ckeditor(sessionContentToCreate[0].additionalText, 'contentItem_2')
    // Add cy.tick beacause cy.clock()
    cy.tick(1000)

    // Skip test audio because bug cy.clock()

    // Add link
    cy.get('[title="Ajouter un lien"]').click()
    cy.get('[data-test="link"]').within(() => {
      cy.get('.link-name').type(sessionContentToCreate[0].link)
      cy.get('.link-url').type(sessionContentToCreate[0].linkUrl)
      cy.get('[data-test="addLinkButton"]').click()
    })

    // Add video
    cy.get('[title="Ajouter une vidéo"]').click()
    cy.get('[data-test="video"]').within(() => {
      cy.get('.video-name').type(sessionContentToCreate[0].video)
      cy.get('.video-url').type(sessionContentToCreate[0].videoUrl)
      cy.get('[data-test="addVideo"]').click()
    })

    // Add H5P
    cy.get('[title="Ajouter un élément H5P"]').click()
    cy.get('[data-test="h5p"]').within(() => {
      cy.get('.content-name').type(sessionContentToCreate[0].h5p)
      cy.get('.content-url').type(sessionContentToCreate[0].h5pUrl)
      cy.get('[data-test="addH5P"]').click()
    })

    // Click on button to create session content
    cy.get('.edit-course-modal').should('be.visible').within(() => {
      cy.contains('button', 'Publier').click()
    })
    // Wait to load session content
    cy.intercept('GET', '**/get-session-contents?**').as('loadSessionContent')
    cy.wait('@loadSessionContent')
    // Check if session content is visible
    cy.get('.session-details').within(() => {
      // Check if session content and session homework is visible
      getSessionContentWithSupportWithoutAudio(sessionContentToCreate[0]).should('be.visible')
    })

    // Login with student to check if session content modified is visible
    cy.login(STUDENT, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(sessionContentToCreate[0].date, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    // Open courses tab
    cy.get('.tabs').within(() => {
      cy.contains('li', 'Cours').click()
    })
    // Click on right course
    cy.get('.courses').should('be.visible').within(() => {
      cy.contains('li', studentCourseList[11].Course).click()
    })
    // Check if session content modified is visible within the current session
    cy.contains('.session-infos', sessionContentToCreate[0].sessionHeadText).within(() => {
      getSessionContentWithSupportWithoutAudio(sessionContentToCreate[0]).scrollIntoView().should('be.visible')
    })
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

    // Open courses tab
    cy.get('.tabs').within(() => {
      cy.contains('li', 'Cours').click()
    })
    // Click on right course
    cy.get('.courses').should('be.visible').within(() => {
      cy.contains('li', studentCourseList[11].Course).click()
    })
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

    cy.get('.tabs').within(() => {
      cy.contains('li', 'Cours').click()
    })
    cy.get('.courses').should('be.visible').within(() => {
      cy.contains('li', teacherCourseList[2].Course).click()
    })
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
    // Click on update button
    cy.get('.context-menu').within(() => {
      cy.contains('button', 'Modifier').click()
    })

    // Set new informations
    cy.get('.edit-course-modal').should('be.visible').within(() => {
      // Set title
      cy.get('.labelled').clear()
      cy.get('.labelled').type(sessionContentToEdit[0].title)
      // Set description
      cy.type_ckeditor(sessionContentToEdit[0].content, 'contentItem_0')
      // Add cy.tick beacause cy.clock()
      cy.tick(1000)

      // // Delete old supports before ad new supports
      cy.get('.attached-file').within(() => {
        cy.get('.remove-button').click()
      })
      cy.get('.course-content').each($courseContent => {
        cy.wrap($courseContent).within(() => {
          cy.get('.remove-button').click()
        })
      })
    })
    // // Add attached file
    cy.get('[title="Ajouter une pièce jointe depuis vos documents de l\'ENTA"]').click()
    cy.get('[data-test="documentFile"]').within(() => {
      cy.contains('.file', sessionContentToEdit[0].attachedFile).click()
      cy.get('[data-test="submitButton"]').click()
    })

    cy.type_ckeditor(sessionContentToEdit[0].additionalText, 'contentItem_2')
    // Add cy.tick beacause cy.clock()
    cy.tick(1000)

    // // Skip test audio because bug cy.clock()

    // // Add link
    cy.get('[title="Ajouter un lien"]').click()
    cy.get('[data-test="link"]').within(() => {
      cy.get('.link-name').type(sessionContentToEdit[0].link)
      cy.get('.link-url').type(sessionContentToEdit[0].linkUrl)
      cy.get('[data-test="addLinkButton"]').click()
    })

    // // Add video
    cy.get('[title="Ajouter une vidéo"]').click()
    cy.get('[data-test="video"]').within(() => {
      cy.get('.video-name').type(sessionContentToEdit[0].video)
      cy.get('.video-url').type(sessionContentToEdit[0].videoUrl)
      cy.get('[data-test="addVideo"]').click()
    })

    // // Add H5P
    cy.get('[title="Ajouter un élément H5P"]').click()
    cy.get('[data-test="h5p"]').within(() => {
      cy.get('.content-name').type(sessionContentToEdit[0].h5p)
      cy.get('.content-url').type(sessionContentToEdit[0].h5pUrl)
      cy.get('[data-test="addH5P"]').click()
    })

    // Click on button to create session content
    cy.get('.edit-course-modal').should('be.visible').within(() => {
      cy.contains('button', 'Programmer').click()
    })
    // Wait to load session content
    cy.intercept('GET', '**/get-session-contents?**').as('loadSessionContent')
    cy.wait('@loadSessionContent')
    // Check if session content is visible
    cy.get('.session-details').within(() => {
      // Check if session content and session homework is visible
      getSessionContentWithSupportWithoutAudio(sessionContentToEdit[0]).should('be.visible')
    })

    // Login with student to check if session content modified is visible
    cy.login(STUDENT, coursesURL)

    // Open courses tab
    cy.get('.tabs').within(() => {
      cy.contains('li', 'Cours').click()
    })
    // Click on right course
    cy.get('.courses').should('be.visible').within(() => {
      cy.contains('li', studentCourseList[11].Course).click()
    })
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

    cy.get('.tabs').within(() => {
      cy.contains('li', 'Cours').click()
    })
    cy.get('.courses').should('be.visible').within(() => {
      cy.contains('li', teacherCourseList[2].Course).click()
    })
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
})
