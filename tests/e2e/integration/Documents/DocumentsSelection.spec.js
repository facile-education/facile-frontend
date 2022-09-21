import { url } from '../../support/constants/documents'
import { HEADMASTER } from '../../support/constants'

const folderOptions = ['Renommer', 'Déplacer vers', 'Dupliquer vers', 'Télécharger', 'Supprimer', 'Copier l\'URL Webdav', 'Détails']
const fileOptions = ['Ouvrir', 'Renommer', 'Déplacer vers', 'Dupliquer vers', 'Télécharger', 'Copier l\'URL Webdav', 'Supprimer', 'Détails']
const multiSelectionOptions = ['Déplacer vers', 'Dupliquer vers', 'Supprimer']

const checkCurrentOptions = (optionsNames) => {
  cy.get('[data-test=current-options]').children().should('have.length', optionsNames.length)
  cy.get('[data-test=context-menu]').children().should('have.length', optionsNames.length)

  optionsNames.forEach((name) => {
    cy.get('[data-test=current-options]').should('contain', name)
    cy.get('[data-test=context-menu]').should('contain', name)
  })
}

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

describe('Documents selection', () => {
  beforeEach(() => {
    cy.viewport('macbook-16')
    cy.login(url, HEADMASTER)
  })

  it('Check selection options', () => {
    // Select one folder
    cy.contains('[data-test=folder]', 'Icônes').click()
      .should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)
      // Open context Menu
      .rightclick()
    cy.get('[data-test=context-menu]').should('exist')
    checkCurrentOptions(folderOptions)
    // Close context menu
    cy.get('[data-cy=document] .selected').rightclick({ force: true })
    cy.get('[data-test=context-menu]').should('not.exist')

    // Select one file
    cy.contains('[data-test=file]', 'NOte.jpg').click()
      .should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)
      // Open context Menu
      .rightclick()
    cy.get('[data-test=context-menu]').should('exist')
    checkCurrentOptions(fileOptions)
    // Close context menu
    cy.get('[data-cy=document] .selected').rightclick({ force: true })
    cy.get('[data-test=context-menu]').should('not.exist')

    // Multi-selection
    cy.contains('[data-test=folder]', 'Icônes').find('.selection-icon').click()
    cy.get('[data-cy=document] .selected').should('have.length', 2)
      // Open context Menu
      .first().rightclick()
    cy.get('[data-test=context-menu]').should('exist')
    checkCurrentOptions(multiSelectionOptions)
  })

  it('keyBoard selection', () => {
    // Check root folder content
    cy.get('[data-cy=document]').should('have.length', 8)

    // CTRL + A
    cy.get('body').type('{ctrl}a')
    cy.get('[data-cy=document] .selected').should('have.length', 8)

    // Simple selection
    cy.contains('[data-test=file]', 'NOte.jpg').click().should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)

    // Ctrl selection
    cy.get('body').type('{ctrl}', { release: false })
    cy.contains('[data-test=folder]', 'Icônes').click().should('have.class', 'selected')
    cy.contains('[data-test=file]', 'NOte.jpg').should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 2)
    // Ctrl deselection
    cy.contains('[data-test=file]', 'NOte.jpg').click().should('not.have.class', 'selected')
    cy.contains('[data-test=folder]', 'Icônes').should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)

    // Simple selection
    cy.get('body').type('{ctrl}') // reset ctrl release
    cy.contains('[data-test=file]', 'NOte.jpg').click().should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)

    // Shift selection
    cy.get('body').type('{shift}', { release: false })
    cy.contains('[data-test=folder]', 'Icônes').click().should('have.class', 'selected')
    cy.contains('[data-test=file]', 'Essai ipad.odt').should('have.class', 'selected')
    cy.contains('[data-test=file]', 'Di Dio Salvatore - Rapport d_import des parents.csv').should('have.class', 'selected')
    cy.contains('[data-test=file]', 'D.jpg').should('have.class', 'selected')
    cy.contains('[data-test=file]', 'Ansermet Séverine - Di Dio Salvatore - rappel.odt').should('have.class', 'selected')
    cy.contains('[data-test=file]', 'NOte.jpg').should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 6)

    // Arrows
    cy.get('body').type('{ctrl}') // reset ctrl release
    cy.contains('[data-test=file]', 'NOte.jpg').click().should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)

    cy.get('body').type('{downarrow}')
    cy.get('[data-cy=document]').eq(7).should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)
    cy.get('body').type('{downarrow}')
    cy.get('[data-cy=document]').eq(0).should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)
    cy.get('body').type('{uparrow}')
    cy.get('[data-cy=document]').eq(7).should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)
    cy.get('body').type('{uparrow}')
    cy.get('[data-cy=document]').eq(6).should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)
  })
})
