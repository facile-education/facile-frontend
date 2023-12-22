import { documentURL } from '../../support/constants/urls'
import { HEADMASTER } from '../../support/constants/users'
import { setDocumentLibraryWithContent, waitDocumentServiceToBeLoaded } from '../../support/utils/documents'
import { selectContextMenuOption } from '../../support/utils/testUtils'

const openDetailsPanelForDocument = (document) => {
  cy.contains('[data-cy=document]', document.label).rightclick()
  selectContextMenuOption('Détails')
}

describe('Documents_DetailsPanel', () => {
  const desktop = [1920, 1080]
  const sizes = ['iphone-5', 'ipad-2', desktop]

  before(() => {
    setDocumentLibraryWithContent()
  })

  beforeEach(() => {
    cy.fixture('documents.json').as('documentsData').then(documentsData => {
      console.log(documentsData)
      cy.login(HEADMASTER, documentURL)
      waitDocumentServiceToBeLoaded()
      // Wait entities to be loaded
      cy.get('[data-cy=document]').should('have.length', documentsData.currentPersonalDocumentsStructure.folders.length + documentsData.currentPersonalDocumentsStructure.files.length)
    })
  })

  sizes.forEach(function (size) {
    it.only(`Documents_DetailsPanel_DisplayCorrectlyFor[${size}]`, function () {
      const documentToOpenDetails = this.documentsData.currentPersonalDocumentsStructure.files[0]

      cy.viewport(size)

      openDetailsPanelForDocument(documentToOpenDetails)

      cy.get('[data-test="details-panel"]')
        .should('be.visible')
    })
  })

  it('Documents_DetailsPanel_CheckFileDetails', function () {
    // local
    // collaborative

  })

  it('Documents_DetailsPanel_CheckFolderDetails', function () {
    // local
    // collaborative
  })

  it('Documents_DetailsPanel_CheckMultiSelectionDetails', function () {

  })

  it('Documents_DetailsPanel_NoSelectionDetails', function () {

  })

  it('Documents_DetailsPanel_UpdateContentWithSelection', function () {

  })

  it('Documents_DetailsPanel_CheckBehaviourThroughNavigation', function () {

  })
})
