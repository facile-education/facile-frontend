import { messagingURL } from '../../support/constants/urls'
import { HEADMASTER, TEACHER, TEACHER2 } from '../../support/constants/users'
import { openContactPicker, openList } from '../../support/utils/contactPickerUtils'
import { getMessage, getThread } from '../../support/utils/messagingUtils'

describe('Selection', () => {
  beforeEach(() => {
    cy.loadTables('messaging/messaging_tables.sql')
    cy.fixture('contactPicker.json').as('contactPickerData')
    cy.fixture('messaging.json').as('messagingData')
    cy.login(HEADMASTER, messagingURL)
  })
  it('UserSelection_AddressBook_AddUserFromLists', function () {
    const userInTwoDifferentList = this.contactPickerData.userInTwoDifferentList
    // Open contactPicker
    openContactPicker()
    // Open teachers list
    openList('Enseignants·tes')
    // Type in search bar
    cy.get('.user-list').within(() => {
      // Click on teacher's name to add him in recipients
      cy.contains('button', userInTwoDifferentList.lastName).click()
    })

    // Check if this teacher is add in recipient input
    cy.get('[data-test="recipientsInput"]').within(() => {
      cy.get('.tag-item').contains(`${userInTwoDifferentList.lastName} ${userInTwoDifferentList.firstName}`).should('be.exist')
    })

    // Check if img change to remove icon
    cy.get('.user-list').contains('button', userInTwoDifferentList.lastName).within(() => {
      cy.get('img').should('have.attr', 'alt').should('eq', 'Supprimer')
    })

    // Click on "Doyens·ennes" to see this teacher in an other list
    cy.get('.address-book').contains('button', 'Doyens·ennes').click()

    // Check if img change
    cy.get('.user-list').contains('button', userInTwoDifferentList.lastName).within(() => {
      cy.get('img').should('have.attr', 'alt').should('eq', 'Supprimer')
    })

    // Click to remove
    cy.get('.user-list').contains('button', userInTwoDifferentList.lastName).click()
    // Check if BOAS Mithchell is remove in recipient input
    cy.get('[data-test="recipientsInput"]').within(() => {
      cy.get('.tag-item').should('have.length', 0)
    })

    // Check if img change to add icon
    cy.get('.user-list').contains('button', 'BOAS').within(() => {
      cy.get('img').should('have.attr', 'alt').should('eq', 'Ajouter')
    })
  })

  it('UserSelection_AddressBook_AddList', function () {
    const MessageList = this.messagingData.ListMessage[0]

    // Open contactPicker
    openContactPicker()
    // Open teachers list
    openList('Enseignants·tes')

    // Type a teacher name in search bar
    cy.get('.user-list').within(() => {
      // Click on teacher to add him in recipients
      cy.contains('button', TEACHER.lastName).click()
    })

    // Add teachers list in recipients
    cy.get('.address-book').contains('button', 'Enseignants·tes').within(() => {
      cy.get('button').click()
      // Check if img change to remove icon
      cy.get('img').should('have.attr', 'alt').should('eq', 'Supprimer')
    })

    // Check if teacher list is visible in recipients input
    cy.get('[data-test="recipientsInput"]').within(() => {
      cy.get('.tag-item').contains('Enseignants·tes').should('be.exist')
    })
    // Close contactPicker
    cy.get('.close-contact').click()

    // Write message content
    cy.get('[data-test="createMessageModal"]').within(() => {
      cy.get('.group > [data-test="subject-input"]').type(MessageList[0].subject)
      cy.get('.ck-editor')
      cy.type_ckeditor(MessageList[0].content)
      // Send message
      cy.get('[data-test="submitButton"]').click()
    })

    // Login to the teacher to see if he only received one message
    cy.login(TEACHER, messagingURL)
    cy.get('[data-test="threads-panel"]').within(() => {
      getThread(MessageList).should('have.length', 1).click()
    })
    getMessage(MessageList[0])
    // Login to an other teacher to see if he received message
    cy.login(TEACHER2, messagingURL)
    cy.get('[data-test="threads-panel"]').within(() => {
      getThread(MessageList).should('be.exist').click()
    })
    getMessage(MessageList[0])
  })

  it('UserSelection_AddressBook_SelectAllResultUsers', function () {
    const FirstTeacherInList = this.contactPickerData.firstTeacherInList

    // Open contactPicker
    openContactPicker()
    // Open teachers list
    openList('Enseignants·tes')
    // Add the first teacher
    cy.get('.user-list-container').within(() => {
      cy.get('[data-test="UserListItem"]').first().click()
    })
    // Check if this teacher his add in recipients input
    cy.get('[data-test="recipientsInput"]').within(() => {
      cy.get('.tag-item').contains(`${FirstTeacherInList.lastName} ${FirstTeacherInList.firstName}`).should('be.exist')
    })
    // Add all users in this list
    cy.get('[data-test="selectAllUsers"]').click()
    // Check if all users are in recipient input
    cy.get('[data-test="recipientsInput"]').within(() => {
      cy.get('.others').should('be.exist')
    })
    // Remove all users in this list
    cy.get('.user-list-header > button').click()
    // Check if all users and the alone teacher are remove from the recipient input
    cy.get('[data-test="recipientsInput"]').within(() => {
      cy.get('.others').should('not.exist')
      cy.get('.tag-item').should('not.exist')
    })
  })
})
