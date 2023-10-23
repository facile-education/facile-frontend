import { messagingURL } from '../../support/constants/urls'
import { HEADMASTER, STUDENT } from '../../support/constants/users'
import { getThread, waitMessagingToBeLoaded } from '../../support/utils/messagingUtils'

describe('Draft', () => {
  beforeEach(() => {
    cy.fixture('messaging.json').as('messagingData')
  })

  context('desktop', function () {
    // Messaging_SaveAsDraft
    it('Messaging_SaveAsDraft', function () {
      // Login
      cy.login(HEADMASTER, messagingURL)
      waitMessagingToBeLoaded()
      const draftToCreate = this.messagingData.draftToCreate[0]

      // Open modal create message
      cy.get('[data-test="createMessageButton"]').click()

      // Write message
      cy.get('[data-test="createMessageModal"]').within(() => {
        cy.get('.base-tags-input').type('penelope')
        cy.get('.suggestion-list > li').last().click()
        cy.get('.group > [data-test="subject-input"]').type(draftToCreate[0].subject)
        cy.get('.ck-editor')
        cy.type_ckeditor(draftToCreate[0].content)

        // Save as draft
        cy.get('[data-test="draftButton"]').click()
      })

      // Check draft list
      cy.get('[data-test="option_toggleMessagingMenu"]').click()
      cy.get('[data-test="messaging-menu"]').contains('button', 'Brouillons').click()
      cy.get('.scroll').within(() => {
        getThread(draftToCreate).should('be.exist')
      })
    })

    // Messaging_EditDraft
    it('Messaging_EditDraft', function () {
      // Login
      cy.loadTables('messaging/messaging_tables.sql')
      cy.login(HEADMASTER, messagingURL)
      waitMessagingToBeLoaded()
      const existingDraftThreads = this.messagingData.existingDraftThreads[0]
      const ModifiedDraftContent = this.messagingData.ModifiedDraftContent[0]

      // Go to draft menu
      cy.get('[data-test="option_toggleMessagingMenu"]').click()
      cy.get('[data-test="messaging-menu"]').contains('button', 'Brouillons').click()

      // Click on existing draft
      getThread(existingDraftThreads).click()
      cy.get('[data-test="option_editDraft"]').click()

      // content modified
      cy.get('[data-test="createMessageModal"]').within(() => {
        cy.get('.group > [data-test="subject-input"]').clear()
        cy.get('.group > [data-test="subject-input"]').type(ModifiedDraftContent[0].subject)
        cy.get('.ck-editor')
        cy.type_ckeditor(ModifiedDraftContent[0].content)

        // Save as draft
        cy.get('[data-test="draftButton"]').click()
      })
      // Check draft modified
      cy.get('.scroll').within(() => {
        getThread(ModifiedDraftContent).should('be.exist')
      })
    })

    // Messaging_SendDraft
    it('Messaging_SendDraft', function () {
      // Login
      cy.loadTables('messaging/messaging_tables.sql')
      cy.login(HEADMASTER, messagingURL)
      waitMessagingToBeLoaded()
      const existingDraftThreads = this.messagingData.existingDraftThreads[0]
      console.log(existingDraftThreads.length)
      // Go to draft menu
      cy.get('[data-test="option_toggleMessagingMenu"]').click()
      cy.get('[data-test="messaging-menu"]').contains('button', 'Brouillons').click()

      // Click on existing draft
      getThread(existingDraftThreads).click()
      cy.get('[data-test="option_editDraft"]').click()

      // Send Draft
      cy.get('[data-test="createMessageModal"]').within(() => {
        cy.get('[data-test="submitButton"]').click()
      })

      // Check existing draft not exist
      getThread(existingDraftThreads).should('be.not.exist')

      // Login recipient
      cy.login(STUDENT, messagingURL)
      waitMessagingToBeLoaded()

      cy.get('.scroll').within(() => {
        getThread(existingDraftThreads).should('be.exist')
      })
    })
  })
  context('mobile', function () {
    beforeEach(function () {
      cy.viewport('iphone-5')
    })
  })
})
