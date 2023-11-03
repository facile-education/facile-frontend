import { documentURL } from '../../support/constants/urls'
import { DOYEN, HEADMASTER, PARENT, SCHOOL_ADMIN, SECRETARY, STUDENT, TEACHER } from '../../support/constants/users'

const allowedUsers = [HEADMASTER, DOYEN, SCHOOL_ADMIN, SECRETARY, TEACHER, STUDENT, PARENT]
const disallowedUsers = []

describe('Documents_Display_Access', () => {
  allowedUsers.forEach(user => {
    it('Documents_Display_AccessFor[' + user.role + ']', () => {
      cy.login(user, documentURL)

      cy.get('h1[aria-label="Mes documents"]', { timeout: 10000 }).should('exist')
    })
  })

  disallowedUsers.forEach(user => {
    it('Documents_Display_NotAccessFor[' + user.role + ']', () => {
      cy.login(user, documentURL)
      cy.get('[data-test="menu"]').should('contain', 'Accueil') // Wait the menu to be loaded and tick 500ms to see the 404 message appear
      cy.tick(500)

      cy.contains('Oups, cette page n\'existe pas')
      cy.get('[data-test="menu"]').should('not.contain', 'Documents') // Wait the menu to be loaded and tick 500ms to see the 404 message appear
      cy.get('h1[aria-label="Mes documents"]').should('not.exist')
    })
  })

  it('Documents_Display_UnauthenticatedCanNotAccess', () => {
    cy.then(Cypress.session.clearCurrentSessionData)
    cy.visit(documentURL)

    cy.contains('Une authentification est requise pour accéder au service.').should('be.visible')
  })
})

describe('Documents_Display_ResponsiveDesign', () => {
  const desktop = [1920, 1080]
  const sizes = ['iphone-5', 'ipad-2', desktop]

  beforeEach(() => {
    // cy.exec('npm run dl:loadDocumentLibrary document_library_empty.tar.xz')
    // cy.loadTables('documents/documents_tables_empty.sql')
    cy.fixture('documents.json').as('documentsData')
  })

  sizes.forEach(size => {
    it(`Documents_Display_DisplayServiceCorrectlyFor[${size}]`, function () {
      Cypress._.isArray(size) ? cy.viewport(size[0], size[1]) : cy.viewport(size)

      cy.get('@documentsData').then((documentsData) => {
        const currentFolder = documentsData.currentPersonalDocumentsStructure.folders[0].folders[0] // Sub folder level
        const previousFolder = documentsData.currentPersonalDocumentsStructure.folders[0]
        const personalRootFolder = documentsData.currentPersonalDocumentsStructure
        const folderOptions = documentsData.folderOptions

        // Go on document service, at sub-folder level, select an entity (a folder)
        cy.login(HEADMASTER, documentURL + '/' + currentFolder.id)
        cy.contains('[data-test="folder"]', currentFolder.folders[0].label, { timeout: 10000 }).get('[data-test="selection-icon"]').click()

        // Check service display
        // New button
        cy.contains('button', 'NOUVEAU').should('be.visible')

        // Current folder label
        cy.contains(currentFolder.label).should('be.visible')

        // Current folder content
        currentFolder.folders.forEach(subFolder => {
          cy.contains('[data-test="folder"]', subFolder.label).should('be.visible')
        })
        currentFolder.files.forEach(file => {
          cy.contains('[data-test="file"]', file.label).should('be.visible')
        })

        // Navigation display depending on device
        cy.get('[data-test="breadcrumb"]').within(() => {
          if (size !== desktop) {
            cy.contains('button', previousFolder.label).should('be.visible').find('img[alt="Retour"]')
            cy.contains('button', personalRootFolder.label).should('not.exist')
          } else {
            cy.contains('button', previousFolder.label).should('be.visible')
              .find('img[alt="Retour"]').should('not.exist')
            cy.contains('button', personalRootFolder.label).should('be.visible')
          }
        })

        // Current actions
        cy.get('[data-test="current-options"]').within(() => {
          if (size !== desktop) {
            cy.get('[data-test=hidden-items]').click()
          } else {
            cy.get('[data-test=hidden-items]').should('not.exist')
          }
          folderOptions.forEach(option => {
            cy.contains(option).should('be.visible')
          })
        })

        // Displayed fields
        if (size !== desktop) {
          cy.get('[data-test=fields]').should('contain', 'Nom')
            .should('not.contain', 'Taille')
            .should('not.contain', 'Dernière modif.')
        } else {
          cy.get('[data-test=fields]').should('contain', 'Nom')
            .should('contain', 'Taille')
            .should('contain', 'Dernière modif.')
        }

        // TODO test displayed entities data (size, last modified date)
      })
    })
  })
})
