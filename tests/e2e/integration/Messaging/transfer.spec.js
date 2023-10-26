import { messagingURL } from '../../support/constants/urls'
import { HEADMASTER, STUDENT } from '../../support/constants/users'
import { getMessage, getThread, setRecipient, waitMessagingToBeLoaded } from '../../support/utils/messagingUtils'

describe('Messaging_TransferMessage', () => {
  beforeEach(() => {
    cy.loadTables('messaging/messaging_tables.sql')
    cy.fixture('messaging.json').as('messagingData')
  })
  context('desktop', function () {
    // Answer thread rightclick
    it('Messaging_TransferMessage_icon', function () {
      const threadToTransfer = this.messagingData.existingThreads[3]

      // Login
      cy.login(HEADMASTER, messagingURL)
      waitMessagingToBeLoaded()

      // Click on first thread
      cy.get('[data-test="threads-panel"]').within(() => {
        getThread(threadToTransfer).click()
      })
      // Click on forward icon
      cy.get('[data-test="option_forward"]').click()

      // Set a new recipient
      cy.get('[data-test="createMessageModal"]').within(() => {
        setRecipient(STUDENT)
      })

      // Send
      cy.get('.footer').contains('button', 'Envoyer').click()

      // Login recipient
      cy.login(STUDENT, messagingURL)
      // Check if thread is exist
      cy.get('[data-test="thread-list-item"]').contains(`Tr: ${threadToTransfer[0].subject}`).should('be.exist')
    })
    it('Messaging_TransferMessage_rightClickMenu', function () {
      const threadToTransfer = this.messagingData.existingThreads[3]

      // Login
      cy.login(HEADMASTER, messagingURL)
      waitMessagingToBeLoaded()

      // Right click on first thread
      cy.get('[data-test="threads-panel"]').within(() => {
        getThread(threadToTransfer).rightclick()
      })
      // Click on forward in options menu
      cy.get('[data-test="forward"]').click()

      // Set a new recipient
      cy.get('[data-test="createMessageModal"]').within(() => {
        setRecipient(STUDENT)
      })

      // Send
      cy.get('.footer').contains('button', 'Envoyer').click()
    })

    it('Messaging_TransferThread', function () {
      const threadToTransfer = this.messagingData.existingThreads[1]

      // Login
      cy.login(HEADMASTER, messagingURL)
      waitMessagingToBeLoaded()

      // Click on first thread
      cy.get('[data-test="threads-panel"]').within(() => {
        getThread(threadToTransfer).click()
      })
      // Click on forward icon
      cy.get('[data-test="option_forward"]').click()

      // Set a new recipient
      cy.get('[data-test="createMessageModal"]').within(() => {
        setRecipient(STUDENT)
      })

      // Send
      cy.get('.footer').contains('button', 'Envoyer').click()

      // Login recipient
      cy.login(STUDENT, messagingURL)
      // Check if thread is exist
      cy.get('[data-test="thread-list-item"]').contains(`Tr: ${threadToTransfer[2].subject}`).should('be.exist').click()
      getMessage(threadToTransfer[2])
    })

    it.only('Messaging_TransferMessageInThread', function () {
      const threadToTransfer = this.messagingData.existingThreads[1]

      // Login
      cy.login(HEADMASTER, messagingURL)
      waitMessagingToBeLoaded()

      // Click on first thread
      cy.get('[data-test="threads-panel"]').within(() => {
        getThread(threadToTransfer).click()
      })
      // Click on message in thread
      getMessage(threadToTransfer[1]).click()
      // Click on forward icon
      cy.get('[data-test="option_forward"]').click()

      // Set a new recipient
      cy.get('[data-test="createMessageModal"]').within(() => {
        setRecipient(STUDENT)
      })

      // Send
      cy.get('.footer').contains('button', 'Envoyer').click()

      // Login recipient
      cy.login(STUDENT, messagingURL)
      // Check if thread is exist
      cy.get('[data-test="thread-list-item"]').contains(`Tr: ${threadToTransfer[1].subject}`).should('be.exist').click()
      getMessage(threadToTransfer[1])
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
