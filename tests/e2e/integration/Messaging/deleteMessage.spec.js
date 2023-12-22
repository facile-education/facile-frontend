import { messagingURL } from '../../support/constants/urls'
import { HEADMASTER } from '../../support/constants/users'
import { getMessage, getThread, waitMessagingToBeLoaded } from '../../support/utils/messagingUtils'
import { selectContextMenuOption } from '../../support/utils/testUtils'

describe('Delete message', () => {
  beforeEach(() => {
    cy.loadTables('messaging/messaging_tables.sql')
    cy.login(HEADMASTER, messagingURL)
    cy.fixture('messaging.json').as('messagingData') // Load in beforeEach to be accessible from 'this' in tests
    waitMessagingToBeLoaded()
  })

  it('Messaging_DeleteMessage', function () {
    const firstThread = this.messagingData.existingThreads[0]
    const secondThread = this.messagingData.existingThreads[2]
    const thirdThread = this.messagingData.existingThreads[3]
    const threadWithMultipleMessages = this.messagingData.existingThreads[1]
    const firstMessageInThreadToDelete = threadWithMultipleMessages[0]
    const secondMessageInThreadToDelete = threadWithMultipleMessages[1]

    cy.log('delete thread by delete key')
    getThread(firstThread).click()
    cy.globalKeyPress('{del}')
    getThread(firstThread).should('not.exist')

    cy.log('delete thread by context menu')
    getThread(secondThread).rightclick()
    selectContextMenuOption('Supprimer')
    getThread(secondThread).should('not.exist')

    cy.log('delete thread by trash icon')
    getThread(thirdThread).click()
    cy.get('[data-test=option_trash]').click()
    getThread(thirdThread).should('not.exist')

    cy.log('delete message in thread by delete key')
    getThread(threadWithMultipleMessages).click()
    getMessage(firstMessageInThreadToDelete).click()
      .parent().should('have.class', 'theme-shadow-color')
    cy.globalKeyPress('{del}')
    cy.get('[data-test=spinner]').should('not.exist')
    getMessage(firstMessageInThreadToDelete).should('not.exist')

    cy.log('delete message in thread by trash icon')
    getMessage(secondMessageInThreadToDelete).click()
      .parent().should('have.class', 'theme-shadow-color')
    cy.get('[data-test=option_trash]').click()
    cy.get('[data-test=spinner]').should('not.exist')
    getMessage(secondMessageInThreadToDelete).should('not.exist')
  })

  // Messaging_DeleteMessage_select_next_thread
  it('Messaging_DeleteMessage_select_next_thread', function () {
    const firstThread = this.messagingData.existingThreads[0]
    const secondThread = this.messagingData.existingThreads[2]
    const thirdThread = this.messagingData.existingThreads[3]
    const threadWithMultipleMessages = this.messagingData.existingThreads[1]

    // Delete first thread
    getThread(thirdThread).click()
    cy.globalKeyPress('{del}')
    // Check if first thread dosen't exist
    getThread(thirdThread).should('not.exist')
    // Check if next thread is selected
    getThread(secondThread).find('.main').should('have.class', 'theme-background-color')

    // Delete middle thread
    getThread(threadWithMultipleMessages).click()
    cy.globalKeyPress('{del}')
    // Check if middle thread dosen't exist
    getThread(threadWithMultipleMessages).should('not.exist')
    // Check if next thread is selected
    getThread(firstThread).find('.main').should('have.class', 'theme-background-color')
  })

  // Messaging_DeleteDefinitelyMessage
  it('Messaging_DeleteDefinitelyMessage', function () {
    const firstThread = this.messagingData.existingThreads[0]

    // delete first thread
    getThread(firstThread).click()
    cy.globalKeyPress('{del}')
    // Open menu
    cy.get('[data-test="option_toggleMessagingMenu"]').click()
    // Click on trash
    cy.get('[data-test="messaging-menu"]').contains('button', 'Corbeille').click()
    // Delete Definitely first thread
    getThread(firstThread).click()
    cy.globalKeyPress('{del}')
    // Check first thread not exist
    getThread(firstThread).should('not.exist')
  })

  // Messaging_Delete two Message
  it('Messaging_Delete_two_Messages', function () {
    const firstThread = this.messagingData.existingThreads[0]
    const secondThread = this.messagingData.existingThreads[2]

    cy.get('body').type('{ctrl}', { release: false })
    // Click on first thread
    getThread(firstThread).click()
    // Click on second thread
    getThread(secondThread).click()
    cy.get('body').type('{ctrl}', { release: true })
    // Delete first and second thread
    cy.globalKeyPress('{del}')
    getThread(firstThread).should('not.exist')
    getThread(secondThread).should('not.exist')
  })

  // Option delete mobile by trash icon
  it('Messaging_DeleteMessage_mobile_icon', function () {
    cy.viewport('iphone-5')
    // Click on first thread
    cy.get('[data-test="thread-list-item"]').first().click()
    // Check trash icon is visible
    cy.get('[data-test="option_trash"]').should('be.visible')
  })

  // Option delete mobile by multi-selection option
  it('Messaging_DeleteMessage_mobile_multi-selection', function () {
    cy.viewport('iphone-5')
    // Click on multi selection
    cy.get('[data-test="option_toggleMultiSelection"]').click()
    // Select first thread
    cy.get('[data-test="thread-list-item"]').first().click()
    // Open multi selection options
    cy.get('[data-test="option_options"]').click()
    // Check delete option is visible
    cy.get('[data-test="delete"]').should('be.visible')
  })
})
