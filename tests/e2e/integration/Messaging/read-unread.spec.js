import { messagingURL } from '../../support/constants/urls'
import { HEADMASTER } from '../../support/constants/users'
import { waitMessagingToBeLoaded } from '../../support/utils/messagingUtils'

describe('Messaging filter', () => {
  beforeEach(() => {
    cy.loadTables('messaging/messaging_tables.sql')
    cy.fixture('messaging.json').as('messagingData')
    cy.login(HEADMASTER, messagingURL)
    waitMessagingToBeLoaded()
  })
  context('desktop', function () {
    it('filter read / unread', function () {
      const totalUnRead = this.messagingData.existingThreads
      console.log(totalUnRead)
      // Unread
      cy.get('[data-test="option_toggleUnreadOnly"] > .custom-icon').click()
      cy.get('.scroll').find('[data-test="thread-list-item"]').should('have.length', 3)
      cy.get('[data-test="thread-list-item"]').each(() => {
        cy.get('[data-test="unread-icon"]')
      })
      // All
      cy.get('[data-test="option_toggleUnreadOnly"] > .custom-icon').click()
      cy.get('.scroll').find('[data-test="thread-list-item"]').should('have.length', 4)
    })
    it('count read / unread', () => {
      // Open menu
      cy.get('[data-test="option_toggleMessagingMenu"]').click()
      // UnRead to read
      cy.get('.scroll').within(() => {
        cy.get('[data-test="thread-list-item"]').first().rightclick()
      })
      cy.get('[data-test="markAsRead"]').click()
      cy.get('.nb-unread').contains('2 non lus')
      cy.get('.nb-new-messages').contains('2')
      // Read to unread
      cy.get('.scroll').within(() => {
        cy.get('[data-test="thread-list-item"]').first().rightclick()
      })
      cy.get('[data-test="markAsUnread"]').click()
      cy.get('.nb-unread').contains('3 non lus')
      cy.get('.nb-new-messages').contains('3')
    })
  })
})
