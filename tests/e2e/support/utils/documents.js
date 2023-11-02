const waitDocumentServiceToBeLoaded = () => {
  cy.get('h1[aria-label="Mes documents"]', { timeout: 10000 }).should('exist')
}

const selectAllEntities = (nbEntitiesInCurrentFolder) => {
  cy.get('body').type('{ctrl}a')
}
const unselectAllEntities = (nbEntitiesInCurrentFolder) => {
  cy.get('[data-test="select-all-toggle"]').click()
  cy.get('[data-cy=document] .selected').should('have.length', nbEntitiesInCurrentFolder)
  cy.get('[data-test="select-all-toggle"]').click()
  cy.get('[data-cy=document] .selected').should('have.length', 0)
}

export {
  selectAllEntities,
  unselectAllEntities,
  waitDocumentServiceToBeLoaded
}
