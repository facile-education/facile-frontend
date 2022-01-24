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
    cy.login(url, HEADMASTER)
  })

  it('Current folder is getting from url', () => {
    // No folderId means droot folder
    cy.url().should('eq', Cypress.config().baseUrl + url)
    // Check root folder content
    cy.get('[data-cy=document]').should('have.length', 8)
    cy.visit(url + '/8040788') // Assure to start in headmaster's root folder
    cy.get('[data-cy=document]').should('have.length', 8)
    cy.visit(url + '/12186492') // Assure to start in headmaster's root folder
    cy.get('[data-cy=document]').should('have.length', 2)
    cy.reload()
    cy.get('[data-cy=document]').should('have.length', 2)
  })

  it('Sort well', () => {
    cy.get('[data-cy=document]').as('docs').should('have.length', 8)
    // Initial sort: alphanumeric (asc)
    cy.get('@docs').eq(0).should('contain', 'Dossier WEBDAV')
    cy.get('@docs').eq(1).should('contain', 'Icônes')
    cy.get('@docs').eq(2).should('contain', 'Ansermet Séverine - Di Dio Salvatore - rappel.odt')

    // Alphanumeric (desc)
    cy.get('[data-test=fields]').contains('Nom').click()
    cy.get('[data-cy=document]').as('docs').eq(0).should('contain', 'Icônes')
    cy.get('@docs').eq(1).should('contain', 'Dossier WEBDAV')
    cy.get('@docs').eq(2).should('contain', 'rappel.odt')

    // Last modif (desc)
    cy.get('[data-test=fields]').contains('Dernière modif.').click()
    cy.get('[data-cy=document]').as('docs').eq(0).should('contain', 'Dossier WEBDAV')
    cy.get('@docs').eq(1).should('contain', 'Icônes')
    cy.get('@docs').eq(2).should('contain', 'Di Dio Salvatore - Rapport d_import des parents.csv')

    // Last modif (asc)
    cy.get('[data-test=fields]').contains('Dernière modif.').click()
    cy.get('[data-cy=document]').as('docs').eq(0).should('contain', 'Icônes')
    cy.get('@docs').eq(1).should('contain', 'Dossier WEBDAV')
    cy.get('@docs').eq(2).should('contain', 'NOte.jpg')
  })

  it('Can navigate through folders', () => {
    // Check root folder content
    cy.get('[data-cy=document]').should('have.length', 8)

    // Go in 'Icônes'
    cy.contains('[data-test=folder]', 'Icônes').click() // Simple click should not enter in folder
    cy.get('[data-cy=document]').should('have.length', 8) // We are already in root folder
    cy.contains('[data-test=folder]', 'Icônes').dblclick()
    cy.get('[data-cy=document]').should('have.length', 2)

    // Go in 'Icônes Applications Etat'
    cy.contains('[data-test=folder]', 'Icônes Applications Etat').click() // Go in folder by 'return' key
      .should('have.class', 'selected')
    // Press enter
    cy.get('body').type('{enter}')
    cy.get('[data-cy=document]').should('have.length', 8)
    cy.contains('[data-test=file]', 'EEL.png').should('exist')

    // Go back with breadCrumb
    cy.get('[data-test=breadcrumb]').within(() => {
      cy.get('.breadcrumb-item').should('have.length', 3)
      cy.contains('Icônes').click()
      cy.get('.breadcrumb-item').should('have.length', 2)
        .eq(0).click() // click on root folder
      cy.get('.breadcrumb-item').should('have.length', 1)
    })
    cy.get('[data-cy=document]').should('have.length', 8) // We are in root folder
    cy.contains('[data-test=file]', 'NOte.jpg').should('exist')
  })

  it('Can navigate through folders, mobile mode', () => {
    cy.viewport('iphone-5')

    // Check root folder content
    cy.get('[data-cy=document]').should('have.length', 8)

    // Go in 'Icônes'
    cy.contains('[data-test=folder]', 'Icônes').click() // Simple click should not enter in folder
    cy.get('[data-cy=document]').should('have.length', 2)

    // Go in 'Icônes Applications Etat'
    cy.contains('[data-test=folder]', 'Icônes Applications Etat').click() // Go in folder by 'return' key
    cy.contains('[data-test=file]', 'EEL.png').should('exist')

    // Go back with breadCrumb
    cy.get('[data-test=breadcrumb]').within(() => {
      cy.contains('Icônes Applications Etat').should('exist')
      cy.get('[data-test=back]').click()
      cy.contains('Icônes Applications Etat').should('not.exist')
      cy.contains('Icônes').should('exist')
      cy.get('[data-test=back]').click()
        .should('not.exist')
    })
    cy.get('[data-cy=document]').should('have.length', 8) // We are in root folder
    cy.contains('[data-test=file]', 'NOte.jpg').should('exist')
  })
})
