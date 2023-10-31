import { dashboardURL } from '../../support/constants/urls'
import { HEADMASTER, PARENT, SCHOOL_ADMIN, STUDENT, TEACHER, TEACHER2 } from '../../support/constants/users'
import { getEventDetail, getNews, getNewsDetail } from '../../support/utils/dashboard'

describe('Dashboard_Events', () => {
  beforeEach(() => {
    cy.loadTables('dashboard/dashboard_tables_news.sql')
    cy.fixture('dashboard.json').as('dashboardData')
  })
  it('Dashboard_Events_DisplayAllEvents', function () {
    const existingEvents = this.dashboardData.existingEvents
    // Login
    cy.login(HEADMASTER, dashboardURL)

    // Click on all events button
    cy.get('[data-test="diary-widget"]').within(() => {
      cy.contains('button', 'Voir tous les événements').click()
    })
    // Check if all events are visible
    for (let i = 0; i < existingEvents.length; i++) {
      cy.get('.diary-event').eq(i).click()
      getEventDetail(existingEvents[i]).should('be.exist')
    }
  })

  it('Dashboard_Events_CreateEvent', function () {
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

  it('Dashboard_Events_CreateEvent_allAnnouncement', function () {
    // Login
    cy.login(HEADMASTER, dashboardURL)
    // Click on all event buttton
    cy.get('[data-test="announcement-widget"]').within(() => {
      cy.contains('button', 'Voir toutes les annonces').click()
    })
    // CLick on button +
    cy.get('.create-button').click()
    // Check if modal is visible
    cy.get('[data-test="update-news-modal"]').should('be.visible')
  })

  it('Dashboard_Events_UpdateEvent_mouseover', function () {
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

  it('Dashboard_Events_UpdateEvent_clickOnNews', function () {
    const existingNews = this.dashboardData.existingNews
    const lastNews = existingNews[existingNews.length - 1]
    cy.login(HEADMASTER, dashboardURL)

    getNews(lastNews).click()
    cy.get('[data-test="updateButton"]').click()
    cy.get('[data-test="update-news-modal"]').should('be.visible')
  })

  it('Dashboard_Events_UpdateEvent_allNews', function () {
    const existingNews = this.dashboardData.existingNews
    const lastNews = existingNews[existingNews.length - 1]
    cy.login(HEADMASTER, dashboardURL)

    cy.get('[data-test="announcement-widget"]').within(() => {
      cy.contains('button', 'Voir toutes les annonces').click()
    })
    cy.get('.event-list').contains('.announcement', lastNews.title).click()
    cy.get('[data-test="updateButton"]').click()
    cy.get('[data-test="update-news-modal"]').should('be.visible')
  })

  it('Dashboard_Events_DeleteEvent_mouseover', function () {
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

  it('Dashboard_Events_DeleteEvent_clickOnNews', function () {
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

  it('Dashboard_Events_DeleteEvent_allNews', function () {
    const existingNews = this.dashboardData.existingNews
    const lastNews = existingNews[existingNews.length - 1]

    cy.login(HEADMASTER, dashboardURL)

    cy.get('[data-test="announcement-widget"]').within(() => {
      cy.contains('button', 'Voir toutes les annonces').click()
    })
    cy.get('.event-list').contains('.announcement', lastNews.title).click()
    cy.get('[data-test="deleteButton"]').click()
    // Check if in the warning modal content there is the news title
    cy.get('[data-test="warning-modal"]').should('be.visible').within(() => {
      cy.get('.context-message').contains(lastNews.title)
    })
  })
})
