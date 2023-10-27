import { messagingURL } from '../../support/constants/urls'
import { HEADMASTER, PARENT, STUDENT } from '../../support/constants/users'
import { openContactPickerSelection, openTeachersList } from '../../support/utils/contactPickerUtils'

describe('UserSelection_AddressBook', () => {
  beforeEach(() => {
    cy.fixture('contactPicker.json').as('contactPickerData')
  })

  it('UserSelection_AddressBook_SearchUser', function () {
    // Check for a student
    cy.login(STUDENT, messagingURL)
    openContactPickerSelection()
    cy.get('.tabs').should('not.exist')

    // Check for a parent
    cy.login(PARENT, messagingURL)
    openContactPickerSelection()
    cy.get('.tabs').should('not.exist')

    // Check for an agent
    cy.login(HEADMASTER, messagingURL)
    openTeachersList()
    // Check if teachers list is visible
    cy.get('.user-list-container').should('be.visible')
    // Check if tab "Annuaire" is visible and click it
    cy.get('.tabs').within(() => {
      cy.contains('li', 'Annuaire').should('be.exist').click()
    })

    // Try search user
    cy.get('.advanced-search > :nth-child(1) > .group > .labelled').type(STUDENT.firstName)
    cy.get('button').contains('Rechercher').click()
    // Check if user is find
    cy.get('.user-list-container').contains('li', STUDENT.firstName).should('be.exist')

    // Try filter
    cy.get('button').contains('Tous les profils').click()
    cy.get('.suggestion-list').contains('li', 'Bibliothécaire').click()
    cy.get('button').contains('Rechercher').click()
    // Check if user is not find
    cy.get('li').contains(`${STUDENT.lastName} ${STUDENT.firstName}`).should('not.exist')

    // Change tab
    cy.get('.tabs').within(() => {
      cy.contains('Carnet d\'adresses').click()
    })
    // Check if content is reset
    cy.get('.user-list-container').should('not.exist')
    // Change tab
    cy.get('.tabs').within(() => {
      cy.contains('li', 'Annuaire').click()
    })
    // Check if content is reset
    cy.get('.user-list-container').should('not.exist')
  })

  it('UserSelection_AddressBook_filterResultUser', function () {
    const FirstTeacherInList = this.contactPickerData.firstTeacherInList

    cy.login(HEADMASTER, messagingURL)
    openTeachersList()

    cy.get('.group > .filter-input').type('jack')
    cy.get('.user-list').contains('button', FirstTeacherInList.lastName).should('be.exist')
    cy.focused().clear()

    cy.get('.group > .filter-input').type(' jack')
    cy.get('.user-list').contains('button', FirstTeacherInList.lastName).should('be.exist')
    cy.focused().clear()

    cy.get('.group > .filter-input').type('JACK')
    cy.get('.user-list').contains('button', FirstTeacherInList.lastName).should('be.exist')
    cy.focused().clear()

    cy.get('.group > .filter-input').type('Jack')
    cy.get('.user-list').contains('button', FirstTeacherInList.lastName).should('be.exist')
    cy.focused().clear()

    cy.get('.group > .filter-input').type('Jàck')
    cy.get('.user-list').contains('button', FirstTeacherInList.lastName).should('be.exist')
    cy.focused().clear()
  })
})
