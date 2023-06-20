import { HEADMASTER } from '../../support/constants'
import { url } from '../../support/constants/documents'

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
      cy.contains('[data-test="breadcrumb-item"]', 'Personnels').click()
      cy.contains('.current-folder', 'Personnels').click()

      // Current folder options (root)
      cy.get('[data-test=context-menu]').children().should('have.length', 2)
        .should('contain', 'Personnels')
        .should('contain', 'Collaboratif')
    })

    // Current folder options (not root)
    cy.visit(url + '/15401812')
    cy.get('[data-test="breadcrumb"]').within(() => {
      cy.contains('.current-folder', 'dossier1_1').click()
      cy.get('[data-test=context-menu]').children().should('have.length', 2)
        .should('contain', 'Renommer')
        .should('contain', 'Télécharger')
      cy.contains('.current-folder', 'dossier1_1').click()
      cy.get('[data-test=context-menu]').should('not.exist')
    })

    // Hidden items (up to fourth items)
    cy.visit(url + '/15403803')
    cy.get('[data-test="breadcrumb"]').within(() => {
      cy.get('[data-test="hidden-items"]').click()
      cy.get('[data-test=context-menu]').children().should('have.length', 1)
        .should('contain', 'Personnels').click()
      cy.contains('.current-folder', 'Personnels')
    })
  })

  it('Test breadcrumb mobile', () => {
    cy.viewport('iphone-5')
    cy.login(url + '/15401812', HEADMASTER) // land in 'dossier1'
    cy.get('[data-test="breadcrumb"]').within(() => {
      // Navigate throw root
      cy.contains('.current-folder > .name', 'dossier1_1').click()
      cy.get('[data-test=context-menu]').should('exist') // Test currentOption (context menu on mobile)
      cy.contains('[data-test=back]', 'dossier1').click()
      cy.contains('.current-folder > .name', 'dossier1')
      cy.contains('[data-test=back]', 'Personnels').click()
      cy.contains('.current-folder > .name', 'Personnels')
      cy.get('[data-test=back]').should('not.exist')

      // Test root options
      cy.contains('.current-folder > .name', 'Personnels').click()
      cy.get('[data-test=context-menu]').children().should('have.length', 2)
        .should('contain', 'Personnels')
        .should('contain', 'Collaboratif')
    })
  })
})
