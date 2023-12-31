const deleteAll = () => {
  cy.get('body').type('{ctrl}a')
  cy.get('body').type('{del}')
  cy.get('[data-test="warning-modal"]').get('[data-test="confirmButton"]').click()
  cy.get('[data-cy=document]').should('not.exist')
}

const createManualEntities = () => {
  // Create Folder
  cy.contains('button', 'NOUVEAU').click()
  cy.get('[data-test="context-menu"]').contains('Dossier').click()
  cy.get('[data-test=folder-name-modal]').within(() => {
    cy.get('input').type('createdFolder') // TODO tests form validation
    cy.contains('button', 'Créer').click()
  })
  cy.contains('[data-test=folder]', 'createdFolder').should('exist')

  // Create file
  cy.contains('button', 'NOUVEAU').click()
  cy.get('[data-test="context-menu"]').contains('Note').click()
  cy.get('[data-test=file-name-modal]').within(() => {
    cy.get('input').type('createdNote')
    cy.contains('button', 'Créer').click()
  })
  cy.get('[data-test=file-display-modal]', { timeout: 10000 }).within(() => {
    cy.get('[data-test="closeModal"]').click()
  })
  cy.contains('[data-test=file]', 'createdNote').should('exist')
}

describe.skip('Rename', () => {
  before(() => {
    cy.exec('npm run db:loadTables documents_tables_basic.sql')
    cy.clearDBCache()
    cy.login(url, HEADMASTER)

    deleteAll()
    // We must have real file in document library to get bytes for duplication
    createManualEntities()
  })

  it('Rename folder', () => {
    cy.contains('[data-test=folder]', 'createdFolder').rightclick()
    cy.get('[data-test="context-menu"]').contains('Renommer').click() // by context menu
    cy.get('[data-test=folder-name-modal]').within(() => {
      // Form validations
      cy.get('input').clear()
      // Should not be empty
      cy.contains('button', 'Renommer').click()
      cy.get('.error-message').should('exist')
      // Should not begin by a dot
      cy.get('input').clear().type('.something')
      cy.get('.error-message').should('exist')
      // Should not contains cotes
      cy.get('input').clear().type('"something"')
      cy.get('.error-message').should('exist')
      // Should be under 255 characters
      cy.get('input').clear().type('aaaaaaaaaavvvvvvvvvvtttttaaaaaaaaaavvvvvvvvvvtttttaaaaaaaaaavvvvvvvvvvtttttaaaaaaaaaavvvvvvvvvvtttttaaaaaaaaaavvvvvvvvvvtttttaaaaaaaaaavvvvvvvvvvtttttaaaaaaaaaavvvvvvvvvvtttttaaaaaaaaaavvvvvvvvvvtttttaaaaaaaaaavvvvvvvvvvtttttaaaaaaaaaavvvvvvvvvvtttttrrrrrr')
      cy.get('.error-message').should('exist')
      cy.get('input').clear().type('renamedFolder')
      cy.contains('button', 'Renommer').click()
    })
    cy.contains('[data-test=folder]', 'renamedFolder').should('exist')
    cy.get('[data-test=current-options]').contains('Renommer').click() // by option bar
    cy.get('[data-test=folder-name-modal]').within(() => {
      cy.get('input').type('renamedFolder2')
      cy.contains('button', 'Renommer').click()
    })
    cy.contains('[data-test=folder]', 'renamedFolder2').should('exist')
    // // TODO By F2 press
    // cy.globalKeyPress('{F2}')
    // cy.get('[data-test=folder-name-modal]').within(() => {
    //   cy.get('input').type('renamedFolder3')
    //   cy.contains('button', 'Renommer').click()
    // })
    // cy.contains('[data-test=folder]', 'renamedFolder2').should('exist')
  })

  it('Rename file', () => {
    cy.login(url, HEADMASTER)

    cy.contains('[data-test=file]', 'createdNote.html').rightclick()
    cy.get('[data-test="context-menu"]').contains('Renommer').click() // by context menu
    cy.get('[data-test=file-name-modal]').within(() => {
      cy.get('input').clear()
      // Should not be empty
      cy.contains('button', 'Renommer').click()
      cy.get('.error-message').should('exist')
      // Should not begin by a dot
      cy.get('input').clear().type('.something')
      cy.get('.error-message').should('exist')
      // Should not contains cotes
      cy.get('input').clear().type('"something"')
      cy.get('.error-message').should('exist')
      // Should be under 255 characters
      cy.get('input').clear().type('aaaaaaaaaavvvvvvvvvvtttttaaaaaaaaaavvvvvvvvvvtttttaaaaaaaaaavvvvvvvvvvtttttaaaaaaaaaavvvvvvvvvvtttttaaaaaaaaaavvvvvvvvvvtttttaaaaaaaaaavvvvvvvvvvtttttaaaaaaaaaavvvvvvvvvvtttttaaaaaaaaaavvvvvvvvvvtttttaaaaaaaaaavvvvvvvvvvtttttaaaaaaaaaavvvvvvvvvvtttttrrrrrr')
      cy.get('.error-message').should('exist')
      cy.get('input').clear().type('renamedfile')
      cy.contains('button', 'Renommer').click()
    })
    cy.contains('[data-test=file]', 'renamedfile.html').should('exist')
  })
})
