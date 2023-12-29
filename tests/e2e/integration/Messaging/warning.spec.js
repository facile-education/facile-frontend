import { messagingURL } from '../../support/constants/urls'
import { HEADMASTER, TEACHER } from '../../support/constants/users'
import { getThread, setRecipient, waitMessagingToBeLoaded } from '../../support/utils/messagingUtils'

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
    const ModifiedDraft = this.messagingData.ModifiedDraftContent[0]

    // Go to draft menu
    cy.get('[data-test="option_toggleMessagingMenu"]').click()
    cy.get('[data-test="messaging-menu"]').contains('button', 'Brouillons').click()

    // Click on existing draft to modify content
    getThread(existingDraftThreads).click()
    cy.get('[data-test="option_editDraft"]').click()

    // content modified
    cy.get('[data-test="createMessageModal"]').within(() => {
      cy.type_ckeditor(ModifiedDraft[0].content)

      // Close modal
      cy.get('[data-test="closeModal"]').click()
    })
    // Check if warning modal is visible
    cy.get('[data-test="warning-modal"]').should('be.exist')
    // Click on confirm button
    cy.get('[data-test="confirmButton"]').click()
    // Check if warning modal is not visible
    cy.get('[data-test="warning-modal"]').should('not.exist')
    // Check if modal create message is not visible
    cy.get('[data-test="createMessageModal"]').should('not.exist')

    // Click on existing draft to modify subject
    getThread(existingDraftThreads).click()
    cy.get('[data-test="option_editDraft"]').click()

    // subject modified
    cy.get('[data-test="createMessageModal"]').within(() => {
      cy.get('.group > [data-test="subject-input"]').clear()
      cy.get('.group > [data-test="subject-input"]').type(ModifiedDraft[0].subject)

      // Close modal
      cy.get('[data-test="closeModal"]').click()
    })
    // Check if warning modal is visible
    cy.get('[data-test="warning-modal"]').should('be.exist')
    // Click on confirm button
    cy.get('[data-test="confirmButton"]').click()
    // Check if warning modal is not visible
    cy.get('[data-test="warning-modal"]').should('not.exist')
    // Check if modal create message is not visible
    cy.get('[data-test="createMessageModal"]').should('not.exist')

    // Click on existing draft to modify recipient
    getThread(existingDraftThreads).click()
    cy.get('[data-test="option_editDraft"]').click()

    // recipient modified
    cy.get('[data-test="createMessageModal"]').within(() => {
      setRecipient(TEACHER)

      // Close modal
      cy.get('[data-test="closeModal"]').click()
    })
    // Check if warning modal is visible
    cy.get('[data-test="warning-modal"]').should('be.exist')
    // Click on cancel button
    cy.get('[data-test="cancelButton"]').click()
    cy.get('[data-test="createMessageModal"]').should('be.visible')
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

  it('Messaging_DisplayWarningMessageOnMessageEdition_UnModified_Reply', function () {
    // Login
    cy.loadTables('messaging/messaging_tables.sql')
    cy.login(HEADMASTER, messagingURL)
    waitMessagingToBeLoaded()
    const secondThread = this.messagingData.existingThreads[1]

    // Right click on first thread
    getThread(secondThread).rightclick()
    cy.get('[data-test="reply"]').click()

    cy.get('[data-test="createMessageModal"]').within(() => {
      // Close modal
      cy.get('[data-test="closeModal"]').click()
    })
    // Check if warning modal is not visible
    cy.get('[data-test="warning-modal"]').should('be.not.exist')
  })

  it('Messaging_DisplayWarningMessageOnMessageEdition_UnModified_ReplyAll', function () {
    // Login
    cy.loadTables('messaging/messaging_tables.sql')
    cy.login(HEADMASTER, messagingURL)
    waitMessagingToBeLoaded()
    const secondThread = this.messagingData.existingThreads[1]

    // Right click on first thread
    getThread(secondThread).rightclick()
    cy.get('[data-test="replyAll"]').click()

    cy.get('[data-test="createMessageModal"]').within(() => {
      // Close modal
      cy.get('[data-test="closeModal"]').click()
    })
    // Check if warning modal is not visible
    cy.get('[data-test="warning-modal"]').should('be.not.exist')
  })

  it('Messaging_DisplayWarningMessageOnMessageEdition_UnModified_Forward', function () {
    // Login
    cy.loadTables('messaging/messaging_tables.sql')
    cy.login(HEADMASTER, messagingURL)
    waitMessagingToBeLoaded()
    const secondThread = this.messagingData.existingThreads[1]

    // Right click on first thread
    getThread(secondThread).rightclick()
    cy.get('[data-test="forward"]').click()

    cy.get('[data-test="createMessageModal"]').within(() => {
      // Close modal
      cy.get('[data-test="closeModal"]').click()
    })
    // Check if warning modal is not visible
    cy.get('[data-test="warning-modal"]').should('be.not.exist')
  })

  it('Messaging_DisplayWarningMessageOnMessageEdition_UnModified_NewMessage', function () {
    // Login
    cy.loadTables('messaging/messaging_tables.sql')
    cy.login(HEADMASTER, messagingURL)
    waitMessagingToBeLoaded()

    // Click on new message
    cy.get('[data-test="createMessageButton"]').click()

    cy.get('[data-test="createMessageModal"]').within(() => {
      // Close modal
      cy.get('[data-test="closeModal"]').click()
    })
    // Check if warning modal is not visible
    cy.get('[data-test="warning-modal"]').should('be.not.exist')
  })
})
