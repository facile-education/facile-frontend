import { messagingURL } from '../../support/constants/urls'
import { HEADMASTER, TEACHER } from '../../support/constants/users'
import { getMessage, getThread, waitMessagingToBeLoaded } from '../../support/utils/messagingUtils'

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
      getMessage(existingThreads[3][0]).first().contains(existingThreads[3][0].subject)
      getMessage(existingThreads[3][0]).contains(existingThreads[3][0].subject)
    })

    // Answer option button
    it.only('reply to a recipient option reply', function () {
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
      getMessage(existingThreads[3][0]).first().contains(existingThreads[3][0].subject)
      getMessage(existingThreads[3][0]).contains(existingThreads[3][0].subject)
    })

    // Answer all recipients thread right click
    it('reply to all recipients', () => {
      const messageAnswer = this.messagingData.existingThreads[3][0]
      cy.login(HEADMASTER, messagingURL)
      waitMessagingToBeLoaded()
      cy.get('.scroll').within(() => {
        cy.get('[data-test="thread-list-item"]').contains(messageAnswer.subject).rightclick()
      })
      cy.get('[data-test="replyAll"]').click()
      cy.get('.window-container').within(() => {
        cy.get('.ck-editor')
        cy.type_ckeditor(allUserAnswer)
      })
      cy.get('.footer').contains('button', 'Envoyer').click()

      // Check answer
    //   cy.login(TEACHER, messagingURL)
    //   waitMessagingToBeLoaded()
    //   cy.get('.scroll').within(() => {
    //     cy.get('[data-test="thread-list-item"]').contains(answerObject).click()
    //   })
    //   cy.get('[data-test="message"]').first().contains(answerObject)
    })
  })
})
