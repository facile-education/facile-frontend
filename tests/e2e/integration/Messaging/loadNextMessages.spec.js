/* eslint-disable indent */
import { messagingURL } from '../../support/constants/urls'
import { STUDENT } from '../../support/constants/users'
import { waitMessagingToBeLoaded } from '../../support/utils/messagingUtils'

describe('Load next message', () => {
    // it('Create all messages', function () {
    //   cy.loadTables('messaging/messaging_tables_empty.sql')
    //   cy.login(HEADMASTER, messagingURL)
    //   waitMessagingToBeLoaded()

    //   const formattedLastName = STUDENT.lastName.charAt(0).toUpperCase() + STUDENT.lastName.slice(1).toLowerCase()
    //   const formattedFirstName = STUDENT.firstName.charAt(0).toUpperCase() + STUDENT.firstName.slice(1).toLowerCase()

    //   for (let i = 0; i < 25; i++) {
    //     cy.get('[data-test="createMessageButton"]').click()
    //     // Write message
    //     cy.get('[data-test="createMessageModal"]').within(() => {
    //       cy.get('.base-tags-input').type('penelope')
    //       cy.get('.suggestion-list').contains(`${formattedLastName} ${formattedFirstName}`).click()
    //       cy.get('.group > [data-test="subject-input"]').type(`Message ${i}`)
    //       cy.get('.ck-editor')
    //       cy.type_ckeditor(`Contenu du message ${i}`)

    //       // Send message
    //       cy.get('[data-test="submitButton"]').click()
    //     })
    //     cy.get('.close').click()
    //   }
    // })
    const sizes = ['iphone-5', 'ipad-2', [1024, 768], [1024, 2000]]

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

        // Large screen
        if (size === sizes[3]) {
          // Check if all threads is visible
          cy.get('[data-test="thread-list-item"]').should('have.length', 25)
        } else {
        // Normal screen

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
