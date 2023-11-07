const setDocumentLibraryEmpty = () => {
  // TODO: Test if we can accelerate the process by being more rude on empty table content (mostly by deleting all 'Atelier de groupe' folders and linked assetEntry and resources permissions)
  cy.loadTables('documents/documents_tables_empty.sql')
  cy.exec('npm run dl:loadDocumentLibrary document_library_empty.tar.xz')
}

const setDocumentLibraryWithContent = () => {
  cy.loadTables('documents/documents_tables.sql')
  cy.exec('npm run dl:loadDocumentLibrary document_library.tar.xz')
}

const waitDocumentServiceToBeLoaded = () => {
  cy.get('h1[aria-label="Mes documents"]', { timeout: 10000 }).should('exist')
}

const selectAllEntities = () => {
  cy.get('body').type('{ctrl}a')
}

const unselectAllEntities = (nbEntitiesInCurrentFolder) => {
  cy.get('[data-test="select-all-toggle"]').click()
  cy.get('[data-cy=document] .selected').should('have.length', nbEntitiesInCurrentFolder)
  cy.get('[data-test="select-all-toggle"]').click()
  cy.get('[data-cy=document] .selected').should('have.length', 0)
}

export {
  setDocumentLibraryEmpty,
  setDocumentLibraryWithContent,
  selectAllEntities,
  unselectAllEntities,
  waitDocumentServiceToBeLoaded
}
