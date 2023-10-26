/* eslint-disable simple-import-sort/imports */
import { messagingURL } from '../../support/constants/urls'
import { HEADMASTER } from '../../support/constants/users'
import { openContactPickerSelection } from '../../support/utils/contactPickerUtils'

describe('UserSelection_OpenAdressBook', () => {
  beforeEach(() => {
    cy.fixture('messaging.json').as('messagingData')
    cy.login(HEADMASTER, messagingURL)
  })
  // UserSelection_OpenAdressBook'
  it('UserSelection_OpenAdressBook', function () {
    // Open contactPicker selection
    openContactPickerSelection()

    // Check if modal is visible
    cy.get('.contact-picker-tooltip').should('be.visible').within(() => {
      // open annuaire menu
      cy.get('.tabs').contains('li', 'Annuaire').click()
      // Check if annuaire menu is visible
      cy.get('.advanced-search').should('be.visible')
      // Check if adressBook menu is not visible
      cy.get('.address-book').should('not.exist')
    })
    // Close modal
    cy.get('[data-test="recipients-section"] > .base-button').click()
    // Check if modal is not visible
    cy.get('.contact-picker-tooltip').should('not.visible')
    // open the modal
    cy.get('[data-test="recipients-section"] > .base-button').click()
    cy.get('.contact-picker-tooltip').should('be.visible').within(() => {
      // Check if annuaire menu is visible
      cy.get('.advanced-search').should('be.visible')
      // Check if adressBook menu is not visible
      cy.get('.address-book').should('not.exist')
    })
  })

  // UserSelection_OpenAdressBook_mobile
  it('UserSelection_OpenAdressBook_mobile', function () {
    cy.viewport('iphone-5')
    // Open contactPicker selection
    openContactPickerSelection()

    // Check if modal is visible
    cy.get('[data-test="contactPickerModal"]').should('be.visible').within(() => {
      // open annuaire menu
      cy.get('.tabs').contains('li', 'Annuaire').click()
      // Check if annuaire menu is visible
      cy.get('.advanced-search').should('be.visible')
      // Check if adressBook menu is not visible
      cy.get('.address-book').should('not.exist')
    })
    // Close modal
    cy.get('[data-test="contactPickerModal"] > .resizable-component > .window-container > .window-header > .header-options > [data-test="closeModal"]').click()
    // Check if modal is not visible
    cy.get('.contact-picker-tooltip').should('not.visible')
    // open the modal
    cy.get('[data-test="recipients-section"] > .base-button').click()
    cy.get('[data-test="contactPickerModal"]').should('be.visible').within(() => {
      // Check if annuaire menu is visible
      cy.get('.advanced-search').should('be.visible')
      // Check if adressBook menu is not visible
      cy.get('.address-book').should('not.exist')
    })
  })
})
