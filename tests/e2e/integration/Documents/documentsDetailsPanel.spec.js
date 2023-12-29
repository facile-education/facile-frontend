import { documentURL, groupDocUrl } from '../../support/constants/urls'
import { HEADMASTER } from '../../support/constants/users'
import {
  getFormattedSize,
  goInFolder,
  setDocumentLibraryWithContent,
  toggleSelectionOnDocument,
  waitDocumentServiceToBeLoaded
} from '../../support/utils/documents'
import { selectContextMenuOption } from '../../support/utils/testUtils'

const formattedDateInPanel = (strDate) => {
  return Cypress.dayjs(strDate, 'YYYY-MM-DD HH-mm').calendar()
}
const openDetailsPanelForDocument = (document) => {
  cy.contains('[data-cy=document]', document.label).rightclick()
  selectContextMenuOption('Détails')
}
const checkPanelContentForDocument = (document, isCollaborative = false) => {
  cy.get('[data-test="details-panel"]').within(() => {
    cy.get('header').should('contain', document.label)

    if (document.type) {
      cy.contains('.field', 'Type').should('contain', document.type)
    } else {
      cy.contains('.field', 'Type').should('not.exist') // some file have no supported type in application (archive .zip for example)
    }

    cy.contains('.field', 'Dernière modif.').should('contain', formattedDateInPanel(document.lastModifiedDate))

    if (isCollaborative && document.type === 'Dossier') { // TODO: Investigate if this logic is expected or not
      cy.contains('.field', 'Taille').should('contain', '-') // no size nor creation date for collaborative folders
      cy.contains('.field', 'Création').should('contain', '-')
    } else {
      cy.contains('.field', 'Taille').should('contain', getFormattedSize(document.size))
      cy.contains('.field', 'Création').should('contain', formattedDateInPanel(document.creationDate))
    }
  })
}

describe('Documents_DetailsPanel', () => {
  const desktop = [1920, 1080]
  const sizes = ['iphone-5', 'ipad-2', desktop]

  before(() => {
    setDocumentLibraryWithContent()
  })

  context('Local', () => {
    beforeEach(() => {
      cy.fixture('documents.json').as('documentsData').then(documentsData => {
        cy.login(HEADMASTER, documentURL)
        waitDocumentServiceToBeLoaded()
        // Wait entities to be loaded
        cy.get('[data-cy=document]').should('have.length', documentsData.currentPersonalDocumentsStructure.folders.length + documentsData.currentPersonalDocumentsStructure.files.length)
      })
    })

    sizes.forEach(function (size) {
      it(`Documents_DetailsPanel_DisplayAndCloseCorrectlyFor[${size}]`, function () {
        const documentToOpenDetails = this.documentsData.currentPersonalDocumentsStructure.files[0]

        cy.viewport(size)

        openDetailsPanelForDocument(documentToOpenDetails)

        cy.get('[data-test="details-panel"]')
          .should('be.visible')
          .find('button[aria-label="Fermer"]').click() // Close panel

        cy.get('[data-test="details-panel"]')
          .should('not.exist')
      })
    })

    it('Documents_DetailsPanel_CheckLocalFileDetails', function () {
      const localFile = this.documentsData.currentPersonalDocumentsStructure.files[0]

      openDetailsPanelForDocument(localFile)

      checkPanelContentForDocument(localFile)
    })

    it('Documents_DetailsPanel_CheckLocalFolderDetails', function () {
      const localFolder = this.documentsData.currentPersonalDocumentsStructure.folders[1]

      openDetailsPanelForDocument(localFolder)

      checkPanelContentForDocument(localFolder)
    })

    it('Documents_DetailsPanel_CheckMultiSelectionDetails', function () {
      const firstFile = this.documentsData.currentPersonalDocumentsStructure.files[0]
      const secondFile = this.documentsData.currentPersonalDocumentsStructure.files[1]

      openDetailsPanelForDocument(firstFile)

      // Select the second file in addition to the first
      toggleSelectionOnDocument(secondFile)

      cy.get('[data-test="details-panel"]').within(() => {
        cy.get('header').should('not.contain', firstFile.label)
        cy.get('header').should('contain', '2 documents sélectionnés')
        cy.get('[data-test="document-meta-data"]').should('not.exist')
      })
    })

    it('Documents_DetailsPanel_NoSelectionDetails', function () {
      const file = this.documentsData.currentPersonalDocumentsStructure.files[0]

      openDetailsPanelForDocument(file)

      // Unselect the file
      toggleSelectionOnDocument(file)

      cy.get('[data-test="details-panel"]').within(() => {
        cy.get('header').should('not.contain', document.label)
        cy.get('header').should('contain', 'Aucun document sélectionné')
        cy.get('[data-test="document-meta-data"]').should('not.exist')
        cy.contains('Il n\'y a aucune information à afficher').should('be.visible')
      })
    })

    it('Documents_DetailsPanel_UpdateContentWithSelection', function () {
      const firstFile = this.documentsData.currentPersonalDocumentsStructure.files[0]
      const secondFile = this.documentsData.currentPersonalDocumentsStructure.files[1]

      openDetailsPanelForDocument(firstFile)

      // Click on the second file
      cy.contains('[data-cy=document]', secondFile.label).click()

      toggleSelectionOnDocument(secondFile)
    })

    it('Documents_DetailsPanel_CheckBehaviourThroughNavigation', function () {
      const documentToOpenDetails = this.documentsData.currentPersonalDocumentsStructure.files[0]
      const folderToGoInside = this.documentsData.currentPersonalDocumentsStructure.folders[0]

      openDetailsPanelForDocument(documentToOpenDetails)

      cy.get('[data-test="details-panel"]')
        .should('be.visible')

      goInFolder(folderToGoInside)

      // The document panel is still visible but content is empty (=> ergonomic point to discuss?)
      cy.get('[data-test="details-panel"]').should('be.visible')
        .within(() => {
          cy.get('header').should('not.contain', document.label)
          cy.get('header').should('contain', 'Aucun document sélectionné')
          cy.get('[data-test="document-meta-data"]').should('not.exist')
          cy.contains('Il n\'y a aucune information à afficher').should('be.visible')
        })
    })
  })

  context('Collaborative', () => {
    beforeEach(() => {
      cy.fixture('documents.json').as('documentsData').then(documentsData => {
        const currentCollaborativeFolder = documentsData.currentCollaborativeStructure.spaces[0]

        cy.login(HEADMASTER, groupDocUrl + '/' + currentCollaborativeFolder.id)
        waitDocumentServiceToBeLoaded()
        // Wait groups to be loaded
        cy.get('[data-cy=document]').should('have.length', currentCollaborativeFolder.folders.length + currentCollaborativeFolder.files.length)
      })
    })

    it('Documents_DetailsPanel_CheckCollaborativeFileDetails', function () {
      const collaborativeFile = this.documentsData.currentCollaborativeStructure.spaces[0].files[0]

      openDetailsPanelForDocument(collaborativeFile)

      checkPanelContentForDocument(collaborativeFile, true)
    })

    it('Documents_DetailsPanel_CheckCollaborativeFolderDetails', function () {
      const collaborativeFolder = this.documentsData.currentCollaborativeStructure.spaces[0].folders[0]

      openDetailsPanelForDocument(collaborativeFolder)

      checkPanelContentForDocument(collaborativeFolder, true)
    })
  })
})
