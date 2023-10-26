const openContactPickerSelection = () => {
  cy.get('[data-test="createMessageButton"]').click()
  cy.get('[data-test="recipients-section"] > .base-button').click()
}

const openTeachersList = () => {
  cy.get('[data-test="createMessageButton"]').click()
  cy.get('[data-test="recipients-section"] > .base-button').click()
  // Open list: "Personnels"
  cy.get('.address-book').contains('button', 'Personnels').click()
  // Click on teachers
  cy.get('.address-book').contains('button', 'Enseignants·tes').click()
}

export {
  openContactPickerSelection,
  openTeachersList
}
