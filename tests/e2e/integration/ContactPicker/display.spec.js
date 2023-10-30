import { messagingURL } from '../../support/constants/urls'
import { HEADMASTER } from '../../support/constants/users'
import { openTeachersList } from '../../support/utils/contactPickerUtils'

describe('UserSelection_AddressBook_DisplayCorrectLists', () => {
  beforeEach(() => {
    cy.fixture('contactPicker.json').as('contactPickerData')
  })
  it('UserSelection_AddressBook_DisplayCorrectLists', function () {
    const FirstTeacherInList = this.contactPickerData.firstTeacherInList
    // Check for an agent
    cy.login(HEADMASTER, messagingURL)
    openTeachersList()
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000)
    // Check if teachers list content is visible
    cy.get('.user-list-container').should('be.visible').contains('button', `${FirstTeacherInList.lastName} ${FirstTeacherInList.firstName}`).should('be.visible')
    cy.get('.address-book').scrollTo('bottom')
    cy.get('.address-book').contains('button', 'Classes').should('be.visible')
  })

  it('UserSelection_AddressBook_DisplayCorrectLists_mobile', function () {
    const FirstTeacherInList = this.contactPickerData.firstTeacherInList
    cy.viewport('iphone-5')
    // Check for an agent
    cy.login(HEADMASTER, messagingURL)
    openTeachersList()
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000)
    // Check if teachers list content is visible
    cy.get('.user-list-container').should('be.visible').contains('button', `${FirstTeacherInList.lastName} ${FirstTeacherInList.firstName}`).should('be.visible')
    cy.get('.user-list-header > :nth-child(1)').click()
    cy.get('.address-book').scrollTo('bottom')
    cy.get('.address-book').contains('button', 'Classes').should('be.visible')
  })
})
