import { dashboardURL } from '../../support/constants/urls'
import { HEADMASTER, SCHOOL_ADMIN, STUDENT, TEACHER, TEACHER2 } from '../../support/constants/users'
import { getEvent, getEventDetail } from '../../support/utils/dashboard'

describe('Dashboard_Events', () => {
  beforeEach(() => {
    cy.loadTables('dashboard/dashboard_tables_events.sql')
    cy.fixture('dashboard.json').as('dashboardData').then(data => {
      cy.clock(Cypress.dayjs(data.now, 'YYYY/MM/DD HH:mm').toDate().getTime())
    })
  })
  it('Dashboard_Events_DisplayAllEvents', function () {
    const existingEvents = this.dashboardData.existingEvents
    // Login
    cy.login(HEADMASTER, dashboardURL)
    cy.clock().invoke('setSystemTime', Cypress.dayjs(existingEvents[0].startDate, 'YYYY/MM/DD HH:mm').toDate().getTime()) // To put after login to make it works
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
    const NewEvent = this.dashboardData.NewEvent

    // Check if an admin can create an event
    cy.login(SCHOOL_ADMIN, dashboardURL)
    cy.get('[data-test="buttonCreateEvent"]').click()
    cy.get('[data-test="update-diary-event-modal"]').should('be.visible')

    // Check if a delegate can create an event
    cy.login(TEACHER, dashboardURL)
    cy.get('[data-test="buttonCreateEvent"]').click()
    cy.get('[data-test="update-diary-event-modal"]').should('be.visible')

    // Create event with the headmaster for the teachers
    cy.login(HEADMASTER, dashboardURL)
    // Open create modal
    cy.get('[data-test="buttonCreateEvent"]').click()
    // Set all informations
    cy.get('[data-test="update-diary-event-modal"]').within(() => {
      cy.get('.base-tags-input').click()
      cy.get('.suggestion-list').contains('li', NewEvent.recipient).click()
      cy.get('.group > [data-test="titleInputEvent"]').type(NewEvent.title)
      cy.get('.group > [data-test="locationInputEvent"]').type(NewEvent.location)
      cy.get('.ck-editor')
      cy.type_ckeditor(NewEvent.content)
      // Create
      cy.get('[data-test="submitButton"]').click()
    })

    // Check if a student don't see the event
    cy.login(STUDENT, dashboardURL)
    getEvent(NewEvent).should('not.exist')

    // Check if a teacher see the event
    cy.login(TEACHER2, dashboardURL)
    getEvent(NewEvent).should('be.exist')
  })

  it('Dashboard_Events_CreateEvent_allEvent', function () {
    // Login
    cy.login(HEADMASTER, dashboardURL)
    // Click on all event buttton
    cy.get('[data-test="diary-widget"]').within(() => {
      cy.contains('button', 'Voir tous les événements').click()
    })
    // CLick on button +
    cy.get('.create-button').click()
    // Check if modal is visible
    cy.get('[data-test="update-diary-event-modal"]').should('be.visible')
  })
})
