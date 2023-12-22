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

const getFormattedSize = (size) => {
  if (Math.trunc(size / 1024) === 0) {
    return size + ' o'
  } else if ((Math.trunc(size / (1024 * 1024)) === 0)) {
    return Math.trunc(size / 1024) + ' ko'
  } else if ((Math.trunc(size / (1024 * 1024 * 1024)) === 0)) {
    return Math.trunc(size / (1024 * 1024)) + ' Mo'
  } else {
    return Math.trunc(size / (1024 * 1024 * 1024)) + ' Go'
  }
}

const goInFolder = (folder) => {
  cy.intercept('GET', '**/document.folderutils/get-all-entities**').as('getFolderContent')

  cy.contains('[data-test=folder]', folder.label).dblclick()

  cy.wait('@getFolderContent')

  cy.get('[data-cy=document]')
    .should('have.length', folder.folders.length + folder.files.length)
}

const goInCollaborativeFolder = (folder) => {
  cy.intercept('GET', '**/document.groups/get-group-entities**').as('getGroupFolderContent')

  cy.contains('[data-test=folder]', folder.label).dblclick()

  cy.wait('@getGroupFolderContent')

  cy.get('[data-cy=document]')
    .should('have.length', folder.folders.length + folder.files.length)
}

const toggleSelectionOnDocument = (document) => {
  cy.contains('[data-cy=document]', document.label).find('[data-test="selection-icon"]').click()
}

export {
  getFormattedSize,
  setDocumentLibraryEmpty,
  setDocumentLibraryWithContent,
  selectAllEntities,
  unselectAllEntities,
  waitDocumentServiceToBeLoaded,
  goInFolder,
  goInCollaborativeFolder,
  toggleSelectionOnDocument
}
