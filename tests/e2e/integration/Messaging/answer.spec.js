import { messagingURL } from '../../support/constants/urls'
import { HEADMASTER, STUDENT, TEACHER } from '../../support/constants/users'
import { addFileFromWorkSpace, addPersonalFile } from '../../support/utils/dashboard'
import { getFileInMessage, getMessage, getThread, setMessagingDocumentLibrary, waitMessagingToBeLoaded } from '../../support/utils/messagingUtils'

const allUserAnswer = {
  content: 'Ceci est un réponse à tous les utilisateurs',
  attachedFile1: 'note.html',
  attachedFile2: 'file.txt'
}

const userAnswer = {
  content: 'Ceci est un réponse à un seul utilisateur',
  attachedFile1: 'note.html',
  attachedFile2: 'file.txt'
}

describe('Messaging_Reply', () => {
  beforeEach(() => {
    cy.loadTables('messaging/messaging_tables.sql')
    cy.fixture('messaging.json').as('messagingData')
  })
  context('desktop', function () {
    it('Messaging_Reply_rightClick', function () {
      const existingThreads = this.messagingData.existingThreads
      // Send answer
      cy.login(HEADMASTER, messagingURL)
      waitMessagingToBeLoaded()
      getThread(existingThreads[3]).rightclick()
      cy.get('[data-test="reply"]').click()
      cy.get('[data-test="createMessageModal"]').within(() => {
        cy.get('.base-tags-input').within(() => {
          cy.get('.tag-item').contains(`${TEACHER.firstName} ${TEACHER.lastName}`).should('be.exist')
          cy.get('.tag-item').contains(`${STUDENT.firstName} ${STUDENT.lastName}`).should('not.exist')
        })
        cy.type_ckeditor(userAnswer.content)
        // Check content in summary
        cy.get('summary').click()
        cy.get('details > div > p').contains(existingThreads[3][0].content)
      })
      cy.get('.footer').contains('button', 'Envoyer').click()

      // Check answer
      cy.login(TEACHER, messagingURL)
      waitMessagingToBeLoaded()
      getThread(existingThreads[3]).click()
      getMessage(existingThreads[3][0])
    })

    it('Messaging_Reply_ReplyWithAttachedFiles', function () {
      setMessagingDocumentLibrary()
      const existingThreads = this.messagingData.existingThreads
      // Send answer
      cy.login(HEADMASTER, messagingURL)
      waitMessagingToBeLoaded()
      getThread(existingThreads[3]).rightclick()
      cy.get('[data-test="reply"]').click()
      cy.get('[data-test="createMessageModal"]').within(() => {
        cy.get('.base-tags-input').within(() => {
          cy.get('.tag-item').contains(`${TEACHER.firstName} ${TEACHER.lastName}`).should('be.exist')
          cy.get('.tag-item').contains(`${STUDENT.firstName} ${STUDENT.lastName}`).should('not.exist')
        })
        cy.type_ckeditor(userAnswer.content)
        // Check content in summary
        cy.get('summary').click()
        cy.get('details > div > p').contains(existingThreads[3][0].content)
      })
      // Attachments
      addPersonalFile(userAnswer.attachedFile1)
      addFileFromWorkSpace()
      cy.get('.footer').contains('button', 'Envoyer').click()

      // Check answer
      cy.login(TEACHER, messagingURL)
      waitMessagingToBeLoaded()
      getThread(existingThreads[3]).click()
      getMessage(userAnswer).should('be.visible')
      getFileInMessage(userAnswer, userAnswer.attachedFile1)
      getFileInMessage(userAnswer, userAnswer.attachedFile2)
    })

    it('Messaging_Reply_optionButton', function () {
      const existingThreads = this.messagingData.existingThreads
      // Send answer
      cy.login(HEADMASTER, messagingURL)
      waitMessagingToBeLoaded()
      getThread(existingThreads[3]).click()
      cy.get('[data-test="option_reply"]').click()
      cy.get('[data-test="createMessageModal"]').within(() => {
        cy.type_ckeditor(userAnswer.content)
      })
      cy.get('.footer').contains('button', 'Envoyer').click()
    })

    it('Messaging_ReplyAll_rightClick', function () {
      setMessagingDocumentLibrary()
      const existingThreads = this.messagingData.existingThreads
      cy.login(HEADMASTER, messagingURL)
      waitMessagingToBeLoaded()
      getThread(existingThreads[3]).rightclick()
      cy.get('[data-test="replyAll"]').click()
      cy.get('[data-test="createMessageModal"]').within(() => {
        cy.get('.base-tags-input').within(() => {
          cy.get('.tag-item').contains(`${TEACHER.firstName} ${TEACHER.lastName}`).should('be.exist')
          cy.get('.tag-item').contains(`${STUDENT.firstName} ${STUDENT.lastName}`).should('be.exist')
        })
        cy.type_ckeditor(allUserAnswer.content)
        // Check content in summary
        cy.get('summary').click()
        cy.get('details > div > p').contains(existingThreads[3][0].content)
      })
      // Attachments
      addPersonalFile(allUserAnswer.attachedFile1)
      addFileFromWorkSpace()
      // Send answer
      cy.get('.footer').contains('button', 'Envoyer').click()

      // Check answer first recipients
      cy.login(TEACHER, messagingURL)
      waitMessagingToBeLoaded()
      getThread(existingThreads[3]).click()
      getMessage(allUserAnswer).should('be.visible')
      getFileInMessage(allUserAnswer, allUserAnswer.attachedFile1)
      getFileInMessage(allUserAnswer, allUserAnswer.attachedFile2)

      // Check answer second recipients
      cy.login(STUDENT, messagingURL)
      waitMessagingToBeLoaded()
      getThread(existingThreads[3]).click()
      getMessage(allUserAnswer).should('be.visible')
      getFileInMessage(allUserAnswer, allUserAnswer.attachedFile1)
      getFileInMessage(allUserAnswer, allUserAnswer.attachedFile2)
    })

    it('Messaging_ReplyAll_optionButton', function () {
      const existingThreads = this.messagingData.existingThreads
      cy.login(HEADMASTER, messagingURL)
      waitMessagingToBeLoaded()
      getThread(existingThreads[3]).click()
      cy.get('[data-test="option_replyAll"]').click()
      cy.get('[data-test="createMessageModal"]').within(() => {
        cy.type_ckeditor(allUserAnswer.content)
      })
      cy.get('.footer').contains('button', 'Envoyer').click()
    })
  })

  context('mobile', function () {
    beforeEach(function () {
      cy.viewport('iphone-5')
    })
    it('Messaging_Reply_Modal_Mobile', function () {
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
