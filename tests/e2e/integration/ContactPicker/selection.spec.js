import { messagingURL } from '../../support/constants/urls'
import { HEADMASTER, TEACHER, TEACHER2 } from '../../support/constants/users'
import { openContactPickerSelection } from '../../support/utils/contactPickerUtils'
import { getThread } from '../../support/utils/messagingUtils'

describe('Selection', () => {
  beforeEach(() => {
    cy.loadTables('messaging/messaging_tables.sql')
    cy.fixture('messaging.json').as('messagingData')
    cy.login(HEADMASTER, messagingURL)
  })
  // UserSelection_AddressBook_SelectAllResultUsers
  it('UserSelection_AddressBook_SelectAllResultUsers', function () {
    // Open contactPicker selection
    openContactPickerSelection()
    // Open list: "Personnels"
    cy.get('.address-book').contains('button', 'Personnels').click()
    // Click on teachers
    cy.get('.address-book').contains('button', 'Enseignants·tes').click()
    // Type "boas" in search bar because Boas Mitchell is in two different list
    cy.get('.group > .filter-input').type('boas')
    // Click on BOAS to add him in recipients
    cy.get('.user-list').contains('button', 'BOAS').click()
    // Check if BOAS Mithchell is add in recipient input
    cy.get('.base-tags-input').within(() => {
      cy.get('.tag-item').contains('BOAS Mitchell').should('be.exist')
    })
    // Check if img change to remove icon
    cy.get('.user-list').contains('button', 'BOAS').within(() => {
      cy.get('img').should('have.attr', 'alt').should('eq', 'Supprimer')
    })
    cy.get('.group > .filter-input').clear()
    // Click on "Doyens·ennes" to see this teacher in an other list
    cy.get('.address-book').contains('button', 'Doyens·ennes').click()
    // Check if img change
    cy.get('.user-list').contains('button', 'BOAS').within(() => {
      cy.get('img').should('have.attr', 'alt').should('eq', 'Supprimer')
    })
    // Click to remove "Boas"
    cy.get('.user-list').contains('button', 'BOAS').click()
    // Check if BOAS Mithchell is remove in recipient input
    cy.get('.base-tags-input').within(() => {
      cy.get('.tag-item').should('have.length', 0)
    })
    // Check if img change to add icon
    cy.get('.user-list').contains('button', 'BOAS').within(() => {
      cy.get('img').should('have.attr', 'alt').should('eq', 'Ajouter')
    })
  })

  // UserSelection_AddressBook_AddList
  it.only('UserSelection_AddressBook_AddList', function () {
    const MessageList = this.messagingData.ListMessage[0]
    // Open contactPicker selection
    openContactPickerSelection()
    // Open list: "Personnels"
    cy.get('.address-book').contains('button', 'Personnels').click()
    // Click on teachers
    cy.get('.address-book').contains('button', 'Enseignants·tes').click()
    // Type a teacher name in search bar
    cy.get('.group > .filter-input').type(TEACHER.lastName)
    // Click on teacher to add him in recipients
    cy.get('.user-list').contains('button', TEACHER.lastName).click()
    // Add teachers list in recipients
    cy.get('.address-book').contains('button', 'Enseignants·tes').within(() => {
      cy.get('button').click()
      // Check if img change to remove icon
      cy.get('img').should('have.attr', 'alt').should('eq', 'Supprimer')
    })
    // Check if teacher list is visible in recipients input
    cy.get('.base-tags-input').within(() => {
      cy.get('.tag-item').contains('Enseignants·tes').should('be.exist')
    })
    cy.get('[data-test="recipients-section"] > .base-button').click()
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
    cy.get('.scroll').within(() => {
      getThread(MessageList).should('have.length', 1)
    })
    // Login to an other teacher to see if he received message
    cy.login(TEACHER2, messagingURL)
    cy.get('.scroll').within(() => {
      getThread(MessageList).should('be.exist')
    })
  })
})
