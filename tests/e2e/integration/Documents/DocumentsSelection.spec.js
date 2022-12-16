import { url } from '../../support/constants/documents'
import { HEADMASTER } from '../../support/constants'

const folderOptions = ['Nouveau', 'Renommer', 'Déplacer', 'Dupliquer', 'Télécharger', 'Supprimer', 'Détails']
const fileOptions = ['Nouveau', 'Ouvrir', 'Renommer', 'Déplacer', 'Dupliquer', 'Télécharger', 'Supprimer', 'Détails']
const multiSelectionOptions = ['Nouveau', 'Déplacer', 'Dupliquer', 'Supprimer']

const checkCurrentOptions = (optionsNames) => {
  cy.get('[data-test=current-options]').children().should('have.length', optionsNames.length)
  cy.get('[data-test=context-menu] >').children().should('have.length', optionsNames.length)

  optionsNames.forEach((name) => {
    if (name === 'Nouveau') {
      cy.get('[data-test=current-options]').should('contain', 'NOUVEAU') // Handle case
    } else {
      cy.get('[data-test=current-options]').should('contain', name)
    }
    cy.get('[data-test=context-menu]').should('contain', name)
  })
}

describe('Documents selection', () => {
  beforeEach(() => {
    cy.viewport('macbook-16')
    cy.exec('npm run db:loadTables documents_tables_basic.sql')
    cy.clearDBCache()
    cy.login(url + '/15401808', HEADMASTER) // land in 'dossier1'
  })

  it('Check selection options', () => {
    // Select one folder
    cy.contains('[data-test=folder]', 'dossier1_1').click()
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
    cy.contains('[data-test=file]', 'fichier1_1.html').click()
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
    cy.contains('[data-test=folder]', 'dossier1_1').find('.selection-icon').click()
    cy.get('[data-cy=document] .selected').should('have.length', 2)
      // Open context Menu
      .first().rightclick()
    cy.get('[data-test=context-menu]').should('exist')
    checkCurrentOptions(multiSelectionOptions)
  })

  it('keyBoard selection', () => {
    // Check folder content
    cy.get('[data-cy=document]').should('have.length', 4)

    // CTRL + A
    cy.get('body').type('{ctrl}a')
    cy.get('[data-cy=document] .selected').should('have.length', 4)

    // Simple selection
    cy.contains('[data-test=file]', 'fichier1_1.html').click().should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)

    // Ctrl selection
    cy.get('body').type('{ctrl}', { release: false })
    cy.contains('[data-test=folder]', 'dossier1_1').click().should('have.class', 'selected')
    cy.contains('[data-test=file]', 'fichier1_1.html').should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 2)
    // Ctrl deselection
    cy.contains('[data-test=file]', 'fichier1_1.html').click().should('not.have.class', 'selected')
    cy.contains('[data-test=folder]', 'dossier1_1').should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)

    // Simple selection
    cy.get('body').type('{ctrl}') // reset ctrl release
    cy.contains('[data-test=file]', 'fichier1_1.html').click().should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)

    // Shift selection
    cy.get('body').type('{shift}', { release: false })
    cy.contains('[data-test=folder]', 'dossier1_1').click().should('have.class', 'selected')
    cy.contains('[data-test=folder]', 'dossier1_2').should('have.class', 'selected')
    cy.contains('[data-test=file]', 'fichier1_1.html').should('have.class', 'selected')
    cy.contains('[data-test=file]', 'fichier1_2.html').should('not.have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 3)

    // Arrows
    cy.get('body').type('{ctrl}') // reset ctrl release
    cy.contains('[data-test=file]', 'fichier1_1.html').click().should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)

    cy.get('body').type('{downarrow}')
    cy.get('[data-cy=document]').eq(3).should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)
    cy.get('body').type('{downarrow}')
    cy.get('[data-cy=document]').eq(0).should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)
    cy.get('body').type('{uparrow}')
    cy.get('[data-cy=document]').eq(3).should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)
    cy.get('body').type('{uparrow}')
    cy.get('[data-cy=document]').eq(2).should('have.class', 'selected')
    cy.get('[data-cy=document] .selected').should('have.length', 1)
  })
})
