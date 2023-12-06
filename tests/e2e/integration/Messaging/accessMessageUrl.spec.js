import { messagingURL } from '../../support/constants/urls'
import { HEADMASTER } from '../../support/constants/users'
import { getMessage, getThread } from '../../support/utils/messagingUtils'

describe('Messaging_AccessMessageViaURL', () => {
  beforeEach(() => {
    cy.fixture('messaging.json').as('messagingData')
    cy.loadTables('messaging/messaging_tables.sql')
  })

  it('Messaging_AccessMessageViaURL', function () {
    const thirdThread = this.messagingData.existingThreads[2]
    const messageId = thirdThread[0].id
    // Login
    cy.login(HEADMASTER, messagingURL)
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000)
    cy.login(HEADMASTER, `${messagingURL}/${messageId}`)
    // Check if thirdThread exist
    cy.get('[data-test="threads-panel"]').within(() => {
      getThread(thirdThread).should('be.exist')
    })
    getMessage(thirdThread[0]).should('be.exist')
    // Check if just one thread is visible
    cy.get('[data-test="thread-list-item"]').should('have.length', 1)
  })

  it('Messaging_AccessMessageViaURL_Refresh', function () {
    const thirdThread = this.messagingData.existingThreads[2]
    const messageId = thirdThread[0].id
    // Login
    cy.login(HEADMASTER, messagingURL)
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000)
    cy.login(HEADMASTER, `${messagingURL}/${messageId}`)
    // Check if just one thread is visible
    cy.get('[data-test="thread-list-item"]').should('have.length', 1)
    // Click on refresh icon
    cy.get('[data-test="option_refresh"]').click()
    cy.url().should('eq', 'https://dev-ent-gve.com/messagerie')
    // Check if all threads are visible
    cy.get('[data-test="thread-list-item"]').should('not.have.length', 1)
  })

  it('Messaging_AccessMessageViaURL_ChangeBox', function () {
    const thirdThread = this.messagingData.existingThreads[2]
    const messageId = thirdThread[0].id
    // Login
    cy.login(HEADMASTER, messagingURL)
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000)
    cy.login(HEADMASTER, `${messagingURL}/${messageId}`)
    // Check if just one thread is visible
    cy.get('[data-test="thread-list-item"]').should('have.length', 1)
    // Click on toggleMessagingMenu icon
    cy.get('[data-test="option_toggleMessagingMenu"]').click()
    // Go to trash
    cy.get('[data-test="messaging-menu"]').within(() => {
      cy.contains('button', 'Corbeille').click()
    })
    // Check if url changed
    cy.url().should('eq', 'https://dev-ent-gve.com/messagerie')
  })

  it('Messaging_AccessMessageViaURL_Mobile', function () {
    cy.viewport('iphone-5')
    const thirdThread = this.messagingData.existingThreads[2]
    const messageId = thirdThread[0].id
    // Login
    cy.login(HEADMASTER, messagingURL)
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000)
    cy.login(HEADMASTER, `${messagingURL}/${messageId}`)
    // Check if message panel is visible
    cy.get('[data-test=messages-panel]').should('be.visible')
    // Back to threads panel
    cy.get('[data-test="option_back"]').click()
    // Check if all threads are visible
    cy.get('[data-test="threads-panel"]').within(() => {
      getThread(thirdThread).should('be.exist')
      cy.get('[data-test="thread-list-item"]').should('have.length', 4)
    })
  })
})
