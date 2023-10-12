import { messagingURL } from '../../support/constants/urls'
import { HEADMASTER } from '../../support/constants/users'
import { waitMessagingToBeLoaded } from '../../support/utils/messagingUtils'

let unread = 0
const getUnread = (allThread) => {
  for (let i = 0; i < allThread.length; i++) {
    for (let j = 0; j < allThread[i].length; j++) {
      if (allThread[i][j].read !== 1) {
        unread++
      }
    }
  }
}

describe('Messaging filter', () => {
  beforeEach(() => {
    cy.loadTables('messaging/messaging_tables.sql')
    cy.fixture('messaging.json').as('messagingData')
    cy.login(HEADMASTER, messagingURL)
    waitMessagingToBeLoaded()
  })
  context('desktop', function () {
    // filter read / unread
    it('filter read / unread', function () {
      const totalThreads = this.messagingData.existingThreads
      getUnread(totalThreads)
      // Unread
      cy.get('[data-test="option_toggleUnreadOnly"] > .custom-icon').click()
      cy.get('.scroll').find('[data-test="thread-list-item"]').should('have.length', unread)
      cy.get('[data-test="thread-list-item"]').each(() => {
        cy.get('[data-test="unread-icon"]')
      })
      // All
      cy.get('[data-test="option_toggleUnreadOnly"] > .custom-icon').click()
      cy.get('.scroll').find('[data-test="thread-list-item"]').should('have.length', totalThreads.length)
    })

    // test count read / unread
    it.only('count read / unread', function () {
      const totalThreads = this.messagingData.existingThreads
      getUnread(totalThreads)
      // Open menu
      cy.get('[data-test="option_toggleMessagingMenu"]').click()
      // UnRead to read
      cy.get('.scroll').within(() => {
        cy.get('[data-test="thread-list-item"]').first().rightclick()
      })
      cy.get('[data-test="markAsRead"]').click()
      cy.get('.nb-unread').contains(unread - 1)
      cy.get('.nb-new-messages').contains(unread - 1)
      // Read to unread
      cy.get('.scroll').within(() => {
        cy.get('[data-test="thread-list-item"]').first().rightclick()
      })
      cy.get('[data-test="markAsUnread"]').click()
      cy.get('.nb-unread').contains(unread)
      cy.get('.nb-new-messages').contains(unread)
    })
  })
})
