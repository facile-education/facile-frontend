import { dashboardURL } from '../../support/constants/urls'
import { HEADMASTER, SCHOOL_ADMIN, STUDENT, TEACHER, TEACHER2 } from '../../support/constants/users'
import { getNews, getNewsDetail } from '../../support/utils/dashboard'

describe('Dashboard_Events', () => {
  beforeEach(() => {
    cy.loadTables('dashboard/dashboard_tables_news.sql')
    cy.fixture('dashboard.json').as('dashboardData')
  })
  it('Dashboard_Events_DisplayAllEvents', function () {
    const existingNews = this.dashboardData.existingNews
    cy.login(HEADMASTER, dashboardURL)

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

  it('Dashboard_Events_CreateEvent', function () {
    const NewAnnouncement = this.dashboardData.NewAnnouncement

    cy.login(SCHOOL_ADMIN, dashboardURL)
    cy.get('[data-test="buttonCreateAnnouce"]').click()
    cy.get('[data-test="update-news-modal"]').should('be.visible')

    cy.login(TEACHER, dashboardURL)
    cy.get('[data-test="buttonCreateAnnouce"]').click()
    cy.get('[data-test="update-news-modal"]').should('be.visible')

    cy.login(HEADMASTER, dashboardURL)
    cy.get('[data-test="buttonCreateAnnouce"]').click()
    cy.get('[data-test="update-news-modal"]').within(() => {
      cy.get('.base-tags-input').click()
      cy.get('.suggestion-list > :nth-child(2)').contains('li', NewAnnouncement.recipient).click()
      cy.get('.labelled').type(NewAnnouncement.title)
      cy.get('.ck-editor')
      cy.type_ckeditor(NewAnnouncement.content)
      cy.get('[data-test="submitButton"]').click()
    })
    cy.login(STUDENT, dashboardURL)
    getNews(NewAnnouncement).should('not.exist')

    cy.login(TEACHER2, dashboardURL)
    getNews(NewAnnouncement).should('be.exist')
  })
  it('Dashboard_Events_CreateEvent_allEventButton', function () {
    cy.login(HEADMASTER, dashboardURL)
    cy.get('[data-test="announcement-widget"]').within(() => {
      cy.contains('button', 'Voir toutes les annonces').click()
    })
    cy.get('.header > .theme-background-color').click()
    cy.get('[data-test="update-news-modal"]').should('be.visible')
  })
})
