import { documentURL } from '../../support/constants/urls'
import { HEADMASTER } from '../../support/constants/users'
import { waitDocumentServiceToBeLoaded } from '../../support/utils/documents'

const checkCurrentOptions = (options) => { // Assume context menu is open
  // Check document current options
  cy.get('[data-test="current-options"]').within(() => {
    cy.get('button').should('have.length', options.length + 1) // +1 for the context menu "New" option (to remove in next devs)
    options.forEach(option => {
      cy.contains(option).should('be.visible')
    })
  })

  // Check context menu options
  cy.get('[data-test=context-menu]').within(() => {
    cy.get('button').should('have.length', options.length + 1) // +1 for the context menu "New" option (to remove in next devs)
    options.forEach(option => {
      cy.contains(option).should('be.visible')
    })
  })
}

describe('Documents_SelectEntities', () => {
  beforeEach(() => {
    // cy.exec('npm run dl:loadDocumentLibrary document_library_empty.tar.xz')
    // cy.loadTables('documents/documents_tables_empty.sql')
    cy.fixture('documents.json').as('documentsData')

    cy.viewport(1920, 1080) // Set large viewport to see all options directly
    cy.login(HEADMASTER, documentURL)
    waitDocumentServiceToBeLoaded()
  })

  it('Documents_SelectEntities_CurrentOptionsMatchWithSelectedEntities', function () {
    const currentEntities = this.documentsData.currentPersonalDocumentsStructure

    // No options are available
    cy.get('[data-test="current-options"].option-item').should('have.length', 0)

    // Select one folder
    cy.contains('[data-test=folder]', currentEntities.folders[0].label).rightclick()
    checkCurrentOptions(this.documentsData.folderOptions)
    // Close context menu
    cy.get('body').click('topLeft')

    // Select one file
    cy.contains('[data-test=file]', currentEntities.files[0].label).rightclick()
    checkCurrentOptions(this.documentsData.fileOptions)
    // Close context menu
    cy.get('body').click('topLeft')

    // Select multiple entities (one folder and one file)
    cy.contains('[data-test=folder]', currentEntities.folders[0].label).find('[data-test="selection-icon"]').click()
    cy.contains('[data-test=folder]', currentEntities.folders[0].label).rightclick()
    cy.get('[data-cy=document] .selected').should('have.length', 2)
    checkCurrentOptions(this.documentsData.multiSelectionOptions)
    // Close context menu
    cy.get('body').click('topLeft')

    // Unselect all entities
    cy.contains('[data-test=folder]', currentEntities.folders[0].label).find('[data-test="selection-icon"]').click()
    cy.contains('[data-test=file]', currentEntities.files[0].label).find('[data-test="selection-icon"]').click()
    cy.get('[data-cy=document] .selected').should('have.length', 0)
    cy.get('[data-test="current-options"].option-item', { timeout: 10000 }).should('have.length', 0)
  })

  it('keyBoard selection', () => {
    // Check folder content
    cy.get('[data-cy=document]').should('have.length', 4)

    // CTRL + A
    cy.get('body').type('{ctrl}a')
    cy.get('[data-cy=document] .selected').should('have.length', 4)

    // Simple selection
    cy.contains('[data-test=file]', 'fichier1_1.html').click().should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)

    // Ctrl selection
    cy.get('body').type('{ctrl}', { release: false })
    cy.contains('[data-test=folder]', 'dossier1_1').click().should('have.class', 'selected')
    cy.contains('[data-test=file]', 'fichier1_1.html').should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 2)
    // Ctrl deselection
    cy.contains('[data-test=file]', 'fichier1_1.html').click().should('not.have.class', 'selected')
    cy.contains('[data-test=folder]', 'dossier1_1').should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)

    // Simple selection
    cy.get('body').type('{ctrl}') // reset ctrl release
    cy.contains('[data-test=file]', 'fichier1_1.html').click().should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)

    // Shift selection
    cy.get('body').type('{shift}', { release: false })
    cy.contains('[data-test=folder]', 'dossier1_1').click().should('have.class', 'selected')
    cy.contains('[data-test=folder]', 'dossier1_2').should('have.class', 'selected')
    cy.contains('[data-test=file]', 'fichier1_1.html').should('have.class', 'selected')
    cy.contains('[data-test=file]', 'fichier1_2.html').should('not.have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 3)

    // Arrows
    cy.get('body').type('{ctrl}') // reset ctrl release
    cy.contains('[data-test=file]', 'fichier1_1.html').click().should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)

    cy.get('body').type('{downarrow}')
    cy.get('[data-cy=document]').eq(3).should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)
    cy.get('body').type('{downarrow}')
    cy.get('[data-cy=document]').eq(0).should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)
    cy.get('body').type('{uparrow}')
    cy.get('[data-cy=document]').eq(3).should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)
    cy.get('body').type('{uparrow}')
    cy.get('[data-cy=document]').eq(2).should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)
  })
})
