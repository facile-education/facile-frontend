import { messagingURL } from '../../support/constants/urls'
import { HEADMASTER, STUDENT } from '../../support/constants/users'
import { waitMessagingToBeLoaded } from '../../support/utils/messagingUtils'

describe('Messaging_TransferMessage', () => {
  beforeEach(() => {
    cy.loadTables('messaging/messaging_tables.sql')
    cy.fixture('messaging.json').as('messagingData')
  })
  context('desktop', function () {
    // Answer thread rightclick
    it('Messaging_TransferMessage', function () {
      const existingThreads = this.messagingData.existingThreads
      cy.login(HEADMASTER, messagingURL)
      waitMessagingToBeLoaded()
      cy.get('.scroll').within(() => {
        cy.get('[data-test="thread-list-item"]').first().click()
      })
      cy.get('[data-test="option_forward"]').click()
      cy.get('.window-container').within(() => {
        cy.get('.base-tags-input').type('penelope')
      })
      // cy.get('.suggestion-list').contains(`${STUDENT.lastName} ${STUDENT.firstName}`).parent()
      cy.get('.suggestion-list > li').last().click()
      cy.get('.footer').contains('button', 'Envoyer').click()

      cy.login(STUDENT, messagingURL)
      cy.get('[data-test="thread-list-item"]').contains(`Tr: ${existingThreads[3][0].subject}`).click()
    })
  })

  context('mobile', function () {
    beforeEach(function () {
      cy.viewport('iphone-5')
    })
  })
})
