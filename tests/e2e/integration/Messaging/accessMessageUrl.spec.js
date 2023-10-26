import { messagingURL } from '../../support/constants/urls'
import { HEADMASTER } from '../../support/constants/users'
import { getThread } from '../../support/utils/messagingUtils'

describe('Warning', () => {
  beforeEach(() => {
    cy.fixture('messaging.json').as('messagingData')
    cy.loadTables('messaging/messaging_tables.sql')
  })
  // Messaging_AccessMessageViaURL on desktop
  it('Messaging_AccessMessageViaURL', function () {
    const thirdThread = this.messagingData.existingThreads[2]
    const messageId = thirdThread[0].id
    // Login
    cy.login(HEADMASTER, `${messagingURL}/${messageId}`)

    // Check if thirdThread exist
    cy.get('[data-test="threads-panel"]').within(() => {
      getThread(thirdThread).should('be.exist')
    })
    // Check if just one thread is visible
    cy.get('[data-test="thread-list-item"]').should('have.length', 1)
  })

  // Messaging_AccessMessageViaURL on mobile
  it('Messaging_AccessMessageViaURL_Mobile', function () {
    cy.viewport('iphone-5')
    const thirdThread = this.messagingData.existingThreads[2]
    const messageId = thirdThread[0].id
    // Login
    cy.login(HEADMASTER, `${messagingURL}/${messageId}`)

    // Check if thirdThread exist
    cy.get('[data-test="threads-panel"]').within(() => {
      getThread(thirdThread).should('be.exist')
    })
    // Check if just one thread is visible
    cy.get('[data-test="thread-list-item"]').should('have.length', 1)
  })
})
