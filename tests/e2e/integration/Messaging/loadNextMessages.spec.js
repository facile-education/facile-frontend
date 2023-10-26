/* eslint-disable indent */
import { messagingURL } from '../../support/constants/urls'
import { STUDENT } from '../../support/constants/users'
import { waitMessagingToBeLoaded } from '../../support/utils/messagingUtils'

describe('Load next message', () => {
    const sizes = ['iphone-5', 'ipad-2', [1024, 768], [1024, 4000]]
    const largeScreenNoScroll = sizes[3]
    sizes.forEach(size => {
      it(`Messaging_LoadNextMessages_on: ${size}`, function () {
        // Set testing viewport
        if (Array.isArray(size)) {
          cy.viewport(size[0], size[1])
        } else {
          cy.viewport(size)
        }
        // Load tables
        cy.loadTables('messaging/messaging_tables_full.sql')

        // Login
        cy.login(STUDENT, messagingURL)
        waitMessagingToBeLoaded()

        // Pagination is smaller than screen size
        if (size === largeScreenNoScroll) {
          // Check if all threads is visible
          cy.get('[data-test="thread-list-item"]').should('have.length', 25)
        } else {
        // Pagination is taller than screen size
        // Check if 20 threads is visible
        cy.get('[data-test="thread-list-item"]').should('have.length', 20)
        // Scroll to bottom
        cy.get('.scroll').scrollTo('bottom')
        // Check if all threads is visible
        cy.get('[data-test="thread-list-item"]').should('have.length', 25)
        }
      })
    })
})
