import { coursesURL } from '../../support/constants/urls'
import { MULTI_PARENT, MULTI_STUDENT2, PARENT, STUDENT, TEACHER } from '../../support/constants/users'
import { getSessionHomework, getSessionHomeworkWithSupport, getSessionHomeworkWithSupportWithoutAudio } from '../../support/utils/courses'
import { selectChild } from '../../support/utils/dashboard'

describe('Sessions homeworks', () => {
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

  it('Courses_CreateSessionHomework_CreateWithAllContentsTypesForFuturSession', function () {
    const courseList = this.coursesData.CoursesListByProfil
    const studentCourseList = courseList[1]
    const sessionHomeworkToCreate = [
      {
        sessionHeadText: '12 septembre - P4',
        creationDate: '2023/09/11',
        title: 'Travail à faire créé',
        content: 'Description du travail à faire créé',
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
    })
    // Add attached file
    cy.get('[title="Ajouter une pièce jointe depuis vos documents de l\'ENTA"]').click()
    cy.get('[data-test="file-picker-modal"]').within(() => {
      cy.contains('.file', sessionHomeworkToCreate[0].attachedFile).click()
      cy.get('[data-test="submitButton"]').click()
    })

    // Add texte
    // cy.get('[title="Ajouter du texte"]').click()
    // cy.type_ckeditor(sessionHomeworkToCreate[0].additionalText, 'contentItem_1')
    // // Add cy.tick beacause cy.clock()
    // cy.tick(1000)

    // Skip test audio because bug cy.clock()

    // Add link
    cy.get('[title="Ajouter un lien"]').click()
    cy.get('[data-test="link"]').within(() => {
      cy.get('.link-name').type(sessionHomeworkToCreate[0].link)
      cy.get('.link-url').type(sessionHomeworkToCreate[0].linkUrl)
      cy.get('[data-test="addLinkButton"]').click()
    })

    // Add video
    cy.get('[title="Ajouter une vidéo"]').click()
    cy.get('[data-test="video"]').within(() => {
      cy.get('.video-name').type(sessionHomeworkToCreate[0].video)
      cy.get('.video-url').type(sessionHomeworkToCreate[0].videoUrl)
      cy.get('[data-test="addVideo"]').click()
    })

    // Add H5P
    cy.get('[title="Ajouter un élément H5P"]').click()
    cy.get('[data-test="h5p"]').within(() => {
      cy.get('.content-name').type(sessionHomeworkToCreate[0].h5p)
      cy.get('.content-url').type(sessionHomeworkToCreate[0].h5pUrl)
      cy.get('[data-test="addH5P"]').click()
    })

    // Click on button to create session homework
    cy.get('.edit-homework-modal').within(() => {
      cy.contains('button', 'Publier').click()
    })
    // Wait to load session content
    cy.intercept('GET', '**/get-session-details**').as('loadSessionDetails')
    cy.wait('@loadSessionDetails')
    // Check if session content is visible
    cy.get('.session-details').within(() => {
      // Check if session homework is visible
      getSessionHomeworkWithSupportWithoutAudio(sessionHomeworkToCreate[0]).should('be.visible')
    })

    // Login with student to check if session homework modified is visible
    cy.login(STUDENT, coursesURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(sessionHomeworkToCreate[0].creationDate, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works

    // Open courses tab
    cy.get('.tabs').within(() => {
      cy.contains('li', 'Cours').click()
    })
    // Click on right course
    cy.get('.courses').should('be.visible').within(() => {
      cy.contains('li', studentCourseList[11].Course).click()
    })
    // Check if session homework modified is visible within the current session
    cy.contains('.session-infos', sessionHomeworkToCreate[0].sessionHeadText).within(() => {
      getSessionHomeworkWithSupportWithoutAudio(sessionHomeworkToCreate[0]).scrollIntoView().should('be.visible')
    })
  })
})
