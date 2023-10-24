import { messagingURL } from '../../support/constants/urls'
import { HEADMASTER } from '../../support/constants/users'
import { getThread, waitMessagingToBeLoaded } from '../../support/utils/messagingUtils'

describe('Warning', () => {
  beforeEach(() => {
    cy.fixture('messaging.json').as('messagingData')
    cy.loadTables('messaging/messaging_tables.sql')
    cy.login(HEADMASTER, messagingURL)
    waitMessagingToBeLoaded()
  })

  it('Messaging_DisplayWarningMessageOnMessageEdition_Modified_draft', function () {
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
      cy.get('.ck-editor')
      cy.type_ckeditor(ModifiedDraftContent[0].content)

      // Close modal
      cy.get('[data-test="closeModal"]').click()
    })
    // Check if warning modal is visible
    cy.get('[data-test="warning-modal"]').should('be.exist')
  })
  it('Messaging_DisplayWarningMessageOnMessageEdition_Modified_thread', function () {
    // Login
    cy.loadTables('messaging/messaging_tables.sql')
    cy.login(HEADMASTER, messagingURL)
    waitMessagingToBeLoaded()
    const ModifiedDraftContent = this.messagingData.ModifiedDraftContent[0]

    // Right click on first thread
    cy.get('.scroll').within(() => {
      cy.get('[data-test="thread-list-item"]').first().rightclick()
    })
    // Click on reply in options menu
    cy.get('[data-test="reply"]').click()

    // content modified
    cy.get('[data-test="createMessageModal"]').within(() => {
      cy.get('.ck-editor')
      cy.type_ckeditor(ModifiedDraftContent[0].content)

      // Close modal
      cy.get('[data-test="closeModal"]').click()
    })
    // Check if warning modal is visible
    cy.get('[data-test="warning-modal"]').should('be.exist')
  })
  it('Messaging_DisplayWarningMessageOnMessageEdition_UnModified_draft', function () {
    // Login
    cy.loadTables('messaging/messaging_tables.sql')
    cy.login(HEADMASTER, messagingURL)
    waitMessagingToBeLoaded()
    const existingDraftThreads = this.messagingData.existingDraftThreads[0]

    // Go to draft menu
    cy.get('[data-test="option_toggleMessagingMenu"]').click()
    cy.get('[data-test="messaging-menu"]').contains('button', 'Brouillons').click()

    // Click on existing draft
    getThread(existingDraftThreads).click()
    cy.get('[data-test="option_editDraft"]').click()

    // content modified
    cy.get('[data-test="createMessageModal"]').within(() => {
      // Close modal
      cy.get('[data-test="closeModal"]').click()
    })
    // Check if warning modal is not visible
    cy.get('[data-test="warning-modal"]').should('be.not.exist')
  })

  it('Messaging_DisplayWarningMessageOnMessageEdition_UnModified_thread', function () {
    // Login
    cy.loadTables('messaging/messaging_tables.sql')
    cy.login(HEADMASTER, messagingURL)
    waitMessagingToBeLoaded()

    // Right click on first thread
    cy.get('.scroll').within(() => {
      cy.get('[data-test="thread-list-item"]').first().rightclick()
    })
    // Click on reply in options menu
    cy.get('[data-test="reply"]').click()

    // content modified
    cy.get('[data-test="createMessageModal"]').within(() => {
      // Close modal
      cy.get('[data-test="closeModal"]').click()
    })
    // Check if warning modal is not visible
    cy.get('[data-test="warning-modal"]').should('be.not.exist')
  })
})
