import { url } from '../../support/constants/documents'
import { HEADMASTER } from '../../support/constants'

/*
  The dump file system for user didiosa is like:

  Root
  | Dossier WEBDAV
  | Icônes
  | | Icônes Annonces de l_Administration
  | | | Document.png
  | | | JOB.png
  | | | Note de service.png
  | | Icônes Applications Etat
  | | | EEL.png  + 7 others...
  | NOte.jpg  + 5 others...
 */

describe('Documents space', () => {
  beforeEach(() => {
    cy.exec('npm run db:loadTables documents_tables_basic.sql')
    cy.clearDBCache()
    cy.login(url, HEADMASTER) // land in 'dossier1'
  })

  it('Current folder is getting from url', () => {
    // No folderId means droot folder
    cy.url().should('eq', Cypress.config().baseUrl + url)
    // Check root folder content
    cy.get('[data-test="breadcrumb"]').find('.current-folder', 'Mon Cartable')
    cy.visit(url + '/15401808') // Assure to start in headmaster's root folder
    cy.get('[data-test="breadcrumb"]').find('.current-folder', 'dossier1')
    cy.visit(url + '/15401812') // Assure to start in headmaster's root folder
    cy.get('[data-test="breadcrumb"]').find('.current-folder', 'dossier1_1')
    cy.reload()
    cy.get('[data-test="breadcrumb"]').find('.current-folder', 'dossier1_1')
  })

  it('Sort well', () => {
    cy.get('[data-cy=document]').as('docs').should('have.length', 4)
    // Initial sort: alphanumeric (asc)
    cy.get('@docs').eq(0).should('contain', 'dossier1')
    cy.get('@docs').eq(1).should('contain', 'dossier2')
    cy.get('@docs').eq(2).should('contain', 'fichier1.html')
    cy.get('@docs').eq(3).should('contain', 'fichier2.html')

    // Alphanumeric (desc)
    cy.get('[data-test=fields]').contains('Nom').click()
    cy.get('[data-cy=document]').as('docs').eq(0).should('contain', 'dossier2')
    cy.get('@docs').eq(1).should('contain', 'dossier1')
    cy.get('@docs').eq(2).should('contain', 'fichier2.html')

    // TODO modify dump to have differents document dates
    // // Last modif (desc)
    // cy.get('[data-test=fields]').contains('Dernière modif.').click()
    // cy.get('[data-cy=document]').as('docs').eq(0).should('contain', 'Dossier WEBDAV')
    // cy.get('@docs').eq(1).should('contain', 'Icônes')
    // cy.get('@docs').eq(2).should('contain', 'Di Dio Salvatore - Rapport d_import des parents.csv')
    //
    // // Last modif (asc)
    // cy.get('[data-test=fields]').contains('Dernière modif.').click()
    // cy.get('[data-cy=document]').as('docs').eq(0).should('contain', 'Icônes')
    // cy.get('@docs').eq(1).should('contain', 'Dossier WEBDAV')
    // cy.get('@docs').eq(2).should('contain', 'NOte.jpg')
  })

  it('Can navigate through folders', () => {
    // Check root folder content
    cy.get('[data-test="breadcrumb"]').find('.current-folder', 'Mon Cartable')

    // Go in 'dossier1'
    cy.contains('[data-test=folder]', 'dossier1').click() // Simple click should not enter in folder
    cy.get('[data-test="breadcrumb"]').find('.current-folder', 'Mon Cartable') // We are already in root folder
    cy.contains('[data-test=folder]', 'dossier1').dblclick()
    cy.get('[data-test="breadcrumb"]').find('.current-folder', 'dossier1')

    // Go in 'dossier1_1'
    cy.contains('[data-test=folder]', 'dossier1_1').click() // Go in folder by 'return' key
      .should('have.class', 'selected')
    // Press enter
    cy.get('body').type('{enter}')
    cy.get('[data-test="breadcrumb"]').find('.current-folder', 'dossier1_1')

    // Go back with breadCrumb
    cy.get('[data-test=breadcrumb]').within(() => {
      cy.get('.breadcrumb-item').should('have.length', 3)
      cy.contains('dossier1').click()
      cy.get('.breadcrumb-item').should('have.length', 2)
        .eq(0).click() // click on root folder
      cy.get('.breadcrumb-item').should('have.length', 1)
    })
    cy.get('[data-test="breadcrumb"]').find('.current-folder', 'Mon Cartable') // We are in root folder
  })

  it('Can navigate through folders, mobile mode', () => {
    cy.viewport('iphone-5')

    // Check root folder content
    cy.get('[data-test="breadcrumb"]').find('.current-folder', 'Mon Cartable')

    // Go in 'Icônes'
    cy.contains('[data-test=folder]', 'dossier1').click() // Simple click should not enter in folder
    cy.get('[data-test="breadcrumb"]').find('.current-folder', 'dossier1')

    // Go in 'Icônes Applications Etat'
    cy.contains('[data-test=folder]', 'dossier1_1').click() // Go in folder by 'return' key
    cy.get('[data-test="breadcrumb"]').find('.current-folder', 'dossier1_1')

    // Go back with breadCrumb
    cy.get('[data-test=breadcrumb]').within(() => {
      cy.contains('dossier1_1').should('exist')
      cy.get('[data-test=back]').click()
      cy.contains('dossier1_1').should('not.exist')
      cy.contains('dossier1').should('exist')
      cy.get('[data-test=back]').click()
        .should('not.exist')
    })
    cy.get('[data-test="breadcrumb"]').find('.current-folder', 'Mon Cartable') // We are in root folder
  })
})
