import { messagingURL } from '../../support/constants/urls'
import { HEADMASTER } from '../../support/constants/users'
import { openTeachersList } from '../../support/utils/contactPickerUtils'

describe('UserSelection_AddressBook_DisplayCorrectLists', () => {
  it('UserSelection_AddressBook_DisplayCorrectLists', function () {
    // Check for an agent
    cy.login(HEADMASTER, messagingURL)
    openTeachersList()
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000)
    cy.get('.address-book').scrollTo('bottom')
    cy.get('.address-book').contains('button', 'Classes').should('be.visible')
  })
})
