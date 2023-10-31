import { messagingURL } from '../../support/constants/urls'
import { HEADMASTER, PARENT, STUDENT } from '../../support/constants/users'

describe('UserSelection_Autocomplete', () => {
  beforeEach(() => {
    cy.fixture('contactPicker.json').as('contactPickerData')
  })

  it('UserSelection_Autocomplete_caseSensitive', function () {
    // test autoCompletion
    cy.login(HEADMASTER, messagingURL)
    cy.get('[data-test="createMessageButton"]').click()

    cy.get('.base-tags-input').type('pen')
    cy.get('.suggestion-list').contains(`${STUDENT.lastName} ${STUDENT.firstName}`).should('be.exist')
    cy.focused().clear()
    cy.get('.base-tags-input').type(' pen')
    cy.get('.suggestion-list').contains(`${STUDENT.lastName} ${STUDENT.firstName}`).should('be.exist')
    cy.focused().clear()
    cy.get('.base-tags-input').type('pén')
    cy.get('.suggestion-list').contains(`${STUDENT.lastName} ${STUDENT.firstName}`).should('be.exist')
    cy.focused().clear()
    cy.get('.base-tags-input').type('Pen')
    cy.get('.suggestion-list').contains(`${STUDENT.lastName} ${STUDENT.firstName}`).should('be.exist')
    cy.focused().clear()
  })

  it('UserSelection_Autocomplete_Add_List', function () {
    cy.login(HEADMASTER, messagingURL)
    cy.get('[data-test="createMessageButton"]').click()

    cy.get('.base-tags-input').type('biblio')
    cy.get('.suggestion-list').contains('Bibliothécaires').should('be.exist')
  })

  it('UserSelection_Autocomplete_Visibility_By_Profil', function () {
    const Contacts = this.contactPickerData.Contacts

    // STUDENT
    cy.login(STUDENT, messagingURL)
    cy.get('[data-test="createMessageButton"]').click()
    for (let i = 0; i < Contacts.length - 1; i++) {
      cy.get('.base-tags-input').type(Contacts[i].lastName)
      if (Contacts[i].isVisibleStudent === true) {
        cy.get('.suggestion-list').contains(Contacts[i].lastName).should('be.exist')
      } else {
        cy.get('.suggestion-list').contains(Contacts[i].lastName).should('not.exist')
      }
      cy.focused().clear()
    }

    // PARENT
    cy.login(PARENT, messagingURL)
    cy.get('[data-test="createMessageButton"]').click()
    for (let i = 0; i < Contacts.length - 1; i++) {
      cy.get('.base-tags-input').type(Contacts[i].lastName)
      if (Contacts[i].isVisibleParent === true) {
        cy.get('.suggestion-list').contains(Contacts[i].lastName).should('be.exist')
      } else {
        cy.get('.suggestion-list').contains(Contacts[i].lastName).should('not.exist')
      }
      cy.focused().clear()
    }
  })
})
