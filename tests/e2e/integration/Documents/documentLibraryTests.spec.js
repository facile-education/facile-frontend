describe('Documents scripts', () => {
  it('empty the documentLibrary and database', () => {
    cy.exec('npm run dl:loadDocumentLibrary document_library_empty.tar.xz --save')
    // cy.exec('npm run db:loadTables documents_tables_basic.sql')
    // cy.clearDBCache()
  })
})
