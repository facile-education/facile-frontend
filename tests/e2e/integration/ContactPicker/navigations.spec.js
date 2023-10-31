/* eslint-disable simple-import-sort/imports */
import { messagingURL } from '../../support/constants/urls'
import { HEADMASTER } from '../../support/constants/users'
import { openContactPicker, openList } from '../../support/utils/contactPickerUtils'

describe('UserSelection_OpenAdressBook', () => {
  beforeEach(() => {
    cy.fixture('messaging.json').as('messagingData')
    cy.login(HEADMASTER, messagingURL)
  })
  it('UserSelection_OpenAdressBook_Check_If_context_saved', function () {
    // Open contactPicker
    openContactPicker()

    // Check if contactPicker modal is visible
    cy.get('.contact-picker-tooltip').should('be.visible').within(() => {
      // open annuaire menu
      cy.get('.tabs').contains('li', 'Annuaire').click()
      // Check if annuaire menu is visible
      cy.get('.advanced-search').should('be.visible')
      // Check if adressBook menu is not visible
      cy.get('.address-book').should('not.exist')
    })
    // Close modal
    cy.get('.close-contact').click()
    // Check if contactPicker modal is not visible
    cy.get('.contact-picker-tooltip').should('not.visible')
    // open the modal
    cy.get('[data-test="openContactPicker"]').click()

    // Check if context is saved
    cy.get('.contact-picker-tooltip').should('be.visible').within(() => {
      // Check if annuaire menu is visible
      cy.get('.advanced-search').should('be.visible')
      // Check if adressBook menu is not visible
      cy.get('.address-book').should('not.exist')
    })
  })

  it('UserSelection_OpenAdressBook_CloseModal_Click_Out', function () {
    // Open contactPicker
    openContactPicker()
    cy.get('[data-test="createMessageModal"]').click({ force: true })
    cy.get('.contact-picker-tooltip').should('not.visible')
  })

  it('UserSelection_OpenAdressBook_Tabs_Navigation_ResetContext', function () {
    // Login
    cy.login(HEADMASTER, messagingURL)

    // Open contactPicker
    openContactPicker()
    // Open teachers list
    openList('Enseignants·tes')

    // Check if teachers list is visible
    cy.get('.user-list-container').should('be.visible')
    // Check if tab "Annuaire" is visible and click it
    cy.get('.tabs').within(() => {
      cy.contains('li', 'Annuaire').should('be.exist').click()
    })

    // Change tab
    cy.get('.tabs').within(() => {
      cy.contains('Carnet d\'adresses').click()
    })
    // Check if content is reset
    cy.get('.user-list-container').should('not.exist')
  })

  it('UserSelection_OpenAdressBook_Check_If_Context_NotSaved_Mobile', function () {
    cy.viewport('iphone-5')
    // Open contactPicker
    openContactPicker()

    // Check if contactPicker modal is visible
    cy.get('[data-test="contactPickerModal"]').should('be.visible').within(() => {
      // open annuaire menu
      cy.get('.tabs').contains('li', 'Annuaire').click()
      // Check if annuaire menu is visible
      cy.get('.advanced-search').should('be.visible')
      // Check if adressBook menu is not visible
      cy.get('.address-book').should('not.exist')
    })
    // Close modal
    cy.get('[data-test="contactPickerModal"]').within(() => {
      cy.get('[data-test="closeModal"]').click()
    })
    // Check if modal is not visible
    cy.get('.contact-picker-tooltip').should('not.visible')

    // Open contactPicker modal
    cy.get('[data-test="openContactPicker"]').click()
    // Check if context is not saved
    cy.get('[data-test="contactPickerModal"]').should('be.visible').within(() => {
      // Check if annuaire menu is not visible
      cy.get('.advanced-search').should('not.exist')
      // Check if adressBook menu is visible
      cy.get('.address-book').should('be.visible')
    })
  })
})
