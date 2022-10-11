import { url } from '../../support/constants/documents'
import { HEADMASTER } from '../../support/constants'

describe('BreadCrumb', () => {
  before(() => {
    cy.exec('npm run db:loadTables documents_tables_basic.sql')
    cy.clearDBCache()
    cy.login(url + '/15401812', HEADMASTER) // land in 'dossier1'
  })

  it('Test breadcrumb desktop', () => {
    cy.get('[data-test="breadcrumb"]').within(() => {
      cy.contains('.current-folder', 'dossier1_1')

      // Go in parent folder
      cy.contains('[data-test="breadcrumb-item"]', 'dossier1').click()
      cy.contains('.current-folder', 'dossier1')
      cy.contains('[data-test="breadcrumb-item"]', 'Mon cartable').click()
      cy.contains('.current-folder', 'Mon cartable').click()

      // Current folder options (root)
      cy.get('[data-test=context-menu]').children().should('have.length', 2)
        .should('contain', 'Personnels')
        .should('contain', 'Collaboratif')
    })

    // Current folder options (not root)
    cy.visit(url + '/15401812')
    cy.get('[data-test="breadcrumb"]').within(() => {
      cy.contains('.current-folder', 'dossier1_1').click()
      cy.get('[data-test=context-menu]').children().should('have.length', 3)
        .should('contain', 'Renommer')
        .should('contain', 'Télécharger')
        .should('contain', 'Copier l\'URL Webdav')
      cy.contains('.current-folder', 'dossier1_1').click()
      cy.get('[data-test=context-menu]').should('not.exist')
    })

    // Hidden items (up to fourth items)
    cy.visit(url + '/15403803')
    cy.get('[data-test="breadcrumb"]').within(() => {
      cy.get('[data-test="hidden-items"]').click()
      cy.get('[data-test=context-menu]').children().should('have.length', 1)
        .should('contain', 'Mon cartable').click()
      cy.contains('.current-folder', 'Mon cartable')
    })
  })

  it('Test breadcrumb mobile', () => {
    cy.viewport('iphone-5')
    cy.login(url + '/15401812', HEADMASTER) // land in 'dossier1'
    cy.get('[data-test="breadcrumb"]').within(() => {
      // Navigate throw root
      cy.contains('.current-folder > .name', 'dossier1_1').click()
      cy.get('[data-test=context-menu]').should('not.exist') // Test currentOption (no context menu on mobile)
      cy.contains('[data-test=back]', 'dossier1').click()
      cy.contains('.current-folder > .name', 'dossier1')
      cy.contains('[data-test=back]', 'Mon cartable').click()
      cy.contains('.current-folder > .name', 'dossier1')
      cy.get('[data-test=back]').should('not.exist')

      // Test root options
      cy.contains('.current-folder > .name', 'Mon cartable').click()
      cy.get('[data-test=context-menu]').children().should('have.length', 2)
        .should('contain', 'Personnels')
        .should('contain', 'Collaboratif')
    })
  })
})
