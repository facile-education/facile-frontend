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

describe('Messaging_SetReadStatus', () => {
  beforeEach(() => {
    cy.loadTables('messaging/messaging_tables.sql')
    cy.fixture('messaging.json').as('messagingData')
    cy.login(HEADMASTER, messagingURL)
    waitMessagingToBeLoaded()
  })
  context('desktop', function () {
    // filter read / unread
    it('Messaging_SetReadStatus_filter', function () {
      const totalThreads = this.messagingData.existingThreads
      getUnread(totalThreads)
      // Unread
      cy.get('[data-test="option_toggleUnreadOnly"]').click()
      cy.get('.scroll').find('[data-test="thread-list-item"]').should('have.length', unread)
      cy.get('[data-test="thread-list-item"]').each(() => {
        cy.get('[data-test="unread-icon"]')
      })
      // All
      cy.get('[data-test="option_toggleUnreadOnly"] > .custom-icon').click()
      cy.get('.scroll').find('[data-test="thread-list-item"]').should('have.length', totalThreads.length)
    })

    // test count read / unread
    it('Messaging_SetReadStatus_count', function () {
      unread = 0
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
  context('mobile', function () {
    beforeEach(function () {
      cy.viewport('iphone-5')
    })
    it('filter read / unread Mobile', function () {
      const totalThreads = this.messagingData.existingThreads
      unread = 0
      getUnread(totalThreads)
      // Unread
      cy.get('[data-test="option_toggleUnreadOnly"]').click()
      cy.get('.scroll').find('[data-test="thread-list-item"]').should('have.length', unread)
      cy.get('[data-test="thread-list-item"]').each(() => {
        cy.get('[data-test="unread-icon"]')
      })
      // All
      cy.get('[data-test="option_toggleUnreadOnly"] > .custom-icon').click()
      cy.get('.scroll').find('[data-test="thread-list-item"]').should('have.length', totalThreads.length)
    })

    // count read / unread Mobile multiSelection button
    it('count read / unread Mobile multiSelection button', function () {
      unread = 0
      const totalThreads = this.messagingData.existingThreads
      getUnread(totalThreads)
      // UnRead to read
      cy.get('[data-test="option_toggleMultiSelection"]').click()
      cy.get('.scroll').within(() => {
        cy.get('[data-test="thread-list-item"]').first().click()
      })
      cy.get('[data-test="option_options"]').click()
      cy.get('[data-test="markAsRead"]').click()
      cy.get('.nb-new-messages').contains(unread - 1)
      // Read to unread
      cy.get('[data-test="option_toggleMultiSelection"]').click()
      cy.get('.scroll').within(() => {
        cy.get('[data-test="thread-list-item"]').first().click()
      })
      cy.get('[data-test="option_options"]').click()
      cy.get('[data-test="markAsUnread"]').click()
      cy.get('.nb-new-messages').contains(unread)
    })

    // count read / unread Mobile multiSelection
    // it.only('count read / unread Mobile multiSelection', function () {
    //   unread = 0
    //   const totalThreads = this.messagingData.existingThreads
    //   getUnread(totalThreads)
    //   // UnRead to read
    //   cy.get('.scroll').within(() => {
    //     // trigger long click
    //     cy.get('[data-test="thread-list-item"]').first().as('first-item')
    //     cy.get('@first-item').trigger('mousedown')
    //     // eslint-disable-next-line cypress/no-unnecessary-waiting
    //     cy.wait(2000)
    //     cy.get('@first-item').click()
    //   })
    //   cy.get('[data-test="option_options"]').click()
    //   cy.get('[data-test="markAsRead"]').click()
    //   cy.get('.nb-new-messages').contains(unread - 1)
    //   // Read to unread
    //   cy.get('[data-test="option_toggleMultiSelection"]').click()
    //   cy.get('.scroll').within(() => {
    //     // trigger long click
    //     cy.get('[data-test="thread-list-item"]').first().as('first-item')
    //     cy.get('@first-item').trigger('mousedown')
    //     // eslint-disable-next-line cypress/no-unnecessary-waiting
    //     cy.wait(2000)
    //     cy.get('@first-item').click()
    //   })
    //   cy.get('[data-test="option_options"]').click()
    //   cy.get('[data-test="markAsUnread"]').click()
    //   cy.get('.nb-new-messages').contains(unread)
    // })
  })
})
