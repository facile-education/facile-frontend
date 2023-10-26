const openContactPickerSelection = () => {
  cy.get('[data-test="createMessageButton"]').click()
  cy.get('[data-test="recipients-section"] > .base-button').click()
}

export {
  openContactPickerSelection
}
