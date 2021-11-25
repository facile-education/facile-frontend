const createFromNewButtonMenu = (itemToCreate, expectedLength) => {
  cy.contains('button', 'NOUVEAU').click()
  cy.get('[data-test=create-menu] > .create-menu-item').should('have.length', expectedLength)
    .contains(itemToCreate).click()
}

const selectTreeItem = (itemName) => {
  cy.get('.tree').contains(itemName).click()
}

export {
  createFromNewButtonMenu,
  selectTreeItem
}
