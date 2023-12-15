import { messagingURL } from '../../support/constants/urls'
import { HEADMASTER, STUDENT } from '../../support/constants/users'
import { addFileFromWorkSpace, addPersonalFile } from '../../support/utils/dashboard'
import { getFileInMessage, getMessage, getThread, setMessagingDocumentLibrary, setRecipient, waitMessagingToBeLoaded } from '../../support/utils/messagingUtils'

describe('Draft', () => {
  beforeEach(() => {
    cy.fixture('messaging.json').as('messagingData')
  })

  context('desktop', function () {
    // Messaging_SaveAsDraft
    it('Messaging_SaveAsDraft', function () {
      cy.loadTables('messaging/messaging_tables_empty.sql')
      setMessagingDocumentLibrary()
      // Login
      cy.login(HEADMASTER, messagingURL)
      waitMessagingToBeLoaded()
      const draftToCreate = this.messagingData.draftToCreate[0]

      // Open modal create message
      cy.get('[data-test="createMessageButton"]').click()

      // Write message
      cy.get('[data-test="createMessageModal"]').within(() => {
        setRecipient(STUDENT)
        cy.get('.group > [data-test="subject-input"]').type(draftToCreate[0].subject)
        cy.type_ckeditor(draftToCreate[0].content)
      })
      // Attachments
      addPersonalFile(draftToCreate[0].attachedFile1)
      addFileFromWorkSpace()
      cy.get('[data-test="createMessageModal"]').within(() => {
        // Save as draft
        cy.get('[data-test="draftButton"]').click()
      })

      // Check draft list
      cy.get('[data-test="option_toggleMessagingMenu"]').click()
      cy.get('[data-test="messaging-menu"]').contains('button', 'Brouillons').click()
      cy.get('[data-test="threads-panel"]').within(() => {
        getThread(draftToCreate).should('be.exist').click()
      })
      getMessage(draftToCreate[0])
      // getMessage(draftToCreate).should('be.visible')
      getFileInMessage(draftToCreate[0], draftToCreate[0].attachedFile1)
      getFileInMessage(draftToCreate[0], draftToCreate[0].attachedFile2)
    })

    // Messaging_EditDraft
    it('Messaging_EditDraft', function () {
      // Login
      cy.loadTables('messaging/messaging_tables.sql')
      setMessagingDocumentLibrary()
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
        cy.type_ckeditor(ModifiedDraftContent[0].content)
        // Delete attached file
        cy.get('[data-test="attached-files-section"]').within(() => {
          cy.get('.attached-file').within(() => {
            cy.get('.remove-button').click()
          })
        })

        // Save as draft
        cy.get('[data-test="draftButton"]').click()
      })
      // Check draft modified
      cy.get('[data-test="threads-panel"]').within(() => {
        getThread(ModifiedDraftContent).should('be.exist')
      })
      cy.contains('[data-test="message"]', ModifiedDraftContent[0].content).within(() => {
        // Check if attachedFile is delete
        cy.contains('.attached-file').should('not.exist')
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

      // Check draft list
      cy.get('[data-test="threads-panel"]').within(() => {
        getThread(existingDraftThreads).should('be.exist')
      })
    })
  })
  it('Check modal edit draft mobile', () => {
    cy.viewport('iphone-5')
    cy.loadTables('messaging/messaging_tables.sql')

    // Login
    cy.login(HEADMASTER, messagingURL)
    waitMessagingToBeLoaded()

    // open mobile menu
    cy.get('.open-menu').click()
    // open draft menu
    cy.get('[data-test="messaging-menu"]').contains('button', 'Brouillon').click()
    // click on draft
    cy.get('[data-test="threads-panel"]').within(() => {
      cy.get('[data-test=thread-list-item]').first().click()
    })
    // open edit draft modal
    cy.get('[data-test="option_editDraft"]').click()
    // check if message modal is visible
    cy.get('[data-test="createMessageModal"]').should('be.visible')
  })
  // TO DO check options: forward, reply, replyAll are not visible in rightclick meuu
})
