import { messagingURL } from '../../support/constants/urls'
import { HEADMASTER, STUDENT } from '../../support/constants/users'
import { waitMessagingToBeLoaded } from '../../support/utils/messagingUtils'

describe('Messaging_TransferMessage', () => {
  beforeEach(() => {
    cy.loadTables('messaging/messaging_tables.sql')
    cy.fixture('messaging.json').as('messagingData')
  })
  context('desktop', function () {
    // Answer thread rightclick
    it('Messaging_TransferMessage_icon', function () {
      const existingThreads = this.messagingData.existingThreads
      const formattedLastName = STUDENT.lastName.charAt(0).toUpperCase() + STUDENT.lastName.slice(1).toLowerCase()
      const formattedFirstName = STUDENT.firstName.charAt(0).toUpperCase() + STUDENT.firstName.slice(1).toLowerCase()

      // Login
      cy.login(HEADMASTER, messagingURL)
      waitMessagingToBeLoaded()

      // Click on first thread
      cy.get('.scroll').within(() => {
        cy.get('[data-test="thread-list-item"]').first().click()
      })
      // Click on forward icon
      cy.get('[data-test="option_forward"]').click()

      // Set a new recipient
      cy.get('[data-test="createMessageModal"]').within(() => {
        cy.get('.base-tags-input').type('penelope')
      })
      cy.get('.suggestion-list').contains(`${formattedLastName} ${formattedFirstName}`).click()

      // Send
      cy.get('.footer').contains('button', 'Envoyer').click()

      // Login recipient
      cy.login(STUDENT, messagingURL)
      // Check if thread is exist
      cy.get('[data-test="thread-list-item"]').contains(`Tr: ${existingThreads[3][0].subject}`).should('be.exist')
    })
    it('Messaging_TransferMessage_rightClickMenu', function () {
      const existingThreads = this.messagingData.existingThreads
      const formattedLastName = STUDENT.lastName.charAt(0).toUpperCase() + STUDENT.lastName.slice(1).toLowerCase()
      const formattedFirstName = STUDENT.firstName.charAt(0).toUpperCase() + STUDENT.firstName.slice(1).toLowerCase()

      // Login
      cy.login(HEADMASTER, messagingURL)
      waitMessagingToBeLoaded()

      // Right click on first thread
      cy.get('.scroll').within(() => {
        cy.get('[data-test="thread-list-item"]').first().rightclick()
      })
      // Click on forward in options menu
      cy.get('[data-test="forward"]').click()

      // Set a new recipient
      cy.get('[data-test="createMessageModal"]').within(() => {
        cy.get('.base-tags-input').type('penelope')
      })
      cy.get('.suggestion-list').contains(`${formattedLastName} ${formattedFirstName}`).click()

      // Send
      cy.get('.footer').contains('button', 'Envoyer').click()

      // Login recipient
      cy.login(STUDENT, messagingURL)
      // Check if thread is exist
      cy.get('[data-test="thread-list-item"]').contains(`Tr: ${existingThreads[3][0].subject}`).should('be.exist')
    })
  })

  it('Check transfer modal mobile', () => {
    cy.viewport('iphone-5')
    // Login
    cy.login(HEADMASTER, messagingURL)
    waitMessagingToBeLoaded()

    // Click on first thread
    cy.get('[data-test="thread-list-item"]').first().click()
    // Click on forward icon
    cy.get('[data-test="option_forward"]').click()
    // Check if create message modal is visible
    cy.get('[data-test="createMessageModal"]').should('be.visible')
  })
})
