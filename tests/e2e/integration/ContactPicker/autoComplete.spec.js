import { messagingURL } from '../../support/constants/urls'
import { ACCOUNTING_CASHIER, HEADMASTER, LIBRARIAN, NURSE, ORIENTATION_COUNSELOR, PARENT, PSYCHOLOGIST, SECRETARY, SOCIAL_COUNSELOR, STUDENT, STUDENT_IN_CLASS, STUDENT_NOT_IN_CLASS, TECHNICAL_ASSISSTANT } from '../../support/constants/users'

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

  it.only('UserSelection_Autocomplete_Visibility_By_Profil', function () {
    const ContactsStudent = [ACCOUNTING_CASHIER, PARENT, HEADMASTER, LIBRARIAN, NURSE, ORIENTATION_COUNSELOR, PSYCHOLOGIST, SECRETARY, SOCIAL_COUNSELOR, TECHNICAL_ASSISSTANT, STUDENT_IN_CLASS, STUDENT_NOT_IN_CLASS]

    // STUDENT
    cy.login(STUDENT, messagingURL)
    cy.get('[data-test="createMessageButton"]').click()
    for (let i = 0; i < ContactsStudent.length - 1; i++) {
      cy.get('.base-tags-input').type(ContactsStudent[i].lastName)
      if (ContactsStudent[i].isVisibleStudent === true) {
        cy.get('.suggestion-list').contains(ContactsStudent[i].lastName).should('be.exist')
      } else {
        cy.get('.suggestion-list').contains(ContactsStudent[i].lastName).should('not.exist')
      }
      cy.focused().clear()
    }

    const ContactsParent = [ACCOUNTING_CASHIER, HEADMASTER, LIBRARIAN, STUDENT, NURSE, ORIENTATION_COUNSELOR, PSYCHOLOGIST, SECRETARY, SOCIAL_COUNSELOR, TECHNICAL_ASSISSTANT]

    // PARENT
    cy.login(PARENT, messagingURL)
    cy.get('[data-test="createMessageButton"]').click()
    for (let i = 0; i < ContactsParent.length - 1; i++) {
      cy.get('.base-tags-input').type(ContactsParent[i].lastName)
      if (ContactsParent[i].isVisibleParent === true) {
        cy.get('.suggestion-list').contains(ContactsParent[i].lastName).should('be.exist')
      } else {
        cy.get('.suggestion-list').contains(ContactsParent[i].lastName).should('not.exist')
      }
      cy.focused().clear()
    }

    const ContactsPersonnels = [ACCOUNTING_CASHIER, HEADMASTER, LIBRARIAN, STUDENT, NURSE, ORIENTATION_COUNSELOR, PSYCHOLOGIST, SECRETARY, SOCIAL_COUNSELOR, TECHNICAL_ASSISSTANT, PARENT, STUDENT_IN_CLASS, STUDENT_NOT_IN_CLASS]

    // HEADMASTER
    cy.login(HEADMASTER, messagingURL)
    cy.get('[data-test="createMessageButton"]').click()
    for (let i = 0; i < ContactsPersonnels.length - 1; i++) {
      cy.get('.base-tags-input').type(ContactsPersonnels[i].lastName)
      if (ContactsPersonnels[i].isVisibleParent === true) {
        cy.get('.suggestion-list').contains(ContactsPersonnels[i].lastName).should('be.exist')
      } else {
        cy.get('.suggestion-list').contains(ContactsPersonnels[i].lastName).should('not.exist')
      }
      cy.focused().clear()
    }
  })
})
