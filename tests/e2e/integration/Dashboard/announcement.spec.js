import { dashboardURL } from '../../support/constants/urls'
import { HEADMASTER, MULTI_STUDENT1, PARENT, SCHOOL_ADMIN, STUDENT, TEACHER, TEACHER2 } from '../../support/constants/users'
import { checkFileVisibilityAndClick, getNews, getNewsDetail, setAnnouncementDocumentWithContent } from '../../support/utils/dashboard'

describe('Dashboard_Announcements', () => {
  beforeEach(() => {
    cy.loadTables('dashboard/dashboard_tables_news.sql')
    cy.fixture('dashboard.json').as('dashboardData').then(data => {
      cy.clock(Cypress.dayjs(data.now, 'YYYY/MM/DD').toDate().getTime())
    })
  })
  context('desktop', function () {
    it('Dashboard_Announcement_DisplayAnnouncementsReadUnRead', function () {
      const furturNews = this.dashboardData.futurNews
      const existingNews = this.dashboardData.existingNews
      // Login
      cy.login(STUDENT, dashboardURL)
      // Set Date before release
      cy.clock().invoke('setSystemTime', Cypress.dayjs(furturNews.dateBeforeRelease, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
      // Check if pellet is visible
      cy.get('[data-test="announcement-widget"]').within(() => {
        cy.get('.announcement').should('have.length', 1).within(() => {
          cy.get('.pellet').should('be.visible')
        })
      })
      // Click on event
      getNews(existingNews[1]).click()
      cy.get('[data-test="closeModal"]').click()
      // Check if pellet is not visible
      cy.get('[data-test="announcement-widget"]').within(() => {
        cy.get('.announcement').should('have.length', 1).within(() => {
          cy.get('.pellet').should('not.exist')
        })
      })
      // Click on read onlyButton
      cy.get('[data-test="ReadOnlyAnnouncementButton"]').click()
      // Check if event is not visible
      getNews(existingNews[1]).should('not.exist')
    })

    it('Dashboard_Announcement_DisplayAnnouncementsFuturRelease', function () {
      const furturNews = this.dashboardData.futurNews
      // Login
      cy.login(STUDENT, dashboardURL)
      // Set Date before release
      cy.clock().invoke('setSystemTime', Cypress.dayjs(furturNews.dateBeforeRelease, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
      // Just one annoucement should be display
      cy.get('[data-test="announcement-widget"]').within(() => {
        cy.get('.announcement').should('have.length', 1)
      })
      // Check if futur news is not visible
      getNews(furturNews).should('not.exist')

      // Login
      cy.login(STUDENT, dashboardURL)
      // Set date after release
      cy.clock().invoke('setSystemTime', Cypress.dayjs(furturNews.publicationDate, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
      // Two annoucements should be display
      cy.get('[data-test="announcement-widget"]').within(() => {
        cy.get('.announcement').should('have.length', 2)
      })
      // Check if futur news is visible
      getNews(furturNews).should('be.visible')
    })

    it('Dashboard_Annoucements_DisplayAnnouncementCheckContent', function () {
      const existingNews = this.dashboardData.existingNews
      const lastNews = existingNews[2]

      cy.login(HEADMASTER, dashboardURL)
      getNews(lastNews).click()
      cy.get('[data-test="news-details-modal"]').within(() => {
        // Check the title
        cy.get('.header').should('contain', lastNews.title)
        // Check thumnail
        cy.get('.thumbnail').should('be.visible')
        // check the recipient
        cy.get('.lonely-population').should('contain', lastNews.recipient)
        // Check the publication info
        cy.get('.publication').should('contain', `${HEADMASTER.firstName} ${HEADMASTER.lastName}`)
        cy.get('.publication').should('contain', lastNews.publicationDate)
        // Check the content
        cy.get('.detailed-news > .content').should('contain', lastNews.content)
      })
    })

    it('Dashboard_Annoucements_DisplayAnnouncementByProfil', function () {
      const existingNews = this.dashboardData.existingNews

      // Announcements created by the headmaster for a class
      cy.login(TEACHER, dashboardURL)
      getNews(existingNews[2]).should('be.visible')

      cy.login(SCHOOL_ADMIN, dashboardURL)
      getNews(existingNews[2]).should('be.visible')

      // Announcements created by the delegate for the establishment
      cy.login(HEADMASTER, dashboardURL)
      getNews(existingNews[3]).should('be.visible')

      cy.login(SCHOOL_ADMIN, dashboardURL)
      getNews(existingNews[3]).should('be.visible')
    })

    it('Dashboard_Announcements_DisplayAnnouncementCheckReadRecipientInfo', function () {
      const existingNews = this.dashboardData.existingNews
      const lastNews = existingNews[0]

      // Login with author
      cy.login(HEADMASTER, dashboardURL)
      getNews(lastNews).click()
      cy.get('[data-test="news-details-modal"]').within(() => {
        // No one read this event
        cy.get('.read-infos').should('contain', 'Lu par', '0 destinataire')
      })
      // Login recipient
      cy.login(PARENT, dashboardURL)
      // Parent read this event
      getNews(lastNews).click()
      // Check if parent can't see the read infos
      cy.get('[data-test="news-details-modal"]').within(() => {
        cy.get('.read-infos').should('not.be.exist')
      })

      // Login with author
      cy.login(HEADMASTER, dashboardURL)
      getNews(lastNews).click()
      cy.get('[data-test="news-details-modal"]').within(() => {
        // No one read this event
        cy.get('.read-infos').should('contain', 'Lu par', '1 destinataire')
        // Open recipients infos
        cy.get('.read-infos > button').click()
      })
      cy.get('[data-test="readInfoModal"]').within(() => {
        // Open population panel
        cy.get('.population').click()
        cy.get('.population').click()
        // Check if recipient who read is mark as read
        cy.get('.read-info-user').contains(`${PARENT.lastName} ${PARENT.firstName}`).should('not.contain', 'Non lu')
      })
    })

    it('Dashboard_Announcements_DisplayAllAnnouncements', function () {
      const existingNews = this.dashboardData.existingNews
      const furturNews = this.dashboardData.futurNews
      // Login
      cy.login(HEADMASTER, dashboardURL)
      cy.clock().invoke('setSystemTime', Cypress.dayjs(furturNews.dateBeforeRelease, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
      // Click on all announcements button
      cy.get('[data-test="announcement-widget"]').within(() => {
        cy.contains('button', 'Voir toutes les annonces').click()
      })
      // Check if first news is visible
      cy.get('.announcements-list').contains('.announcement', existingNews[2].title).should('be.exist')
      // Chech the content
      getNewsDetail(existingNews[2]).should('be.exist')
      // Check if news is selected with good class
      cy.get('.announcement').eq(0).should('have.class', 'theme-light-background-color')
      cy.get('.announcement').eq(1).should('not.have.class', 'theme-light-background-color')
      cy.get('.announcement').eq(2).should('not.have.class', 'theme-light-background-color')

      // Check if second news is visible
      cy.get('.announcements-list').contains('.announcement', existingNews[1].title).should('be.exist').click()
      getNewsDetail(existingNews[1]).should('be.exist')
      // Check if news is selected with good class
      cy.get('.announcement').eq(0).should('not.have.class', 'theme-light-background-color')
      cy.get('.announcement').eq(1).should('have.class', 'theme-light-background-color')
      cy.get('.announcement').eq(2).should('not.have.class', 'theme-light-background-color')

      // Check if third news is visible
      cy.get('.announcements-list').contains('.announcement', existingNews[0].title).should('be.exist').click()
      getNewsDetail(existingNews[0]).should('be.exist')
      // Check if news is selected with good class
      cy.get('.announcement').eq(0).should('not.have.class', 'theme-light-background-color')
      cy.get('.announcement').eq(1).should('not.have.class', 'theme-light-background-color')
      cy.get('.announcement').eq(2).should('have.class', 'theme-light-background-color')
    })

    it('Dashboard_Announcements_CreateAnnouncementWithAllTypesOfAttachedFiles', function () {
      const NewNews = this.dashboardData.NewNews

      setAnnouncementDocumentWithContent()
      // Check if an admin can create an annoucement
      cy.login(SCHOOL_ADMIN, dashboardURL)
      cy.clock().invoke('setSystemTime', Cypress.dayjs(NewNews.dataToCreate, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
      cy.get('[data-test="buttonCreateAnnoucement"]').click()
      cy.get('[data-test="update-news-modal"]').should('be.visible')

      // Check if a delegate can create an annoucement
      cy.login(TEACHER, dashboardURL)
      cy.get('[data-test="buttonCreateAnnoucement"]').click()
      cy.get('[data-test="update-news-modal"]').should('be.visible')

      // Create announcement with the headmaster for the teachers
      cy.login(HEADMASTER, dashboardURL)
      // Open create modal
      cy.get('[data-test="buttonCreateAnnoucement"]').click()
      // Set all informations
      cy.get('[data-test="update-news-modal"]').within(() => {
        cy.get('.base-tags-input').click()
        cy.get('.suggestion-list').contains('li', NewNews.recipient).click()
        cy.get('.labelled').type(NewNews.title)
        cy.get('.ck-editor')
        cy.type_ckeditor(NewNews.content)
        // Open FilePicker modal
        cy.get('.select-files-buttons').within(() => {
          cy.get('button').eq(0).click()
        })
      })
      // Add file from personal document
      cy.get('[data-test="file-picker-modal"]').within(() => {
        cy.contains('.file', NewNews.personalDocument).click()
        cy.get('[data-test="submitButton"]').click()
      })

      // Open FilePicker modal
      cy.get('.select-files-buttons').within(() => {
        cy.get('button').eq(0).click()
      })
      // Add file from collaborative document
      cy.get('[data-test="file-picker-modal"]').within(() => {
        cy.get('[data-test="breadcrumb-item"]').click()
        cy.get('[data-test="groups"]').click()
        cy.get('.documents-list').within(() => {
          cy.contains('button', 'Espace collaboratif sans les élèves').click()
        })
        cy.contains('.file', NewNews.collaborativeDocument).click()
        cy.get('[data-test="submitButton"]').click()
      })
      // Open FilePicker modal
      cy.get('.select-files-buttons').within(() => {
        // Get file in fixture
        cy.fixture('filesToUpload/file.txt').as('myFile')
        // Get input type file in button to get get file in workSpace
        cy.get('button').eq(1).within(() => {
          // Use selectFile to simulate get file in workSpace
          cy.get('input[type=file]').selectFile('@myFile', { force: true })
        })
      })
      cy.get('[data-test="update-news-modal"]').within(() => {
        // Click on createButton
        cy.get('[data-test="submitButton"]').click()
      })
      // Check is all attached files is visible and clickable
      getNews(NewNews).should('be.exist').within(() => {
        cy.get('[data-test="fileIcon"]').should('be.visible')
      })

      // Check if student see the annoucement with all attached files
      cy.login(STUDENT, dashboardURL)
      cy.clock().invoke('setSystemTime', Cypress.dayjs(NewNews.dateToRead, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
      getNews(NewNews).should('be.exist').click()
      // Check if all files is visible and clickable
      checkFileVisibilityAndClick(NewNews.personalDocument)
      checkFileVisibilityAndClick(NewNews.collaborativeDocument)
      checkFileVisibilityAndClick(NewNews.workSpaceDocument)

      // Check if a teacher see the annoucement
      cy.login(TEACHER2, dashboardURL)
      cy.clock().invoke('setSystemTime', Cypress.dayjs(NewNews.dateToRead, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
      getNews(NewNews).should('be.exist').click()
      checkFileVisibilityAndClick(NewNews.personalDocument)
      checkFileVisibilityAndClick(NewNews.collaborativeDocument)
      checkFileVisibilityAndClick(NewNews.workSpaceDocument)
    })

    it('Dashboard_Announcements_CreateAnnouncementByHeadmasterCheckDelegateVisibility', function () {
      setAnnouncementDocumentWithContent()
      const newsToStudent = {
        recipient: 'Elèves de la volée 10',
        title: 'Nouvelle annonce',
        content: 'Ceci est le contenu de la nouvelle annonce',
        personalDocument: 'Note avec des caractères spéciaux_.html',
        dateToCreate: '2023/12/07',
        dateToRead: '2023/12/08'
      }
      // Create announcement with the headmaster for students
      cy.login(HEADMASTER, dashboardURL)
      cy.clock().invoke('setSystemTime', Cypress.dayjs(newsToStudent.dateToCreate, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
      // Open create modal
      cy.get('[data-test="buttonCreateAnnoucement"]').click()
      // Set all informations
      cy.get('[data-test="update-news-modal"]').within(() => {
        cy.get('.base-tags-input').click()
        cy.get('.suggestion-list').contains('li', newsToStudent.recipient).click()
        cy.get('.labelled').type(newsToStudent.title)
        cy.get('.ck-editor')
        cy.type_ckeditor(newsToStudent.content)
        // Open FilePicker modal
        cy.get('.select-files-buttons').within(() => {
          cy.get('button').eq(0).click()
        })
      })
      // Add file from personal document
      cy.get('[data-test="file-picker-modal"]').within(() => {
        cy.contains('.file', newsToStudent.personalDocument).click()
        cy.get('[data-test="submitButton"]').click()
      })

      cy.get('[data-test="update-news-modal"]').within(() => {
        // Create
        cy.get('[data-test="submitButton"]').click()
      })
      // Check is all attached file icon is visible
      getNews(newsToStudent).should('be.exist').within(() => {
        cy.get('[data-test="fileIcon"]').should('be.visible')
      })

      // Check if redaction delegate see this annoucement
      cy.login(TEACHER, dashboardURL)
      cy.clock().invoke('setSystemTime', Cypress.dayjs(newsToStudent.dateToRead, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
      getNews(newsToStudent).should('be.exist').click()
      cy.get('.news-details-modal').within(() => {
        // Open file modal
        cy.get('.attached-files').within(() => {
          // Check if all files is visible
          cy.contains('.attached-file', newsToStudent.personalDocument).should('be.visible')
        })
      })
    })

    it('Dashboard_Announcements_CreateAnnouncementForTwoPopulationToCheckVisibility', function () {
      setAnnouncementDocumentWithContent()
      const newsToTeacherAndStudent = {
        recipient1: 'Tous les enseignants',
        recipient2: 'Tous les élèves',
        title: 'Nouvelle annonce',
        content: 'Ceci est le contenu de la nouvelle annonce',
        personalDocument: 'Note avec des caractères spéciaux_.html',
        dateToCreate: '2023/12/07',
        dateToRead: '2023/12/08'
      }
      // Create announcement with the headmaster for teachers and students
      cy.login(HEADMASTER, dashboardURL)
      cy.clock().invoke('setSystemTime', Cypress.dayjs(newsToTeacherAndStudent.dateToCreate, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
      // Open create modal
      cy.get('[data-test="buttonCreateAnnoucement"]').click()
      // Set all informations
      cy.get('[data-test="update-news-modal"]').within(() => {
        cy.get('.base-tags-input').click()
        cy.get('.suggestion-list').contains('li', newsToTeacherAndStudent.recipient1).click()
        cy.get('.base-tags-input').click()
        cy.get('.suggestion-list').contains('li', newsToTeacherAndStudent.recipient2).click()
        cy.get('.labelled').type(newsToTeacherAndStudent.title)
        cy.get('.ck-editor')
        cy.type_ckeditor(newsToTeacherAndStudent.content)
        // Open FilePicker modal
        cy.get('.select-files-buttons').within(() => {
          cy.get('button').eq(0).click()
        })
      })
      // Add file from personal document
      cy.get('[data-test="file-picker-modal"]').within(() => {
        cy.contains('.file', newsToTeacherAndStudent.personalDocument).click()
        cy.get('[data-test="submitButton"]').click()
      })

      cy.get('[data-test="update-news-modal"]').within(() => {
        // Create
        cy.get('[data-test="submitButton"]').click()
      })
      // Check is all attached files is visible and clickable
      getNews(newsToTeacherAndStudent).should('be.exist').within(() => {
        cy.get('[data-test="fileIcon"]').should('be.visible')
      })

      // Check if students see this annoucement
      cy.login(STUDENT, dashboardURL)
      cy.clock().invoke('setSystemTime', Cypress.dayjs(newsToTeacherAndStudent.dateToRead, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
      getNews(newsToTeacherAndStudent).should('be.exist').click()
      cy.get('.news-details-modal').within(() => {
        // Open file modal
        cy.get('.attached-files').within(() => {
          // Check if all files is visible
          cy.contains('.attached-file', newsToTeacherAndStudent.personalDocument).should('be.visible')
        })
      })
    })

    it('Dashboard_Announcements_CreateAnnouncementByDelegateCheckHeadmasterVisibility', function () {
      setAnnouncementDocumentWithContent()
      const newsToStudent = {
        recipient: 'Elèves de la volée 10',
        title: 'Nouvelle annonce',
        content: 'Ceci est le contenu de la nouvelle annonce',
        personalDocument: 'Note avec des caractères spéciaux_.html',
        dateToCreate: '2023/12/07',
        dateToRead: '2023/12/07'
      }
      // Create announcement with the headmaster for students
      cy.login(TEACHER, dashboardURL)
      cy.clock().invoke('setSystemTime', Cypress.dayjs(newsToStudent.dateToCreate, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
      // Open create modal
      cy.get('[data-test="buttonCreateAnnoucement"]').click()
      // Set all informations
      cy.get('[data-test="update-news-modal"]').within(() => {
        cy.get('.base-tags-input').click()
        cy.get('.suggestion-list').contains('li', newsToStudent.recipient).click()
        cy.get('.labelled').type(newsToStudent.title)
        cy.get('.ck-editor')
        cy.type_ckeditor(newsToStudent.content)
        // Open FilePicker modal
        cy.get('.select-files-buttons').within(() => {
          cy.get('button').eq(0).click()
        })
      })
      // Add file from personal document
      cy.get('[data-test="file-picker-modal"]').within(() => {
        cy.contains('.file', newsToStudent.personalDocument).click()
        cy.get('[data-test="submitButton"]').click()
      })

      cy.get('[data-test="update-news-modal"]').within(() => {
        // Create
        cy.get('[data-test="submitButton"]').click()
      })
      // Check is all attached files is visible and clickable
      getNews(newsToStudent).should('be.exist').within(() => {
        cy.get('[data-test="fileIcon"]').should('be.visible')
      })

      // Check if redaction delegate see this annoucement
      cy.login(HEADMASTER, dashboardURL)
      cy.clock().invoke('setSystemTime', Cypress.dayjs(newsToStudent.dateToRead, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
      getNews(newsToStudent).should('be.exist').click()
      cy.get('.news-details-modal').within(() => {
        // Open file modal
        cy.get('.attached-files').within(() => {
          // Check if all files is visible
          cy.contains('.attached-file', newsToStudent.personalDocument).should('be.visible')
        })
      })
    })

    it('Dashboard_Announcements_CreateAnnouncementAllAnnouncementButtonCreate', function () {
      // Login
      cy.login(HEADMASTER, dashboardURL)
      // Click on all announcements buttton
      cy.get('[data-test="announcement-widget"]').within(() => {
        cy.contains('button', 'Voir toutes les annonces').click()
      })
      // CLick on button +
      cy.get('.create-button').click()
      // Check if modal is visible
      cy.get('[data-test="update-news-modal"]').should('be.visible')
    })

    it('Dashboard_Announcements_CreateAnnouncementDisplayWarningMessageSetInformations', function () {
      const NewNews = this.dashboardData.NewNews

      // Login
      cy.login(HEADMASTER, dashboardURL)

      // Open create modal
      cy.get('[data-test="buttonCreateAnnoucement"]').click()
      // Set content
      cy.get('[data-test="update-news-modal"]').within(() => {
        cy.get('.ck-editor')
        cy.type_ckeditor(NewNews.content)
        cy.get('[data-test="closeModal"]').click()
      })
      // Check if warning modal is visible
      cy.get('[data-test="warning-modal"]').should('be.visible')
      // Click on confirm button
      cy.get('[data-test="confirmButton"]').click()
      // Check if warning modal is not visible
      cy.get('[data-test="warning-modal"]').should('not.exist')
      // Check if modal create message is not visible
      cy.get('[data-test="update-news-modal"]').should('not.exist')

      // Open create modal
      cy.get('[data-test="buttonCreateAnnoucement"]').click()
      // Set recipient
      cy.get('[data-test="update-news-modal"]').within(() => {
        cy.get('.base-tags-input').click()
        cy.get('.suggestion-list').contains('li', NewNews.recipient).click()
        cy.get('[data-test="closeModal"]').click()
      })
      // Check if warning modal is visible
      cy.get('[data-test="warning-modal"]').should('be.visible')
      // Click on confirm button
      cy.get('[data-test="confirmButton"]').click()

      // Open create modal
      cy.get('[data-test="buttonCreateAnnoucement"]').click()
      // Set title
      cy.get('[data-test="update-news-modal"]').within(() => {
        cy.get('.labelled').type(NewNews.title)
        cy.get('[data-test="closeModal"]').click()
      })
      // Check if warning modal is visible
      cy.get('[data-test="warning-modal"]').should('be.visible')
      // Click on confirm button
      cy.get('[data-test="confirmButton"]').click()
    })

    it('Dashboard_Announcements_CreateAnnouncementDisplayWarningMessageNotSetInformations', function () {
      // Login
      cy.login(HEADMASTER, dashboardURL)

      // Open create modal
      cy.get('[data-test="buttonCreateAnnoucement"]').click()
      // Not set informations
      cy.get('[data-test="update-news-modal"]').within(() => {
        cy.get('[data-test="closeModal"]').click()
      })
      // Check if warning modal is not visible
      cy.get('[data-test="warning-modal"]').should('not.exist')
      // Check if modal create message is not visible
      cy.get('[data-test="update-news-modal"]').should('not.exist')
    })

    it('Dashboard_Announcements_UpdateAnnouncementMouseoverWithAllTypesOfAttachedFiles', function () {
      const existingNews = this.dashboardData.existingNews
      const lastNews = existingNews[0]
      const newsToEdit = this.dashboardData.newsToEdit
      setAnnouncementDocumentWithContent()

      // Login with student to chech if he don't see the announcement
      cy.login(STUDENT, dashboardURL)
      cy.clock().invoke('setSystemTime', Cypress.dayjs(lastNews.dateBeforeRelease, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
      getNews(lastNews).should('not.exist')

      // Login to update announcement
      cy.login(HEADMASTER, dashboardURL)
      cy.clock().invoke('setSystemTime', Cypress.dayjs(lastNews.dateBeforeRelease, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
      // Check if file icon is visible
      getNews(lastNews).within(() => {
        cy.get('[data-test="fileIcon"]').should('be.exist')
      })
      // Mouse over on the announcement
      getNews(lastNews).trigger('mouseover').within(() => {
        cy.get('[data-test="buttonEditAnnouncement"]').click({ force: true })
      })
      cy.intercept('GET', '/lfr/api/jsonws/news.news/get-news-details**').as('allEvents')
      cy.wait('@allEvents')
      // Set new informations
      cy.get('[data-test="update-news-modal"]').within(() => {
        cy.get('.base-tags-input').click()
        // Add all students in recipients
        cy.get('.suggestion-list').contains('li', newsToEdit.recipient).click()
        cy.get('.labelled').clear()
        cy.get('.labelled').type(newsToEdit.title)
        cy.get('.ck-editor')
        cy.type_ckeditor(newsToEdit.content)
        cy.get('.file-list').within(() => {
          // Delete first file
          cy.contains('.attached-file', newsToEdit.currentFile1).within(() => {
            cy.get('.remove-button').click()
          })
        })
      })
      // Open FilePicker modal
      cy.get('.select-files-buttons').within(() => {
        cy.get('button').eq(0).click()
      })
      // Add new file from personal document
      cy.get('[data-test="file-picker-modal"]').within(() => {
        cy.contains('.file', newsToEdit.newFile).click()
        cy.get('[data-test="submitButton"]').click()
      })
      cy.get('[data-test="update-news-modal"]').within(() => {
        // Submit modifications
        cy.get('[data-test="submitButton"]').click()
      })

      // Check if the modification exist
      getNews(newsToEdit).should('be.exist')
      cy.get('[data-test="announcement-widget"]').within(() => {
        cy.contains('button', 'Voir toutes les annonces').click()
      })
      // // to load page
      cy.get('.detailed-news').should('be.visible')
      cy.get('.announcements-list').contains('.announcement', newsToEdit.title).should('be.exist').click()
      // Check the content
      getNewsDetail(newsToEdit).should('be.exist').within(() => {
        // Check if file is deleted
        cy.get('.attached-files').within(() => {
          cy.contains('.attached-file', newsToEdit.currentFile2).should('be.visible')
          cy.contains('.attached-file', newsToEdit.newFile).should('be.visible')
        })
      })

      // Login with a student to see if now he can see the announcement
      cy.login(STUDENT, dashboardURL)
      getNews(newsToEdit).should('be.exist')
    })

    it('Dashboard_Announcements_UpdateAnnouncementClickOnNews', function () {
      const existingNews = this.dashboardData.existingNews
      const lastNews = existingNews[existingNews.length - 1]

      // Login
      cy.login(HEADMASTER, dashboardURL)

      // Open last news detail
      getNews(lastNews).click()
      // Click on update button
      cy.get('[data-test="updateButton"]').click()
      // Check if modal is visible
      cy.get('[data-test="update-news-modal"]').should('be.visible')
    })

    it('Dashboard_Announcements_UpdateAnnouncementAllNewsUpdateButton', function () {
      const existingNews = this.dashboardData.existingNews
      const lastNews = existingNews[existingNews.length - 1]

      // Login
      cy.login(HEADMASTER, dashboardURL)

      // Click to see all news
      cy.get('[data-test="announcement-widget"]').within(() => {
        cy.contains('button', 'Voir toutes les annonces').click()
      })
      // Click on last news
      cy.get('.announcements-list').contains('.announcement', lastNews.title).click()
      // Click on update button
      cy.get('[data-test="updateButton"]').click()
      // Check if modal is visible
      cy.get('[data-test="update-news-modal"]').should('be.visible')
    })

    it('Dashboard_Announcements_UpdateAnnouncementMarkAsUnreadForAll', function () {
      const existingNews = this.dashboardData.existingNews
      const newsToEdit = this.dashboardData.newsToEdit
      const furturNews = this.dashboardData.futurNews

      // Login with a student
      cy.login(MULTI_STUDENT1, dashboardURL)
      cy.clock().invoke('setSystemTime', Cypress.dayjs(furturNews.dateBeforeRelease, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
      // Check if news is read
      getNews(existingNews[1]).within(() => {
        cy.get('.pellet').should('not.exist')
      })

      // Update news
      cy.login(HEADMASTER, dashboardURL)
      getNews(existingNews[1]).click()
      cy.get('[data-test="updateButton"]').click()
      // Set new informations
      cy.get('[data-test="update-news-modal"]').within(() => {
        cy.get('.base-tags-input').click()
        // Add all students in recipients
        cy.get('.suggestion-list').contains('li', newsToEdit.recipient).click()
        cy.get('.labelled').clear()
        cy.get('.labelled').type(newsToEdit.title)
        cy.get('.ck-editor')
        cy.type_ckeditor(newsToEdit.content)
        // Toogle markAsUnreadForAll button
        cy.get('[data-test="markAsUnreadForAll"]').first().click()
        // Submit
        cy.get('[data-test="submitButton"]').click()
      })

      // Login with a student
      cy.login(MULTI_STUDENT1, dashboardURL)
      // Check if new is mark as unRead
      getNews(newsToEdit).within(() => {
        cy.get('.pellet').should('be.visible')
      })
    })

    it('Dashboard_Announcements_UpdateAnnouncementDisplayWarningMessageSetInformations', function () {
      const existingNews = this.dashboardData.existingNews
      const lastNews = existingNews[existingNews.length - 1]
      const newsToEdit = this.dashboardData.newsToEdit

      // Login
      cy.login(HEADMASTER, dashboardURL)

      // Mouse over on the announcement
      getNews(lastNews).trigger('mouseover').within(() => {
        cy.get('[data-test="buttonEditAnnouncement"]').click({ force: true })
      })
      cy.intercept('GET', '/lfr/api/jsonws/news.news/get-news-details**').as('newsDetail')
      cy.wait('@newsDetail')
      // Set content
      cy.get('[data-test="update-news-modal"]').within(() => {
        cy.get('.ck-editor')
        cy.type_ckeditor(newsToEdit.content)
        cy.get('[data-test="closeModal"]').click()
      })
      // Check if warning modal is visible
      cy.get('[data-test="warning-modal"]').should('be.visible')
      // Click on confirm button
      cy.get('[data-test="confirmButton"]').click()
      // Check if warning modal is not visible
      cy.get('[data-test="warning-modal"]').should('not.exist')
      // Check if modal create message is not visible
      cy.get('[data-test="update-news-modal"]').should('not.exist')

      // Mouse over on the announcement
      getNews(lastNews).trigger('mouseover').within(() => {
        cy.get('[data-test="buttonEditAnnouncement"]').click({ force: true })
      })
      cy.intercept('GET', '/lfr/api/jsonws/news.news/get-news-details**').as('newsDetail')
      cy.wait('@newsDetail')
      // Set recipient
      cy.get('[data-test="update-news-modal"]').within(() => {
        cy.get('.base-tags-input').click()
        cy.get('.suggestion-list').contains('li', newsToEdit.recipient).click()
        cy.get('[data-test="closeModal"]').click()
      })
      // Check if warning modal is visible
      cy.get('[data-test="warning-modal"]').should('be.visible')
      // Click on confirm button
      cy.get('[data-test="confirmButton"]').click()

      // Mouse over on the announcement
      getNews(lastNews).trigger('mouseover').within(() => {
        cy.get('[data-test="buttonEditAnnouncement"]').click({ force: true })
      })
      cy.intercept('GET', '/lfr/api/jsonws/news.news/get-news-details**').as('newsDetail')
      cy.wait('@newsDetail')
      // Set title
      cy.get('[data-test="update-news-modal"]').within(() => {
        cy.get('.labelled').type(newsToEdit.title)
        cy.get('[data-test="closeModal"]').click()
      })
      // Check if warning modal is visible
      cy.get('[data-test="warning-modal"]').should('be.visible')
      // Click on confirm button
      cy.get('[data-test="confirmButton"]').click()
    })

    it('Dashboard_Announcements_UpdateAnnouncementDisplayWarningMessageNotSetInformations', function () {
      const existingNews = this.dashboardData.existingNews
      const lastNews = existingNews[existingNews.length - 1]
      // Login
      cy.login(HEADMASTER, dashboardURL)

      // Mouse over on the announcement
      getNews(lastNews).trigger('mouseover').within(() => {
        cy.get('[data-test="buttonEditAnnouncement"]').click({ force: true })
      })
      // Not set informations
      cy.get('[data-test="update-news-modal"]').within(() => {
        cy.get('[data-test="closeModal"]').click()
      })
      // Check if warning modal is not visible
      cy.get('[data-test="warning-modal"]').should('not.exist')
      // Check if modal create message is not visible
      cy.get('[data-test="update-news-modal"]').should('not.exist')
    })

    it('Dashboard_Announcements_DeleteAnnouncementMouseover', function () {
      const existingNews = this.dashboardData.existingNews
      const lastNews = existingNews[2]

      cy.login(HEADMASTER, dashboardURL)

      // Mouseover and click on delete button
      getNews(lastNews).trigger('mouseover').within(() => {
        cy.get('[data-test="buttonDeleteAnnouncement"]').click({ force: true })
      })
      // Confirm the delete
      cy.get('[data-test="confirmButton"]').click()

      // Check if news is delete
      getNews(lastNews).should('not.exist')

      // Check if for the parents the news is delete
      cy.login(PARENT, dashboardURL)
      getNews(lastNews).should('not.exist')
    })

    it('Dashboard_Announcements_DeleteAnnouncementClickOnNews', function () {
      const existingNews = this.dashboardData.existingNews
      const lastNews = existingNews[2]

      // Login
      cy.login(HEADMASTER, dashboardURL)

      // Click on last news
      getNews(lastNews).click()
      // Click on delete button
      cy.get('[data-test="deleteButton"]').click()
      // Check if in the warning modal content there is the news title
      cy.get('[data-test="warning-modal"]').should('be.visible').within(() => {
        cy.get('.context-message').contains(lastNews.title)
      })
    })

    it('Dashboard_Announcements_DeleteAnnouncementAllNewsDeleteButton', function () {
      const existingNews = this.dashboardData.existingNews
      const furturNews = this.dashboardData.futurNews
      const lastNews = existingNews[2]

      cy.login(HEADMASTER, dashboardURL)
      cy.clock().invoke('setSystemTime', Cypress.dayjs(furturNews.dateBeforeRelease, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
      getNews(lastNews).should('be.visible')
      cy.get('[data-test="announcement-widget"]').within(() => {
        cy.contains('button', 'Voir toutes les annonces').click()
      })
      // to load page
      cy.get('.detailed-news').should('be.visible')
      // Click on last news
      cy.get('.announcements-list').contains('.announcement', lastNews.title).click()
      // Click on delete button
      cy.get('[data-test="deleteButton"]').click()
      // Check if in the warning modal content there is the news title
      cy.get('[data-test="warning-modal"]').should('be.visible').within(() => {
        cy.get('.context-message').contains(lastNews.title)
      })
    })
  })
  context('mobile', function () {
    beforeEach(() => {
      cy.viewport('iphone-5')
    })
    it('Dashboard_Announcements_CreateAnnouncementButtonsVisibility', function () {
      cy.login(HEADMASTER, dashboardURL)

      cy.get('[data-test="announcement-widget"]').within(() => {
        cy.get('[data-test="buttonCreateAnnoucement"]').should('be.visible')
        cy.contains('button', 'Voir toutes les annonces').click()
      })
      cy.get('.create-button').should('be.visible')
    })

    it('Dashboard_Announcements_DisplayThreePointsOptionsPanelMobile', function () {
      // Login
      cy.login(HEADMASTER, dashboardURL)

      cy.get('[data-test="announcement-widget"]').within(() => {
        cy.get('.announcement').eq(1).within(() => {
          cy.get('.options-button').click()
        })
      })
      cy.get('[data-test="update"]').should('be.visible')
      cy.get('[data-test="delete"]').should('be.visible')
    })

    it('Dashboard_Announcements_DisplayOptionsClickOnAnnouncements', function () {
      // Login
      cy.login(HEADMASTER, dashboardURL)

      cy.get('.announcement').eq(1).click()
      cy.get('[data-test="updateButton"]').should('be.visible')
      cy.get('[data-test="deleteButton"]').should('be.visible')
    })

    it('Dashboard_Announcements_DisplayOptionsDetailPanelAllAnnouncements', function () {
      // Login
      cy.login(HEADMASTER, dashboardURL)

      // Click to see all events
      cy.get('[data-test="announcement-widget"]').within(() => {
        cy.contains('button', 'Voir toutes les annonces').click()
        cy.intercept('GET', '**/get-school-news**').as('allNews')
        cy.wait('@allNews')
      })
      cy.get('.announcement').eq(1).click()
      cy.get('[data-test="updateButton"]').should('be.visible')
      cy.get('[data-test="deleteButton"]').should('be.visible')
    })
  })
})
