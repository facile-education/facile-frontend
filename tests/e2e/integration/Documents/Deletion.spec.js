import { HEADMASTER } from '../../support/constants'
import { url } from '../../support/constants/documents'

describe('Deletion', () => {
  beforeEach(() => {
    cy.viewport('macbook-16')
    cy.exec('npm run db:loadTables documents_tables_basic.sql')
    cy.clearDBCache()
    cy.login(url + '/15401808', HEADMASTER) // land in 'dossier1'
  })

  it('Delete one file', () => {
    cy.contains('[data-test=file]', 'fichier1_1.html').rightclick()
    cy.get('[data-test="context-menu"]').contains('Supprimer').click() // By context menu
    cy.get('[data-test="warning-modal"]').get('[data-test="cancelButton"]').click()
    cy.wait(500)
    cy.contains('[data-test=file]', 'fichier1_1.html').should('exist').click().should('have.class', 'selected')
    cy.get('[data-test=current-options]').contains('Supprimer').click() // By bar actions
    cy.get('[data-test="warning-modal"]').get('[data-test="confirmButton"]').click()
    cy.contains('[data-test=file]', 'fichier1_1.html').should('not.exist')
  })

  it('Delete many files and folder', () => {
    cy.contains('[data-test=folder]', 'dossier1_1').click().should('have.class', 'selected')
    cy.contains('[data-test=file]', 'fichier1_1.html').within(() => {
      cy.get('.selection-icon').click()
    }).should('have.class', 'selected')
    cy.globalKeyPress('{del}')
    cy.get('[data-test="warning-modal"]').get('[data-test="confirmButton"]').click()
    cy.contains('[data-test=folder]', 'dossier1_1').should('not.exist')
    cy.contains('[data-test=file]', 'fichier1_1.html').should('not.exist')
  })
})
