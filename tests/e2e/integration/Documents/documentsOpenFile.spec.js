import { documentURL } from '../../support/constants/urls'
import { HEADMASTER } from '../../support/constants/users'
import { setDocumentLibraryWithContent, waitDocumentServiceToBeLoaded } from '../../support/utils/documents'

const checkFileDisplayModal = (openFile) => {
  cy.get('[data-test="file-display-modal"]').should('be.visible').and('contain', openFile.label)
}

before(() => {
  setDocumentLibraryWithContent()
})

describe('Documents_OpenFileDisplayModal', () => {
  const mobileSizes = ['iphone-5', 'ipad-2']
  let currentFolder

  beforeEach(() => {
    cy.fixture('documents.json').as('documentsData').then(documentsData => {
      const folderWithDocSamples = documentsData.currentPersonalDocumentsStructure.folders[1]
      currentFolder = folderWithDocSamples
      cy.login(HEADMASTER, documentURL + '/' + folderWithDocSamples.id)

      waitDocumentServiceToBeLoaded()
      // Wait entities to be loaded
      cy.get('[data-cy=document]').should('have.length', currentFolder.folders.length + currentFolder.files.length)
    })
  })

  it('Documents_OpenFile_DblClickOnFileDesktop', function () {
    const fileToOpen = currentFolder.files[0]

    // Not open File on simple click
    cy.contains('[data-test=file]', fileToOpen.label).as('fileToOpen').click()
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(200)
    cy.get('@fileToOpen').should('be.visible')
      .and('have.class', 'selected')
    cy.get('[data-test="file-display-modal"]').should('not.exist')

    // Open file on dbl click
    cy.get('@fileToOpen').dblclick()

    checkFileDisplayModal(fileToOpen)
  })

  mobileSizes.forEach(size => {
    it.only(`Documents_OpenFile_SimpleClickOnFileOn[${size}]`, function () {
      cy.viewport(size)

      const fileToOpen = currentFolder.files[0]

      cy.contains('[data-test=file]', fileToOpen.label).within(() => {
        cy.contains('.name', fileToOpen.label).click()
      })

      checkFileDisplayModal(fileToOpen)
    })
  })

  it('Documents_OpenFile_ClickOnFileTitle', function () {
    const fileToOpen = currentFolder.files[0]

    cy.contains(fileToOpen.label).click()

    checkFileDisplayModal(fileToOpen)
  })

  it('Documents_OpenFile_KeyBoardNavigation', function () {
    const fileToOpen = currentFolder.files[0]

    // Select many files
    cy.contains('[data-test="file"]', fileToOpen.label).click()
    cy.contains('[data-test="file"]', currentFolder.files[1].label).find('[data-test="selection-icon"]').click()
    cy.get('[data-cy=document] .selected').should('have.length', 2)

    cy.get('body').type('{enter}') // Nothing should append because of the multi-selection
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(200)
    cy.get('[data-test="file-display-modal"]').should('not.exist')

    // Select only one file
    cy.contains('[data-test="file"]', fileToOpen.label).click()
    cy.get('[data-cy=document] .selected').should('have.length', 1)

    cy.get('body').type('{enter}')
    checkFileDisplayModal(fileToOpen)
  })

  it('Documents_OpenFile_ClickOnContextMenuOption', function () {
    const fileToOpen = currentFolder.files[0]

    cy.contains('[data-test="file"]', fileToOpen.label).rightclick()
    cy.get('[data-test="context-menu"]').contains('li', 'Ouvrir').click()

    checkFileDisplayModal(fileToOpen)
  })

  it('Documents_OpenFile_ClickOnCurrentOptionsOption', function () {
    const fileToOpen = currentFolder.files[0]

    cy.contains('[data-test="file"]', fileToOpen.label).click()
    cy.get('[data-test="current-options"]').contains('button', 'Ouvrir').click()

    checkFileDisplayModal(fileToOpen)
  })
})

describe('Documents_FileDisplayModalInFullScreen', () => {
  const mobile = [375, 667]
  const tablet = [768, 1024]
  const desktop = [1920, 1080]
  const sizes = [mobile, tablet, desktop]

  let currentFolder

  beforeEach(() => {
    cy.fixture('documents.json').as('documentsData').then(documentsData => {
      const folderWithDocSamples = documentsData.currentPersonalDocumentsStructure.folders[1]
      currentFolder = folderWithDocSamples
      cy.login(HEADMASTER, documentURL + '/' + folderWithDocSamples.id)

      waitDocumentServiceToBeLoaded()
      // Wait entities to be loaded
      cy.get('[data-cy=document]').should('have.length', currentFolder.folders.length + currentFolder.files.length)
    })
  })

  sizes.forEach(size => {
    it(`Documents_OpenFile_DisplayFileInFullScreenOn[${size}]`, function () {
      cy.viewport(size[0], size[1])
      const fileToOpen = currentFolder.files[0]

      // Open FileDisplayModal
      cy.contains(fileToOpen.label).click()
      cy.get('[data-test="file-display-modal"] .resizable-component').as('fileModal').should('be.visible')

      // Toggle full screen option is visible
      if (size === mobile) {
        cy.get('@fileModal').find('[data-test="toggleFullScreen"]').should('not.exist')
      } else {
        cy.get('@fileModal').find('[data-test="toggleFullScreen"]').should('be.visible')
      }

      // Check if modal is open in fullScreen
      cy.get('@fileModal').invoke('css', 'width')
        .then(str => parseInt(str)).should('be.gte', size[0] - 1).and('be.lte', size[0] + 1) // Accept 1 pixel tolerance
      cy.get('@fileModal').invoke('css', 'height')
        .then(str => parseInt(str)).should('be.gte', size[1] - 1).and('be.lte', size[1] + 1)

      // Test if modal still in fullscreen after orientation change on mobile devices
      if (size !== desktop) {
        cy.viewport(size[1], size[0])

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(200) // To let the watcher have time to listen resize because following instructions does not trigger the following should time out behaviour...  // TODO: find an other way

        // Check if modal is open in fullScreen
        cy.get('@fileModal').invoke('css', 'width')
          .then(str => parseInt(str)).should('be.gte', size[1] - 1).and('be.lte', size[1] + 1) // Accept 1 pixel tolerance
        cy.get('@fileModal').invoke('css', 'height')
          .then(str => parseInt(str)).should('be.gte', size[0] - 1).and('be.lte', size[0] + 1)
      }
    })
  })
})

// TODO: Test each visionneuse
