const openContactPicker = () => {
  cy.get('[data-test="createMessageButton"]', { timeout: 10000 }).click()
  cy.get('[data-test="recipients-section"] > .base-button').click()
}

const openList = (List) => {
  cy.get('.address-book').contains('button', 'Personnels').click()
  cy.get('.address-book').contains('button', `${List}`).click()
}

export {
  openContactPicker,
  openList
}
