import { dashboardURL } from '../../support/constants/urls'
import { HEADMASTER, PARENT, SCHOOL_ADMIN, STUDENT, TEACHER, TEACHER2 } from '../../support/constants/users'
import { getNews, getNewsDetail } from '../../support/utils/dashboard'

describe('Dashboard_Announcements', () => {
  beforeEach(() => {
    cy.loadTables('dashboard/dashboard_tables_news.sql')
    cy.fixture('dashboard.json').as('dashboardData')
  })

  it('Dashboard_Announcement_DisplayAnnouncements_Read_UnRead', function () {
    const existingNews = this.dashboardData.existingNews
    // Login
    cy.login(STUDENT, dashboardURL)
    // Check if pellet is visible
    cy.get('[data-test="announcement-widget"]').within(() => {
      cy.get('header').contains('.pellet', 1).should('be.visible')
    })
    // Click on event
    getNews(existingNews[0]).click()
    cy.get('[data-test="closeModal"]').click()
    // Check if pellet is not visible
    cy.get('[data-test="announcement-widget"]').within(() => {
      cy.get('header').contains('.pellet', 1).should('not.exist')
    })
    // Click on read onlyButton
    cy.get('[data-test="ReadOnlyAnnouncementButton"]').click()
    // Check if event is not visible
    getNews(existingNews[0]).should('not.exist')
  })

  it('Dashboard_Annoucements_DisplayAnnouncement_Check_Content', function () {
    const existingNews = this.dashboardData.existingNews
    const lastNews = existingNews[existingNews.length - 1]

    cy.login(HEADMASTER, dashboardURL)
    getNews(lastNews).click()
    cy.get('[data-test="news-details-modal"]').within(() => {
      // Check the title
      cy.get('.header').should('contain', lastNews.title)
      // Chekc the recipient
      cy.get('.lonely-population').should('contain', lastNews.recipient)
      // Check the publication info
      cy.get('.publication').should('contain', `${HEADMASTER.firstName} ${HEADMASTER.lastName}`)
      cy.get('.publication').should('contain', lastNews.publicationDate)
      // Check the content
      cy.get('.detailed-news > .content').should('contain', lastNews.content)
    })
  })

  it('Dashboard_Announcements_DisplayAnnouncement_Check_ReadRecipient_Info', function () {
    const existingNews = this.dashboardData.existingNews
    const lastNews = existingNews[existingNews.length - 1]

    // Login with author
    cy.login(HEADMASTER, dashboardURL)
    getNews(lastNews).click()
    cy.get('[data-test="news-details-modal"]').within(() => {
      // No one read this event
      cy.get('.read-infos').should('contain', '0 destinataire')
    })
    // Login recipient
    cy.login(PARENT, dashboardURL)
    // Student read this event
    getNews(lastNews).click()

    // Login with author
    cy.login(HEADMASTER, dashboardURL)
    getNews(lastNews).click()
    cy.get('[data-test="news-details-modal"]').within(() => {
      // No one read this event
      cy.get('.read-infos').should('contain', '1 destinataire')
      // Open recipients infos
      cy.get('.read-infos > button').click()
      cy.get('.population').click()
      cy.get('.read-info-user').contains(`${PARENT.lastName} ${PARENT.firstName}`).should('not.contain', 'Non lu')
    })
  })

  it('Dashboard_Announcements_DisplayAllAnnouncements', function () {
    const existingNews = this.dashboardData.existingNews
    // Login
    cy.login(HEADMASTER, dashboardURL)

    // Click on all announcements button
    cy.get('[data-test="announcement-widget"]').within(() => {
      cy.contains('button', 'Voir toutes les annonces').click()
    })
    // Check if all news are visible
    for (let i = existingNews.length - 1; i >= 0; i--) {
      console.log(i)
      if (i === existingNews.length - 1) {
        cy.get('.announcements-list').contains('.announcement', existingNews[i].title).should('be.exist')
        getNewsDetail(existingNews[i]).should('be.exist')
      } else {
        cy.get('.announcements-list').contains('.announcement', existingNews[i].title).should('be.exist').click()
        getNewsDetail(existingNews[i]).should('be.exist')
      }
    }
  })

  it('Dashboard_Announcements_CreateAnnouncement', function () {
    const NewAnnouncement = this.dashboardData.NewAnnouncement

    // Check if an admin can create an annoucement
    cy.login(SCHOOL_ADMIN, dashboardURL)
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
      cy.get('.suggestion-list').contains('li', NewAnnouncement.recipient).click()
      cy.get('.labelled').type(NewAnnouncement.title)
      cy.get('.ck-editor')
      cy.type_ckeditor(NewAnnouncement.content)
      // Create
      cy.get('[data-test="submitButton"]').click()
    })

    // Check if a student don't see the annoucement
    cy.login(STUDENT, dashboardURL)
    getNews(NewAnnouncement).should('not.exist')

    // Check if a teacher see the annoucement
    cy.login(TEACHER2, dashboardURL)
    getNews(NewAnnouncement).should('be.exist')
  })

  it('Dashboard_Announcements_CreateAnnouncement_allAnnouncement', function () {
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

  it('Dashboard_Announcements_UpdateAnnouncement_mouseover', function () {
    const existingNews = this.dashboardData.existingNews
    const lastNews = existingNews[existingNews.length - 1]
    const newsToEdit = this.dashboardData.newsToEdit

    // Login with student to chech if he don't see the announcement
    cy.login(STUDENT, dashboardURL)
    getNews(lastNews).should('not.exist')

    // Login to update announcement
    cy.login(HEADMASTER, dashboardURL)

    // Mouse over on the announcement
    getNews(lastNews).trigger('mouseover').within(() => {
      cy.get('[data-test="buttonEditAnnouncement"]').click()
    })
    // Set new informations
    cy.get('[data-test="update-news-modal"]').within(() => {
      cy.get('.base-tags-input').click()
      // Add all students in recipients
      cy.get('.suggestion-list').contains('li', newsToEdit.recipient).click()
      cy.get('.labelled').clear()
      cy.get('.labelled').type(newsToEdit.title)
      cy.get('.ck-editor')
      cy.type_ckeditor(newsToEdit.content)
      cy.get('[data-test="submitButton"]').click()
    })
    // Check if the modification exist
    getNews(newsToEdit).should('be.exist')
    cy.get('[data-test="announcement-widget"]').within(() => {
      cy.contains('button', 'Voir toutes les annonces').click()
    })
    // Check the content
    getNewsDetail(newsToEdit).should('be.exist')

    // Login with a student to see if now he can see the announcement
    cy.login(STUDENT, dashboardURL)
    getNews(newsToEdit).should('be.exist')
  })

  it('Dashboard_Announcements_UpdateAnnouncement_clickOnNews', function () {
    const existingNews = this.dashboardData.existingNews
    const lastNews = existingNews[existingNews.length - 1]
    cy.login(HEADMASTER, dashboardURL)

    getNews(lastNews).click()
    cy.get('[data-test="updateButton"]').click()
    cy.get('[data-test="update-news-modal"]').should('be.visible')
  })

  it('Dashboard_Announcements_UpdateAnnouncement_allNews', function () {
    const existingNews = this.dashboardData.existingNews
    const lastNews = existingNews[existingNews.length - 1]
    cy.login(HEADMASTER, dashboardURL)

    cy.get('[data-test="announcement-widget"]').within(() => {
      cy.contains('button', 'Voir toutes les annonces').click()
    })
    cy.get('.announcements-list').contains('.announcement', lastNews.title).click()
    cy.get('[data-test="updateButton"]').click()
    cy.get('[data-test="update-news-modal"]').should('be.visible')
  })

  it('Dashboard_Announcements_DeleteAnnouncement_mouseover', function () {
    const existingNews = this.dashboardData.existingNews
    const lastNews = existingNews[existingNews.length - 1]

    cy.login(HEADMASTER, dashboardURL)

    // Mouseover and click on delete button
    getNews(lastNews).trigger('mouseover').within(() => {
      cy.get('[data-test="buttonDeleteAnnouncement"]').click()
    })
    // Confirm the delete
    cy.get('[data-test="confirmButton"]').click()

    // Check if news is delete
    getNews(lastNews).should('not.exist')

    // Check if for the parents the news is delete
    cy.login(PARENT, dashboardURL)
    getNews(lastNews).should('not.exist')
  })

  it('Dashboard_Announcements_DeleteAnnouncement_clickOnNews', function () {
    const existingNews = this.dashboardData.existingNews
    const lastNews = existingNews[existingNews.length - 1]

    cy.login(HEADMASTER, dashboardURL)

    getNews(lastNews).click()
    cy.get('[data-test="deleteButton"]').click()
    // Check if in the warning modal content there is the news title
    cy.get('[data-test="warning-modal"]').should('be.visible').within(() => {
      cy.get('.context-message').contains(lastNews.title)
    })
  })

  it('Dashboard_Announcements_DeleteAnnouncement_allNews', function () {
    const existingNews = this.dashboardData.existingNews
    const lastNews = existingNews[existingNews.length - 1]

    cy.login(HEADMASTER, dashboardURL)

    cy.get('[data-test="announcement-widget"]').within(() => {
      cy.contains('button', 'Voir toutes les annonces').click()
    })
    cy.get('.announcements-list').contains('.announcement', lastNews.title).click()
    cy.get('[data-test="deleteButton"]').click()
    // Check if in the warning modal content there is the news title
    cy.get('[data-test="warning-modal"]').should('be.visible').within(() => {
      cy.get('.context-message').contains(lastNews.title)
    })
  })
})
