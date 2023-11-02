import { documentURL } from '../../support/constants/urls'
import { HEADMASTER } from '../../support/constants/users'
import { selectAllEntities, unselectAllEntities, waitDocumentServiceToBeLoaded } from '../../support/utils/documents'

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
  const desktop = [1920, 1080]
  const sizes = ['iphone-5', 'ipad-2', desktop]

  beforeEach(() => {
    // cy.exec('npm run dl:loadDocumentLibrary document_library_empty.tar.xz')
    // cy.loadTables('documents/documents_tables_empty.sql')
    cy.fixture('documents.json').as('documentsData').then(documentsData => {
      cy.viewport(1920, 1080) // Set large viewport to see all options directly
      cy.login(HEADMASTER, documentURL)
      waitDocumentServiceToBeLoaded()
      // Wait entities to be loaded
      cy.get('[data-cy=document]').should('have.length', documentsData.currentPersonalDocumentsStructure.folders.length + documentsData.currentPersonalDocumentsStructure.files.length)
    })
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

  it('Documents_SelectEntities_SelectAllEntities', function () {
    const currentEntities = this.documentsData.currentPersonalDocumentsStructure
    const nbEntitiesInCurrentFolder = currentEntities.folders.length + currentEntities.files.length

    cy.get('[data-cy=document] .selected').should('have.length', 0)

    // Select all with Ctrl+A
    cy.get('body').type('{ctrl}a')
    cy.get('[data-cy=document] .selected').should('have.length', nbEntitiesInCurrentFolder)

    // Unselect all with toggleAll button
    cy.get('[data-test="select-all-toggle"]').click()
    cy.get('[data-cy=document] .selected').should('have.length', 0)

    // Select one entity
    cy.contains('[data-test=folder]', currentEntities.folders[0].label).find('[data-test="selection-icon"]').click()
    cy.get('[data-cy=document] .selected').should('have.length', 1)

    // Select all with toggleAll button
    cy.get('[data-test="select-all-toggle"]').click()
    cy.get('[data-cy=document] .selected').should('have.length', nbEntitiesInCurrentFolder)
  })

  it('Documents_SelectEntities_KeyBoardSelection', function () {
    const currentEntities = this.documentsData.currentPersonalDocumentsStructure
    const nbEntitiesInCurrentFolder = currentEntities.folders.length + currentEntities.files.length

    // Shift selection without first selected document select from the first one
    cy.get('body').type('{shift}', { release: false })
    cy.contains('[data-test=file]', currentEntities.files[0].label).as('file1').click()
    cy.get('body').type('{shift}') // Release shift button
    // Check selected entities
    cy.contains('[data-test=folder]', currentEntities.folders[0].label).as('folder1').should('have.class', 'selected')
    cy.contains('[data-test=folder]', currentEntities.folders[1].label).as('folder2').should('have.class', 'selected')
    cy.get('@file1').should('have.class', 'selected')
    cy.contains('[data-test=file]', currentEntities.files[1].label).as('file2').should('not.have.class', 'selected')

    // Normal shift selection between two entities
    unselectAllEntities(nbEntitiesInCurrentFolder)
    cy.get('@file1').click()
    cy.get('body').type('{shift}', { release: false })
    cy.get('@folder1').click()
    cy.get('body').type('{shift}') // Release shift button
    // Check selected entities
    cy.contains('[data-test=folder]', currentEntities.folders[0].label).as('folder1').should('have.class', 'selected')
    cy.contains('[data-test=folder]', currentEntities.folders[1].label).as('folder2').should('have.class', 'selected')
    cy.get('@file1').should('have.class', 'selected')
    cy.contains('[data-test=file]', currentEntities.files[1].label).as('file2').should('not.have.class', 'selected')

    // Ctrl selection
    cy.get('body').type('{ctrl}', { release: false })
    cy.get('@file2').click()
    cy.get('@file2').should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', nbEntitiesInCurrentFolder)
    // Ctrl deselection
    cy.get('@file1').click()
    cy.get('@file1').should('not.have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', nbEntitiesInCurrentFolder - 1)
    cy.get('body').type('{ctrl}') // reset ctrl release

    // Arrows
    // Press the down arrow selects the first document
    unselectAllEntities(nbEntitiesInCurrentFolder)
    cy.get('body').type('{downarrow}')
    cy.get('[data-cy=document]').eq(0).should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)

    // Press the up arrow selects the last document
    unselectAllEntities(nbEntitiesInCurrentFolder)
    cy.get('body').type('{uparrow}')
    cy.get('[data-cy=document]').eq(nbEntitiesInCurrentFolder - 1).should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)

    // Select the before last document and test arrows
    cy.get('[data-cy=document]').eq(nbEntitiesInCurrentFolder - 2).click()
    cy.get('[data-cy=document]').eq(nbEntitiesInCurrentFolder - 2).should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)

    cy.get('body').type('{downarrow}')
    cy.get('[data-cy=document]').eq(nbEntitiesInCurrentFolder - 1).should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)
    cy.get('body').type('{downarrow}')
    cy.get('[data-cy=document]').eq(0).should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)
    cy.get('body').type('{uparrow}')
    cy.get('[data-cy=document]').eq(nbEntitiesInCurrentFolder - 1).should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)
    cy.get('body').type('{uparrow}')
    cy.get('[data-cy=document]').eq(nbEntitiesInCurrentFolder - 2).should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)
  })

  it('Documents_SelectEntities_ClickSelection', function () {
    const currentEntities = this.documentsData.currentPersonalDocumentsStructure

    // Click on empty selected list
    cy.contains('[data-test=file]', currentEntities.files[0].label).as('file1').click()
    cy.get('@file1').should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)

    // Click one entity selected list
    cy.contains('[data-test=file]', currentEntities.files[1].label).as('file2').click()
    cy.get('@file2').should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)

    // Click multiple entity selected list
    selectAllEntities()
    cy.get('@file2').click()
    cy.get('@file2').should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)
  })

  it('Documents_SelectEntities_SelectionIconBehaviour', function () {
    const currentEntities = this.documentsData.currentPersonalDocumentsStructure
    const nbEntitiesInCurrentFolder = currentEntities.folders.length + currentEntities.files.length

    // Click on empty selected list
    cy.contains('[data-test=file]', currentEntities.files[0].label).as('file1').find('[data-test="selection-icon"]').click()
    cy.get('@file1').should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)

    // Click one entity selected list
    cy.contains('[data-test=file]', currentEntities.files[1].label).as('file2').find('[data-test="selection-icon"]').click()
    cy.get('@file1').should('have.class', 'selected')
    cy.get('@file2').should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 2)

    // Click multiple entity selected list
    selectAllEntities()
    cy.get('@file2').find('[data-test="selection-icon"]').click()
    cy.get('@file2').should('not.have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', nbEntitiesInCurrentFolder - 1)
  })

  sizes.forEach(size => {
    it(`Documents_SelectEntities_SelectionIsPresentOn[${size}]`, function () {
      Cypress._.isArray(size) ? cy.viewport(size[0], size[1]) : cy.viewport(size)

      // Check toggle all option
      cy.get('[data-test="select-all-toggle"]').should('be.visible')

      // Check selection icon on document
      if (size === desktop) {
        cy.get('[data-cy=document]').eq(0).as('myDocument').find('[data-test="selection-icon"]>.oval').should('not.exist')
        cy.get('@myDocument').trigger('mouseover')
        cy.get('@myDocument').find('[data-test="selection-icon"]>.oval').should('be.visible')
      } else {
        cy.get('[data-cy=document]').eq(0).as('myDocument').find('[data-test="selection-icon"]>.oval').should('be.visible')
      }
    })
  })
})
