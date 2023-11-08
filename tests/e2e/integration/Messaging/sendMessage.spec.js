import { messagingURL } from '../../support/constants/urls'
import { DOYEN, STUDENT, TEACHER } from '../../support/constants/users'
import { reloadThreadsAndFolders, waitMessagingToBeLoaded } from '../../support/utils/messagingUtils'

const lowerTextThenCapitalize = (string) => {
  let result = string
  result = result.toLowerCase()

  const arr = result.split(' ')

  // loop through each element of the array and capitalize the first letter.
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
  }

  // Join all the elements of the array back into a string
  // using a blankspace as a separator
  result = arr.join(' ')
  return result
}

const checkAndSelectThreadMessage = (message) => {
  cy.log('Check if the message was sent to ourself')
  cy.get('[data-test=option_refresh]').click()
  cy.get('[data-test=threads-panel]').get('.thread-list-item').should('have.length', 1)
    .first().as('message-thread')
    .should('contain', message.sender)
    .and('contain', message.subject)
    .and('contain', message.content)
    .within(() => {
      cy.get('[data-test=sent-date]').should('exist')
      cy.get('[data-test=unread-icon]').should('exist')
    }).click()
  cy.get('@message-thread').find('[data-test=unread-icon]').should('not.exist')
}

const checkMessageDetails = (message) => {
  cy.get('[data-test=messages-panel]').find('.message')
    .should('contain', message.subject)
    .and('contain', message.content)
    .within(() => {
      cy.get('.sender').should('contain', message.sender)
      cy.get('[data-test=sent-date]').should('exist')
      cy.get('.recipients-list')
        .should('contain', message.recipients[0])
        .and('contain', message.recipients[1])
        .and('contain', 'et un autre')
      cy.contains('Détails').click()
      cy.get('.recipients-list')
        .should('contain', message.recipients[0])
        .and('contain', message.recipients[1])
        .and('contain', message.recipients[2])
      cy.contains('Masquer').should('exist')
      // cy.contains('documentTest.txt')
    })
}

describe('Sending message', () => {
  beforeEach(() => {
    cy.loadTables('messaging/messaging_tables_empty.sql')
    cy.login(DOYEN, messagingURL)
    waitMessagingToBeLoaded()
  })

  it('sending modal form', () => {
    cy.get('[data-test=createMessageButton]').click()

    // Test modal closure
    cy.log('Test modal closure')
    cy.get('[data-test=createMessageModal]').should('exist')
    cy.get('[data-test=closeModal]').click()
    cy.get('[data-test=createMessageModal]').should('not.exist')

    cy.get('[data-test=createMessageButton]').click()

    // Test required fields
    cy.get('[data-test=createMessageModal]').as('createMessageModal').within(() => {
      cy.log('Test senders required fields')
      cy.contains('Envoyer').as('submitButton')
      cy.get('@submitButton').click()
      cy.get('.error-message').contains('Sélectionnez au moins un destinataire')
      // Type anything
      cy.get('[data-test=recipients-section]').find('input').as('recipients-input').type('013tzgrzg1')
      cy.get('@submitButton').click()
      cy.get('.error-message').contains('Sélectionnez au moins un destinataire')
      // Type and select user
      cy.get('@recipients-input').clear().type(DOYEN.firstName)
      cy.get('.suggestion-list').contains(lowerTextThenCapitalize(DOYEN.lastName + ' ' + DOYEN.firstName)).click()
      cy.get('@submitButton').click()
      cy.get('.error-message').should('not.exist')
    })

    // Test confirm-required fields
    cy.log('Test missing object warning')
    cy.get('[data-test=warning-modal]').within(() => {
      cy.contains('Annuler')
      cy.get('[data-test="confirmButton"]')
      // Close warning modal by the top cross
      cy.get('[data-test=closeModal]').click()
    })
    cy.get('[data-test=warning-modal]').should('not.exist')
    cy.get('@submitButton').click()
    // Close warning modal by the cancel button
    cy.get('[data-test=warning-modal]').contains('Annuler').click()
    cy.get('[data-test=warning-modal]').should('not.exist')
    cy.get('@submitButton').click()
    // Close warning modal by the confirm button
    cy.get('[data-test=warning-modal]').get('[data-test="confirmButton"]').click()
    cy.get('[data-test=warning-modal]').should('not.exist')
    cy.get('@createMessageModal').should('not.exist')
  })

  it('Messaging_SendNewMessage', () => {
    const message = {
      sender: DOYEN.firstName + ' ' + DOYEN.lastName,
      recipients: [DOYEN.firstName + ' ' + DOYEN.lastName, TEACHER.firstName + ' ' + TEACHER.lastName, STUDENT.firstName + ' ' + STUDENT.lastName],
      subject: 'Mon message de test',
      content: 'Mon contenu de message'
    }

    // Open create message modal
    cy.get('[data-test=createMessageButton]').click()

    // Select multiple recipients
    cy.log('Select multiple recipients')
    cy.get('[data-test=recipients-section]').find('input').as('recipients-input').type(DOYEN.firstName)
    cy.get('.suggestion-list').contains(lowerTextThenCapitalize(DOYEN.lastName + ' ' + DOYEN.firstName)).click()
    cy.get('@recipients-input').type(TEACHER.lastName)
    cy.get('.suggestion-list').contains(lowerTextThenCapitalize(TEACHER.lastName + ' ' + TEACHER.firstName)).click()
    cy.get('@recipients-input').type(STUDENT.lastName)
    cy.get('.suggestion-list').contains(lowerTextThenCapitalize(STUDENT.lastName + ' ' + STUDENT.firstName)).click()

    // Enter subject
    cy.log('Enter subject')
    cy.get('[data-test=subject-input]').find('input').type(message.subject)

    // Write content
    cy.log('Write content')
    cy.type_ckeditor(message.content) // Match the last instance of ckEditor

    // // Attachments
    // cy.contains('Ajouter une pièce jointe').click()
    // cy.get('[data-test=file-picker-modal]').within(() => {
    //   cy.contains('documentTest.txt').click()
    //   cy.contains('Ajouter').click()
    // })
    // cy.get('[data-test=file-picker-modal]').should('not.exist')

    // Send message
    cy.log('Send message')
    cy.get('[data-test=submitButton]').click()
    cy.get('[data-test=createMessageModal]').should('not.exist')

    // Check if the message was sent to ourself
    reloadThreadsAndFolders()
    checkAndSelectThreadMessage(message)
    checkMessageDetails(message)

    // Check if the message is in our sending box
    cy.get('[data-test=option_toggleMessagingMenu]').click()
    cy.get('[data-test=messaging-menu]').contains('Envoyés').click()
    cy.get('.header-label').should('contain', 'ENVOYÉS')
    cy.get('[data-test=threads-panel]').get('.thread-list-item').should('have.length', 1)
      .first().as('message-thread')
      .should('contain', message.sender)
      .and('contain', message.subject)
      .and('contain', message.content)

    // Check if the message was sent to student
    cy.login(STUDENT, messagingURL)
    waitMessagingToBeLoaded()
    checkAndSelectThreadMessage(message)
    checkMessageDetails(message)

    // Check if the message was sent to teacher
    cy.login(TEACHER, messagingURL)
    waitMessagingToBeLoaded()
    checkAndSelectThreadMessage(message)
    checkMessageDetails(message)
  })

  it('Save draft and send it', () => {
    const message = {
      sender: DOYEN.firstName + ' ' + DOYEN.lastName,
      recipients: [DOYEN.firstName + ' ' + DOYEN.lastName, TEACHER.firstName + ' ' + TEACHER.lastName, STUDENT.firstName + ' ' + STUDENT.lastName],
      subject: 'Mon message de test',
      content: 'Mon contenu de message'
    }

    // Open create message modal
    cy.get('[data-test=createMessageButton]').click()

    // Select multiple recipients
    cy.log('Select multiple recipients')
    cy.get('[data-test=recipients-section]').find('input').as('recipients-input').type(DOYEN.lastName)
    cy.get('.suggestion-list').contains(lowerTextThenCapitalize(DOYEN.lastName + ' ' + DOYEN.firstName)).click()
    cy.get('@recipients-input').type(TEACHER.lastName)
    cy.get('.suggestion-list').contains(lowerTextThenCapitalize(TEACHER.lastName + ' ' + TEACHER.firstName)).click()
    cy.get('@recipients-input').type(STUDENT.lastName)
    cy.get('.suggestion-list').contains(lowerTextThenCapitalize(STUDENT.lastName + ' ' + STUDENT.firstName)).click()

    // Enter subject
    cy.log('Enter subject')
    cy.get('[data-test=subject-input]').find('input').type(message.subject)

    // Write content
    cy.log('Write content')
    cy.type_ckeditor(message.content) // Match the last instance of ckEditor

    // Attachments
    // cy.contains('Ajouter une pièce jointe').click()
    // cy.get('[data-test=file-picker-modal]').within(() => {
    //   cy.contains('documentTest.txt').click()
    //   cy.contains('Ajouter').click()
    // })
    // cy.get('[data-test=file-picker-modal]').should('not.exist')

    cy.log('Save draft')
    cy.contains('Enregistrer en brouillon').click()
    cy.get('[data-test=createMessageModal]').should('not.exist')

    // Go to drafts
    cy.get('[data-test=option_toggleMessagingMenu]').click()
    cy.get('[data-test=messaging-menu]').contains('Brouillons').click()
    cy.wait(500)
    cy.get('[data-test=spinner]').should('not.exist')

    cy.get('[data-test=threads-panel]').get('.thread-list-item').first().click()
    cy.get('[data-test=option_editDraft]').click()
    cy.get('[data-test=createMessageModal]').find('[data-test=submitButton]').click()
    cy.get('[data-test=createMessageModal]').should('not.exist')

    // Check if the message was sent to ourself
    cy.get('[data-test=messaging-menu]').contains('Boîte de réception').click()
    cy.wait(500)
    cy.get('[data-test=spinner]').should('not.exist')
    checkAndSelectThreadMessage(message)
    checkMessageDetails(message)

    // Check if the message was sent to student
    cy.login(STUDENT, messagingURL)
    waitMessagingToBeLoaded()
    checkAndSelectThreadMessage(message)
    checkMessageDetails(message)

    // Check if the message was sent to teacher
    cy.login(TEACHER, messagingURL)
    waitMessagingToBeLoaded()
    checkAndSelectThreadMessage(message)
    checkMessageDetails(message)
  })
  it('Messaging_SendNewMessage_Modal_NewMessage_mobile', () => {
    cy.viewport('iphone-5')

    cy.login(STUDENT, messagingURL)
    waitMessagingToBeLoaded()

    // Click in create message button
    cy.get('[data-test="createMessageButton"]').click()
    // Check modal create message is visible
    cy.get('[data-test=createMessageModal]').should('be.visible')
  })
})
