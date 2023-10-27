import { documentURL } from '../../support/constants/urls'
import { HEADMASTER } from '../../support/constants/users'

describe('Documents scripts', () => {
  it('empty the documentLibrary and database', () => {
    cy.exec('npm run dl:loadDocumentLibrary document_library_empty.tar.xz')
    cy.loadTables('documents/documents_tables_empty.sql')

    cy.login(HEADMASTER, documentURL)

    // Create Note
    cy.contains('button', 'NOUVEAU', { timeout: 10000 }).click()
    cy.get('[data-test="context-menu"]').contains('Note').click()
    cy.get('[data-test=file-name-modal]').within(() => {
      cy.get('input').type('createdNote')
      cy.contains('button', 'Créer').click()
    })
    cy.get('[data-test=file-display-modal]', { timeout: 10000 }).within(() => {
      cy.get('h1').should('contain', 'createdNote.html')
      cy.get('[data-test="closeModal"]').click()
    })
    cy.contains('[data-test=file]', 'createdNote').should('exist')

    cy.exec('npm run dl:loadDocumentLibrary document_library_empty.tar.xz')
    cy.loadTables('documents/documents_tables_empty.sql')

    cy.login(HEADMASTER, documentURL)
    cy.wait(10000)
    cy.contains('[data-test=file]', 'createdNote').should('not.exist')
  })
})
