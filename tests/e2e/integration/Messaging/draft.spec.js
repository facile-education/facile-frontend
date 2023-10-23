import { messagingURL } from '../../support/constants/urls'
import { HEADMASTER } from '../../support/constants/users'
import { getDraft, waitMessagingToBeLoaded } from '../../support/utils/messagingUtils'

describe('Draft', () => {
  beforeEach(() => {
    cy.fixture('messaging.json').as('messagingData')
  })

  context('desktop', function () {
    it.only('Messaging_SaveAsDraft', function () {
      cy.login(HEADMASTER, messagingURL)
      waitMessagingToBeLoaded()
      const existingDraftThreads = this.messagingData.existingDraftThreads

      cy.get('[data-test="createMessageButton"]').click()

      // write message
      cy.get('[data-test="createMessageModal"]').within(() => {
        cy.get('.base-tags-input').type('penelope')
        cy.get('.suggestion-list > li').last().click()
        cy.get('.group > [data-test="subject-input"]').type(existingDraftThreads[0][0].subject)
        cy.get('.ck-editor')
        cy.type_ckeditor(existingDraftThreads[0][0].content)

        // Save as draft
        cy.get('[data-test="draftButton"]').click()
      })

      // Check draft list
      cy.get('[data-test="option_toggleMessagingMenu"]').click()
      cy.get('[data-test="messaging-menu"]').contains('button', 'Brouillons').click()
      cy.get('.scroll').within(() => {
        getDraft(existingDraftThreads[0][0].subject)
      })
    })
    it.only('Messaging_EditDraft', function () {
    //   cy.loadTables('messaging/messaging_tables.sql')
      cy.login(HEADMASTER, messagingURL)
      waitMessagingToBeLoaded()

      cy.get('[data-test="option_toggleMessagingMenu"]').click()
      cy.get('[data-test="messaging-menu"]').contains('button', 'Brouillons').click()
    })
  })
  context('mobile', function () {
    beforeEach(function () {
      cy.viewport('iphone-5')
    })
  })
})
