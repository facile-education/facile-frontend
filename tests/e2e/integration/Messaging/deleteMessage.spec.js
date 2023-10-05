import { messagingURL } from '../../support/constants/urls'
import { HEADMASTER } from '../../support/constants/users'
import { getMessage, getThread, waitMessagingToBeLoaded } from '../../support/utils/messagingUtils'

describe('Delete message', () => {
  beforeEach(() => {
    cy.loadTables('messaging/messaging_tables.sql')
    cy.login(HEADMASTER, messagingURL)
    cy.fixture('messaging.json').as('messagingData') // Load in beforeEach to be accessible from 'this' in tests
    waitMessagingToBeLoaded()
  })

  it('delete thread', function () {
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
    cy.get('[data-test=context-menu]').contains('Supprimer').click().should('not.exist')
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
})
