import { messagingURL } from '../../support/constants/urls'
import { HEADMASTER, STUDENT, TEACHER } from '../../support/constants/users'
import { getThread, waitMessagingToBeLoaded } from '../../support/utils/messagingUtils'

const userAnswer = 'Ceci est un réponse à un seul utilisateur'
const allUserAnswer = 'Ceci est un réponse à tous les utilisateurs'

describe('Answer', () => {
  beforeEach(() => {
    cy.loadTables('messaging/messaging_tables.sql')
    cy.fixture('messaging.json').as('messagingData')
  })
  context('desktop', function () {
    // Answer thread rightclick
    it('reply to a recipient thread right click', function () {
      const existingThreads = this.messagingData.existingThreads
      // Send answer
      cy.login(HEADMASTER, messagingURL)
      waitMessagingToBeLoaded()
      getThread(existingThreads[3]).rightclick()
      cy.get('[data-test="reply"]').click()
      cy.get('[data-test="createMessageModal"]').within(() => {
        cy.get('.ck-editor')
        cy.type_ckeditor(userAnswer)
      })
      cy.get('.footer').contains('button', 'Envoyer').click()

      // Check answer
      cy.login(TEACHER, messagingURL)
      waitMessagingToBeLoaded()
      getThread(existingThreads[3]).click()
      cy.get('.message-list').within(() => {
        cy.get('[data-test="message"]').first().contains(userAnswer)
        cy.get('[data-test="message"]').first().contains(existingThreads[3][0].subject)
      })
    })

    // Answer option button
    it('reply to a recipient option reply', function () {
      const existingThreads = this.messagingData.existingThreads
      // Send answer
      cy.login(HEADMASTER, messagingURL)
      waitMessagingToBeLoaded()
      getThread(existingThreads[3]).click()
      cy.get('[data-test="option_reply"]').click()
      cy.get('[data-test="createMessageModal"]').within(() => {
        cy.get('.ck-editor')
        cy.type_ckeditor(userAnswer)
      })
      cy.get('.footer').contains('button', 'Envoyer').click()

      // Check answer
      cy.login(TEACHER, messagingURL)
      waitMessagingToBeLoaded()
      getThread(existingThreads[3]).click()
      cy.get('.message-list').within(() => {
        cy.get('[data-test="message"]').first().contains(userAnswer)
        cy.get('[data-test="message"]').first().contains(existingThreads[3][0].subject)
      })
    })

    // Answer all recipients thread right click
    it('reply to all recipients thread right click', function () {
      const existingThreads = this.messagingData.existingThreads
      cy.login(HEADMASTER, messagingURL)
      waitMessagingToBeLoaded()
      getThread(existingThreads[3]).rightclick()
      cy.get('[data-test="replyAll"]').click()
      cy.get('[data-test="createMessageModal"]').within(() => {
        cy.get('.ck-editor')
        cy.type_ckeditor(allUserAnswer)
      })
      cy.get('.footer').contains('button', 'Envoyer').click()

      // Check answer first recipients
      cy.login(TEACHER, messagingURL)
      waitMessagingToBeLoaded()
      getThread(existingThreads[3]).click()
      cy.get('.message-list').within(() => {
        cy.get('[data-test="message"]').first().contains(allUserAnswer)
        cy.get('[data-test="message"]').first().contains(existingThreads[3][0].subject)
      })

      // Check answer second recipients
      cy.login(STUDENT, messagingURL)
      waitMessagingToBeLoaded()
      getThread(existingThreads[3]).click()
      cy.get('.message-list').within(() => {
        cy.get('[data-test="message"]').first().contains(allUserAnswer)
        cy.get('[data-test="message"]').first().contains(existingThreads[3][0].subject)
      })
    })

    // Answer all recipients option button
    it('reply to all recipients option button', function () {
      const existingThreads = this.messagingData.existingThreads
      cy.login(HEADMASTER, messagingURL)
      waitMessagingToBeLoaded()
      getThread(existingThreads[3]).click()
      cy.get('[data-test="option_replyAll"]').click()
      cy.get('[data-test="createMessageModal"]').within(() => {
        cy.get('.ck-editor')
        cy.type_ckeditor(allUserAnswer)
      })
      cy.get('.footer').contains('button', 'Envoyer').click()

      // Check answer first recipients
      cy.login(TEACHER, messagingURL)
      waitMessagingToBeLoaded()
      getThread(existingThreads[3]).click()
      cy.get('.message-list').within(() => {
        cy.get('[data-test="message"]').first().contains(allUserAnswer)
        cy.get('[data-test="message"]').first().contains(existingThreads[3][0].subject)
      })

      // Check answer second recipients
      cy.login(STUDENT, messagingURL)
      waitMessagingToBeLoaded()
      getThread(existingThreads[3]).click()
      cy.get('.message-list').within(() => {
        cy.get('[data-test="message"]').first().contains(allUserAnswer)
        cy.get('[data-test="message"]').first().contains(existingThreads[3][0].subject)
      })
    })
  })

  context('mobile', function () {
    beforeEach(function () {
      cy.viewport('iphone-5')
    })
    it('check answer modale on mobile', function () {
      cy.login(HEADMASTER, messagingURL)
      waitMessagingToBeLoaded()
      cy.get('[data-test="thread-list-item"]').first().click()
      // Check reply option button
      cy.get('[data-test="option_reply"]').click()
      cy.get('[data-test="createMessageModal"]').should('be.visible').within(() => {
        cy.get('[data-test="closeModal"]').click()
      })
      // Check all reply option button
      cy.get('[data-test="option_replyAll"]').click()
      cy.get('[data-test="createMessageModal"]').should('be.visible')
    })
  })
})