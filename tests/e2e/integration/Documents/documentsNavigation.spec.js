import { documentURL } from '../../support/constants/urls'
import { HEADMASTER } from '../../support/constants/users'
import { waitDocumentServiceToBeLoaded } from '../../support/utils/documents'

const checkFolderInterface = (currentFolder, isCollaborative = false) => {
  // Check url
  if (currentFolder.id) {
    cy.url().should('eq', Cypress.config().baseUrl + documentURL + '/' + (isCollaborative ? 'groups/' : '') + currentFolder.id)
  }

  // Check current folder label
  cy.get('[data-test=breadcrumb]').should('contain', currentFolder.label)

  // Check folder content
  cy.get('[data-cy=document]').should('have.length', currentFolder.folders.length + currentFolder.files.length)
  currentFolder.folders.forEach(subFolder => {
    cy.contains('[data-test="folder"]', subFolder.label).should('be.visible')
  })
  currentFolder.files.forEach(file => {
    cy.contains('[data-test="file"]', file.label).should('be.visible')
  })
}

describe('Documents_Navigation', () => {
  const mobileSizes = ['iphone-5', 'ipad-2']
  let currentFolder

  beforeEach(() => {
    cy.fixture('documents.json').as('documentsData').then(documentsData => {
      // Go at sub folder level
      currentFolder = documentsData.currentPersonalDocumentsStructure
      cy.login(HEADMASTER, documentURL)

      waitDocumentServiceToBeLoaded()
      // Wait entities to be loaded
      cy.get('[data-cy=document]').should('have.length', currentFolder.folders.length + currentFolder.files.length)
    })
  })

  it('Documents_Navigation_DblClickOnFolderDesktop', function () {
    const folderToGoInside = currentFolder.folders[0]

    // Not change current folder on simple click
    cy.contains('[data-test=folder]', folderToGoInside.label).as('folderToGoInside').click()
    cy.get('@folderToGoInside').should('be.visible')
      .and('have.class', 'selected')

    // Change current folder on dbl click
    cy.get('@folderToGoInside').dblclick()

    checkFolderInterface(folderToGoInside)
  })

  it('Documents_Navigation_ClickOnFolderTitle', function () {
    const folderToGoInside = currentFolder.folders[0]

    cy.contains(folderToGoInside.label).click()

    checkFolderInterface(folderToGoInside)
  })

  it('Documents_Navigation_ClickOnBreadCrumbItem', function () {
    const rootFolder = this.documentsData.currentPersonalDocumentsStructure // folder level 0
    const firstSubFolderLevel = this.documentsData.currentPersonalDocumentsStructure.folders[0] // folder level 1
    const thirdSubFolderLevel = this.documentsData.currentPersonalDocumentsStructure.folders[0].folders[0].folders[0]

    cy.visit(documentURL + '/' + thirdSubFolderLevel.id)
    waitDocumentServiceToBeLoaded()

    // Click on current folder (nothing should append)
    cy.get('[data-test=breadcrumb]').within(() => {
      cy.contains(thirdSubFolderLevel.label).click()
    })
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(200)
    cy.url().should('eq', Cypress.config().baseUrl + documentURL + '/' + thirdSubFolderLevel.id)

    // Click on firstSubFolder level
    cy.get('[data-test=breadcrumb]').within(() => {
      cy.contains(firstSubFolderLevel.label).click()
    })
    checkFolderInterface(firstSubFolderLevel)

    // Click on rootFolder level
    cy.get('[data-test=breadcrumb]').within(() => {
      cy.contains(rootFolder.label).click()
    })
    checkFolderInterface(rootFolder)
  })

  it('Documents_Navigation_ClickOnBreadCrumbHiddenItem', function () {
    const rootFolder = this.documentsData.currentPersonalDocumentsStructure // folder level 0
    const firstSubFolderLevel = this.documentsData.currentPersonalDocumentsStructure.folders[0] // folder level 1
    const fifthSubFolderLevel = this.documentsData.currentPersonalDocumentsStructure.folders[0].folders[0].folders[0].folders[0].folders[0]

    cy.visit(documentURL + '/' + fifthSubFolderLevel.id)
    waitDocumentServiceToBeLoaded()

    cy.get('[data-test=breadcrumb]').within(() => {
      // Breadcrumb should have a max length of 5 folders on desktop, and hide the rest in hiddenitems
      cy.get('[data-test=hidden-items]').click()
      cy.get('[data-test=context-menu]').within(() => {
        cy.get('li').should('have.length', 2)
        cy.contains(rootFolder.label)
        cy.contains(firstSubFolderLevel.label).click()
      })
    })

    checkFolderInterface(firstSubFolderLevel)

    cy.get('[data-test=breadcrumb]').find('[data-test=hidden-items]').should('not.exist')
  })

  it('Documents_Navigation_SwitchBetweenPersonalRootAndCollaborativeRoot', function () {
    const personalRootFolder = this.documentsData.currentPersonalDocumentsStructure
    const collaborativeRootFolder = this.documentsData.currentCollaborativeStructure

    // Select collaborative root
    cy.contains('[data-test=breadcrumb-item]', personalRootFolder.label).within(() => {
      cy.get('button[data-test="show-options"]').should('be.visible').click()

      cy.get('[data-test=context-menu]').within(() => {
        cy.get('li').should('have.length', 2)
        cy.contains(personalRootFolder.label).should('be.visible')
        cy.contains(collaborativeRootFolder.label).should('be.visible').click()
      })
      cy.get('[data-test=context-menu]').should('not.exist')
    })

    // Check url
    cy.url().should('eq', Cypress.config().baseUrl + documentURL + '/groups')
    // Check current folder label
    cy.get('[data-test=breadcrumb]').should('contain', collaborativeRootFolder.label)
    // Check folder content
    cy.get('[data-cy=document]').should('have.length', collaborativeRootFolder.spaces.length)
    collaborativeRootFolder.spaces.forEach(space => {
      cy.contains('[data-cy=document]', space.label).should('be.visible')
    })

    // re-select personnal root
    cy.contains('[data-test=breadcrumb-item]', collaborativeRootFolder.label).within(() => {
      cy.get('button[data-test="show-options"]').should('be.visible').click()

      cy.get('[data-test=context-menu]').within(() => {
        cy.get('li').should('have.length', 2)
        cy.contains(collaborativeRootFolder.label).should('be.visible')
        cy.contains(personalRootFolder.label).should('be.visible').click()
      })
      cy.get('[data-test=context-menu]').should('not.exist')
    })

    cy.url().should('eq', Cypress.config().baseUrl + documentURL)
    checkFolderInterface(personalRootFolder)
  })

  it('Documents_Navigation_NavigateInCollaborativeSpaces', function () {
    const spaceToGo = this.documentsData.currentCollaborativeStructure.spaces[0]

    cy.visit(documentURL + '/groups')
    waitDocumentServiceToBeLoaded()

    cy.contains('[data-cy=document]', spaceToGo.label).click()

    checkFolderInterface(spaceToGo, true)

    cy.contains('[data-test=folder]', spaceToGo.folders[0].label).dblclick()

    checkFolderInterface(spaceToGo.folders[0], true)
  })

  it('Documents_Navigation_KeyBoardNavigation', function () {
    // Only test to enter in folder with enter key, breadcrumb keyboard navigation is useless to test while it's html <button> behaviour
    const folderToGoInside = currentFolder.folders[0]

    // Select many folders
    cy.contains('[data-test="folder"]', folderToGoInside.label).click()
    cy.contains('[data-test="folder"]', currentFolder.folders[1].label).find('[data-test="selection-icon"]').click()
    cy.get('[data-cy=document] .selected').should('have.length', 2)

    cy.get('body').type('{enter}') // Nothing should append because of the multi-selection
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(200)
    cy.url().should('eq', Cypress.config().baseUrl + documentURL)

    // Select only one folder
    cy.contains('[data-test="folder"]', folderToGoInside.label).click()
    cy.get('[data-cy=document] .selected').should('have.length', 1)

    cy.get('body').type('{enter}')
    checkFolderInterface(folderToGoInside)
  })

  it('Documents_Navigation_ClickOnPreviousFolderOnMobile', function () {
    cy.viewport(mobileSizes[0])

    const rootFolder = this.documentsData.currentPersonalDocumentsStructure // folder level 0
    const firstSubFolderLevel = this.documentsData.currentPersonalDocumentsStructure.folders[0] // folder level 1
    const secondSubFolderLevel = this.documentsData.currentPersonalDocumentsStructure.folders[0].folders[0]

    cy.visit(documentURL + '/' + secondSubFolderLevel.id)
    waitDocumentServiceToBeLoaded()

    // Click on previous button in breadCrumb
    cy.get('button[data-test=back]').should('contain', firstSubFolderLevel.label).click()
    checkFolderInterface(firstSubFolderLevel)

    cy.get('button[data-test=back]').should('contain', rootFolder.label).click()
    checkFolderInterface(rootFolder)

    cy.get('button[data-test=back]').should('not.exist')

    // Test previous option display on other mobile devices
    cy.viewport(mobileSizes[1])
    cy.visit(documentURL + '/' + secondSubFolderLevel.id)
    waitDocumentServiceToBeLoaded()
    cy.get('button[data-test=back]').should('be.visible')
  })

  mobileSizes.forEach(size => {
    it(`Documents_Navigation_SimpleClickOnFolderOn[${size}]`, function () {
      cy.viewport(size)

      const folderToGoInside = currentFolder.folders[0]

      cy.contains('[data-test=folder]', folderToGoInside.label).click()

      checkFolderInterface(folderToGoInside)
    })
  })
})
