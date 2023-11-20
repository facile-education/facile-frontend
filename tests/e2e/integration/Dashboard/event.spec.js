import { dashboardURL } from '../../support/constants/urls'
import { HEADMASTER, PARENT, SCHOOL_ADMIN, STUDENT, TEACHER, TEACHER2 } from '../../support/constants/users'
import { getEvent, getEventDetail } from '../../support/utils/dashboard'

describe('Dashboard_Events', () => {
  beforeEach(() => {
    cy.loadTables('dashboard/dashboard_tables_events.sql')
    cy.fixture('dashboard.json').as('dashboardData').then(data => {
      cy.clock(Cypress.dayjs(data.existingEvents[0].endDate, 'YYYY/MM/DD HH:mm').toDate().getTime())
    })
  })
  context('desktop', function () {
    it('Dashboard_Events_DisplayEventsReadUnRead', function () {
      const existingEvents = this.dashboardData.existingEvents
      // Login
      cy.login(TEACHER2, dashboardURL)
      // Check if pellet is visible
      cy.get('[data-test="diary-widget"]').within(() => {
        cy.get('header').contains('.pellet', 1).should('be.visible')
      })
      // Click on event
      getEvent(existingEvents[0]).click()
      cy.get('[data-test="closeModal"]').click()
      // Check if pellet is not visible
      cy.get('[data-test="diary-widget"]').within(() => {
        cy.get('header').contains('.pellet', 1).should('not.exist')
      })
      // Click on read onlyButton
      cy.get('[data-test="ReadOnlyEventButton"]').click()
      // Check if event is not visible
      getEvent(existingEvents[0]).should('not.exist')
    })

    it('Dashboard_Events_DisplayEvent_Check_Content', function () {
      const existingEvents = this.dashboardData.existingEvents
      const lastEvent = existingEvents[0]

      cy.login(HEADMASTER, dashboardURL)
      // Open last event detail
      getEvent(lastEvent).click()
      cy.get('[data-test="diary-event-details-modal"]').within(() => {
        // Check the title
        cy.get('.header').should('contain', lastEvent.title)
        // Chekc the recipient
        cy.get('.lonely-population').should('contain', lastEvent.recipient)
        // Check de location
        cy.get('.where-and-when').should('contain', lastEvent.location)
        // Check de duration
        cy.get('.where-and-when').should('contain', lastEvent.duration)
        // Check the content
        cy.get('.detailed-event > .description').should('contain', lastEvent.content)
      })
    })

    it('Dashboard_Events_DisplayEventCheckReadRecipientInfo', function () {
      const existingEvents = this.dashboardData.existingEvents
      const eventForStudents = existingEvents[1]

      // Login with author
      cy.login(HEADMASTER, dashboardURL)
      getEvent(eventForStudents).click()
      cy.get('[data-test="diary-event-details-modal"]').within(() => {
        // Check if no one read this event
        cy.get('.read-infos').should('contain', 'Lu par', '0 destinataire')
      })
      // Login recipient
      cy.login(STUDENT, dashboardURL)
      // Student read this event
      getEvent(eventForStudents).click()
      cy.get('[data-test="diary-event-details-modal"]').within(() => {
        cy.get('.read-infos').should('not.be.exist')
      })

      // Login with author
      cy.login(HEADMASTER, dashboardURL)
      getEvent(eventForStudents).click()
      cy.get('[data-test="diary-event-details-modal"]').within(() => {
        // Check if one recipient read this event
        cy.get('.read-infos').should('contain', 'Lu par', '1 destinataire')
        // Open recipients infos
        cy.get('.read-infos > button').click()
      })
      // Open population panel
      cy.get('[data-test="readInfoModal"]').within(() => {
        cy.get('.population').click()
        // Verify is recipient who read is mark as read
        cy.get('.read-info-user').contains(`${STUDENT.lastName} ${STUDENT.firstName}`).should('not.contain', 'Non lu')
      })
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
      cy.get('.diary-event').eq(0).click()
      getEventDetail(existingEvents[0]).should('be.exist')
      cy.get('.diary-event').eq(1).click()
      getEventDetail(existingEvents[1]).should('be.exist')
    })

    it('Dashboard_Events_CreateEvent_ButtonCreate', function () {
      const NewEvent = this.dashboardData.NewEvent

      // Check if an admin can create an event
      cy.login(SCHOOL_ADMIN, dashboardURL)
      cy.get('[data-test="buttonCreateEvent"]').click()
      cy.get('[data-test="update-diary-event-modal"]').should('be.visible')

      // Check if a delegate can create an event
      cy.login(TEACHER, dashboardURL)
      cy.get('[data-test="buttonCreateEvent"]').click()
      cy.get('[data-test="update-diary-event-modal"]').should('be.visible')

      // Create event with the headmaster for teachers
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
        // Submit
        cy.get('[data-test="submitButton"]').click()
      })

      // Check if a student don't see the event
      cy.login(STUDENT, dashboardURL)
      getEvent(NewEvent).should('not.exist')

      // Check if a teacher see the event
      cy.login(TEACHER2, dashboardURL)
      getEvent(NewEvent).should('be.exist')
    })

    it('Dashboard_Events_CreateEvent_AllEvent_ButtonCreate', function () {
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

    it('Dashboard_Events_CreateEvent_Display_WarningMessage_SetInformations', function () {
      const NewEvent = this.dashboardData.NewEvent

      // Login
      cy.login(HEADMASTER, dashboardURL)

      // Open create modal
      cy.get('[data-test="buttonCreateEvent"]').click()
      // Set content
      cy.get('[data-test="update-diary-event-modal"]').within(() => {
        cy.get('.ck-editor')
        cy.type_ckeditor(NewEvent.content)
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
      cy.get('[data-test="buttonCreateEvent"]').click()
      // Set recipient
      cy.get('[data-test="update-diary-event-modal"]').within(() => {
        cy.get('.base-tags-input').click()
        cy.get('.suggestion-list').contains('li', NewEvent.recipient).click()
        cy.get('[data-test="closeModal"]').click()
      })
      // Check if warning modal is visible
      cy.get('[data-test="warning-modal"]').should('be.visible')
      // Click on confirm button
      cy.get('[data-test="confirmButton"]').click()

      // Open create modal
      cy.get('[data-test="buttonCreateEvent"]').click()
      // Set title
      cy.get('[data-test="update-diary-event-modal"]').within(() => {
        cy.get('.group > [data-test="titleInputEvent"]').type(NewEvent.title)
        cy.get('[data-test="closeModal"]').click()
      })
      // Check if warning modal is visible
      cy.get('[data-test="warning-modal"]').should('be.visible')
      // Click on confirm button
      cy.get('[data-test="confirmButton"]').click()

      // Open create modal
      cy.get('[data-test="buttonCreateEvent"]').click()
      // Set location
      cy.get('[data-test="update-diary-event-modal"]').within(() => {
        cy.get('.group > [data-test="locationInputEvent"]').type(NewEvent.location)
        cy.get('[data-test="closeModal"]').click()
      })
      // Check if warning modal is visible
      cy.get('[data-test="warning-modal"]').should('be.visible')
      // Click on confirm button
      cy.get('[data-test="confirmButton"]').click()
    })

    it('Dashboard_Events_CreateEvent_Display_WarningMessage_Not_SetInformations', function () {
      // Login
      cy.login(HEADMASTER, dashboardURL)

      // Open create modal
      cy.get('[data-test="buttonCreateEvent"]').click()
      // Not set informations
      cy.get('[data-test="update-diary-event-modal"]').within(() => {
        cy.get('[data-test="closeModal"]').click()
      })
      // Check if warning modal is not visible
      cy.get('[data-test="warning-modal"]').should('not.exist')
      // Check if modal create message is not visible
      cy.get('[data-test="update-diary-event-modal"]').should('not.exist')
    })

    it('Dashboard_Events_UpdateEvent_Mouseover', function () {
      const existingEvents = this.dashboardData.existingEvents
      const lastEvent = existingEvents[0]
      const EventToEdit = this.dashboardData.EventToEdit

      // Login with student to chech if he don't see the announcement
      cy.login(PARENT, dashboardURL)
      getEvent(lastEvent).should('not.exist')

      // Login to update event
      cy.login(HEADMASTER, dashboardURL)

      // Mouse over on the event
      getEvent(lastEvent).trigger('mouseover').within(() => {
        cy.get('[data-test="buttonEditEvent"]').click()
      })
      // Set new informations
      cy.get('[data-test="update-diary-event-modal"]').within(() => {
        cy.get('.base-tags-input').click()
        // Add all students in recipients
        cy.get('.suggestion-list').contains('li', EventToEdit.recipient).click()
        cy.get('.group > [data-test="titleInputEvent"]').clear()
        cy.get('.group > [data-test="titleInputEvent"]').type(EventToEdit.title)
        cy.get('.group > [data-test="locationInputEvent"]').clear()
        cy.get('.group > [data-test="locationInputEvent"]').type(EventToEdit.location)
        cy.get('.ck-editor')
        cy.type_ckeditor(EventToEdit.content)
        cy.get('[data-test="submitButton"]').click()
      })
      // Check if the modification exist
      getEvent(EventToEdit).should('be.exist')
      cy.get('[data-test="diary-widget"]').within(() => {
        cy.contains('button', 'Voir tous les événements').click()
      })
      // Check the content
      getEventDetail(EventToEdit).should('be.exist')

      // Login with a student to see if now he can see the event
      cy.login(STUDENT, dashboardURL)
      getEvent(EventToEdit).should('be.exist')
    })

    it('Dashboard_Events_UpdateEvent_ClickOnEvent', function () {
      const existingEvents = this.dashboardData.existingEvents
      const lastEvent = existingEvents[0]
      // Login
      cy.login(HEADMASTER, dashboardURL)

      // Click on last event
      getEvent(lastEvent).click()
      // Open updaye modal
      cy.get('[data-test="updateButton"]').click()
      // Check if update modal is visible
      cy.get('[data-test="update-diary-event-modal"]').should('be.visible')
    })

    it('Dashboard_Events_UpdateEvent_AllEvent_UpdateButton', function () {
      const existingEvents = this.dashboardData.existingEvents
      const lastEvent = existingEvents[0]
      // Login
      cy.login(HEADMASTER, dashboardURL)

      // Click to see all events
      cy.get('[data-test="diary-widget"]').within(() => {
        cy.contains('button', 'Voir tous les événements').click()
      })
      // Last event should be visible at first
      getEventDetail(lastEvent).should('be.visible')
      // Click on update button
      cy.get('[data-test="updateButton"]').click()
      // Check if update modal is visible
      cy.get('[data-test="update-diary-event-modal"]').should('be.visible')
    })

    it('Dashboard_Events_UpdateEvent_CanEdit_By_Profils', function () {
      const existingEvents = this.dashboardData.existingEvents
      const lastEvent = existingEvents[0]

      // Login
      cy.login(TEACHER2, dashboardURL)
      // Mouse over on the event
      getEvent(lastEvent).trigger('mouseover').within(() => {
        // Check if a teacher can't edit an event
        cy.get('[data-test="buttonEditEvent"]').should('not.exist')
      })

      // Login
      cy.login(TEACHER, dashboardURL)
      // Mouse over on the event
      getEvent(lastEvent).trigger('mouseover').within(() => {
        // Check if a delegate teacher can edit an event
        cy.get('[data-test="buttonEditEvent"]').should('be.exist')
      })

      // Login
      cy.login(SCHOOL_ADMIN, dashboardURL)
      // Mouse over on the event
      getEvent(lastEvent).trigger('mouseover').within(() => {
        // Check if an admin can edit an event
        cy.get('[data-test="buttonEditEvent"]').should('be.exist')
      })
    })

    it('Dashboard_Events_UpdateEvent_Display_WarningMessage_SetInformations', function () {
      const existingEvents = this.dashboardData.existingEvents
      const lastEvent = existingEvents[0]
      const EventToEdit = this.dashboardData.EventToEdit

      // Login
      cy.login(HEADMASTER, dashboardURL)

      // Mouse over on the event
      getEvent(lastEvent).trigger('mouseover').within(() => {
        cy.get('[data-test="buttonEditEvent"]').click()
      })
      // Set content
      cy.get('[data-test="update-diary-event-modal"]').within(() => {
        cy.get('.ck-editor')
        cy.type_ckeditor(EventToEdit.content)
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

      // Mouse over on the event
      getEvent(lastEvent).trigger('mouseover').within(() => {
        cy.get('[data-test="buttonEditEvent"]').click()
      })
      // Set recipient
      cy.get('[data-test="update-diary-event-modal"]').within(() => {
        cy.get('.base-tags-input').click()
        cy.get('.suggestion-list').contains('li', EventToEdit.recipient).click()
        cy.get('[data-test="closeModal"]').click()
      })
      // Check if warning modal is visible
      cy.get('[data-test="warning-modal"]').should('be.visible')
      // Click on confirm button
      cy.get('[data-test="confirmButton"]').click()

      // Mouse over on the event
      getEvent(lastEvent).trigger('mouseover').within(() => {
        cy.get('[data-test="buttonEditEvent"]').click()
      })
      // Set title
      cy.get('[data-test="update-diary-event-modal"]').within(() => {
        cy.get('.group > [data-test="titleInputEvent"]').type(EventToEdit.title)
        cy.get('[data-test="closeModal"]').click()
      })
      // Check if warning modal is visible
      cy.get('[data-test="warning-modal"]').should('be.visible')
      // Click on confirm button
      cy.get('[data-test="confirmButton"]').click()

      // Mouse over on the event
      getEvent(lastEvent).trigger('mouseover').within(() => {
        cy.get('[data-test="buttonEditEvent"]').click()
      })
      // Set location
      cy.get('[data-test="update-diary-event-modal"]').within(() => {
        cy.get('.group > [data-test="locationInputEvent"]').type(EventToEdit.location)
        cy.get('[data-test="closeModal"]').click()
      })
      // Check if warning modal is visible
      cy.get('[data-test="warning-modal"]').should('be.visible')
      // Click on confirm button
      cy.get('[data-test="confirmButton"]').click()
    })

    it('Dashboard_Events_UpdateEvent_Display_WarningMessage_Not_SetInformations', function () {
      const existingEvents = this.dashboardData.existingEvents
      const lastEvent = existingEvents[0]
      // Login
      cy.login(HEADMASTER, dashboardURL)

      // Mouse over on the event
      getEvent(lastEvent).trigger('mouseover').within(() => {
        cy.get('[data-test="buttonEditEvent"]').click()
      })
      // Not set informations
      cy.get('[data-test="update-diary-event-modal"]').within(() => {
        cy.get('[data-test="closeModal"]').click()
      })
      // Check if warning modal is not visible
      cy.get('[data-test="warning-modal"]').should('not.exist')
      // Check if modal update event is not visible
      cy.get('[data-test="update-diary-event-modal"]').should('not.exist')
    })

    it('Dashboard_Events_DeleteEvent_Mouseover', function () {
      const existingEvents = this.dashboardData.existingEvents
      const lastEvent = existingEvents[0]

      // Login
      cy.login(HEADMASTER, dashboardURL)

      // Mouse over on the event
      getEvent(lastEvent).trigger('mouseover').within(() => {
        cy.get('[data-test="buttonDeleteEvent"]').click()
      })
      // Confirm the delete
      cy.get('[data-test="confirmButton"]').click()

      // Check if event is delete
      getEvent(lastEvent).should('not.exist')

      // Check if for the parents the event is delete
      cy.login(PARENT, dashboardURL)
      getEvent(lastEvent).should('not.exist')
    })

    it('Dashboard_Events_DeleteEvent_ClickOnEvent', function () {
      const existingEvents = this.dashboardData.existingEvents
      const lastEvent = existingEvents[0]

      // Login
      cy.login(HEADMASTER, dashboardURL)

      // Click on last event
      getEvent(lastEvent).click()
      cy.get('[data-test="deleteButton"]').click()
      // Check if in the warning modal content there is the news title
      cy.get('[data-test="warning-modal"]')
    })

    it('Dashboard_Events_DeleteEvent_AllEvent_ButtonDelete', function () {
      const existingEvents = this.dashboardData.existingEvents
      const lastEvent = existingEvents[0]

      // Login
      cy.login(HEADMASTER, dashboardURL)

      // Click to see all events
      cy.get('[data-test="diary-widget"]').within(() => {
        cy.contains('button', 'Voir tous les événements').click()
      })
      // last event should be first
      getEventDetail(lastEvent).should('be.visible')
      cy.get('[data-test="deleteButton"]').click()
      // Check if in the warning modal content there is the news title
      cy.get('[data-test="warning-modal"]').should('be.visible')
    })

    it('Dashboard_Events_DeleteEvent_CanDelete_By_Profils', function () {
      const existingEvents = this.dashboardData.existingEvents
      const lastEvent = existingEvents[0]

      // Login with teacher
      cy.login(TEACHER2, dashboardURL)
      // Mouse over on the event
      getEvent(lastEvent).trigger('mouseover').within(() => {
        cy.get('[data-test="buttonDeleteEvent"]').should('not.exist')
      })

      // Login with delegate teacher
      cy.login(TEACHER, dashboardURL)
      // Mouse over on the event
      getEvent(lastEvent).trigger('mouseover').within(() => {
        cy.get('[data-test="buttonDeleteEvent"]').should('not.exist')
      })

      // Login with admin
      cy.login(SCHOOL_ADMIN, dashboardURL)
      // Mouse over on the event
      getEvent(lastEvent).trigger('mouseover').within(() => {
        cy.get('[data-test="buttonDeleteEvent"]').should('not.exist')
      })
    })
  })
  context('mobile', function () {
    it('Dashboard_Events_DisplayAllEvents_Mobile', function () {
      cy.viewport('iphone-5')
      const existingEvents = this.dashboardData.existingEvents
      // Login
      cy.login(HEADMASTER, dashboardURL)
      // Click on all events button
      cy.get('[data-test="diary-widget"]').within(() => {
        cy.contains('button', 'Voir tous les événements').click()
      })
      // Check if all events are visible
      cy.get('.diary-event').eq(0).click()
      getEventDetail(existingEvents[0]).should('be.exist')
      cy.get('.diary-event').eq(1).click()
      getEventDetail(existingEvents[1]).should('be.exist')
    })

    it('Dashboard_Events_CreateEvent_DisplayModal_Mobile', function () {
      cy.viewport('iphone-5')

      // Create event with the headmaster for the teachers
      cy.login(HEADMASTER, dashboardURL)
      // Open create modal
      cy.get('[data-test="buttonCreateEvent"]').click()
      // Check if update modal is visible
      cy.get('[data-test="update-diary-event-modal"]').should('be.visible')
    })

    it('Dashboard_Events_CreateEvent_AllEvent_ButtonCreate_DisplayModal_Mobile', function () {
      cy.viewport('iphone-5')
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

    it('Dashboard_Events_UpdateEvent_ClickOnEvent_DisplayModal_Mobile', function () {
      cy.viewport('iphone-5')
      const existingEvents = this.dashboardData.existingEvents
      const lastEvent = existingEvents[0]

      // Login
      cy.login(HEADMASTER, dashboardURL)

      // Open detail last event
      getEvent(lastEvent).click()
      // Click on update button
      cy.get('[data-test="updateButton"]').click()
      // Check if update modal is visible
      cy.get('[data-test="update-diary-event-modal"]').should('be.visible')
    })

    it('Dashboard_Events_UpdateEvent_AllNews_ButtonUpdate_DisplayModal_Mobile', function () {
      cy.viewport('iphone-5')
      const existingEvents = this.dashboardData.existingEvents
      const lastEvent = existingEvents[0]

      // Login
      cy.login(HEADMASTER, dashboardURL)

      // Click to see all events
      cy.get('[data-test="diary-widget"]').within(() => {
        cy.contains('button', 'Voir tous les événements').click()
      })
      // Last event should be first
      getEventDetail(lastEvent).should('be.visible')
      // Click on update modal
      cy.get('[data-test="updateButton"]').click()
      // Check if update modal is visible
      cy.get('[data-test="update-diary-event-modal"]').should('be.visible')
    })

    it('Dashboard_Events_DeleteEvent_ClickOnEvent_DisplayModal_Mobile', function () {
      cy.viewport('iphone-5')
      const existingEvents = this.dashboardData.existingEvents
      const lastEvent = existingEvents[0]

      // Login
      cy.login(HEADMASTER, dashboardURL)

      getEvent(lastEvent).click()
      cy.get('[data-test="deleteButton"]').click()
      // Check if in the warning modal content there is the news title
      cy.get('[data-test="warning-modal"]')
    })

    it('Dashboard_Events_DeleteEvent_AllEvent_DisplayModal_Mobile', function () {
      cy.viewport('iphone-5')
      const existingEvents = this.dashboardData.existingEvents
      const lastEvent = existingEvents[0]

      // Login
      cy.login(HEADMASTER, dashboardURL)

      // Click to see all events
      cy.get('[data-test="diary-widget"]').within(() => {
        cy.contains('button', 'Voir tous les événements').click()
      })
      // Last event should be first
      getEventDetail(lastEvent).should('be.visible')
      cy.get('[data-test="deleteButton"]').click()
      // Check if modal is visible
      cy.get('[data-test="warning-modal"]').should('be.visible')
    })
  })
})
