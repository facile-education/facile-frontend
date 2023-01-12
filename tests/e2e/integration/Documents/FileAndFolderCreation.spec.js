import { url } from '../../support/constants/documents'
import { HEADMASTER } from '../../support/constants'

describe('File and Folder creation', () => {
  beforeEach(() => {
    cy.exec('npm run db:loadTables documents_tables_basic.sql')
    cy.clearDBCache()
    cy.login(url + '/15401808', HEADMASTER) // land in 'dossier1'
  })

  it('Create folder and all type of files', () => {
    // Create Folder
    cy.contains('button', 'NOUVEAU').click()
    cy.get('[data-test="context-menu"]').contains('Dossier').click()
    cy.get('[data-test=folder-name-modal]').within(() => {
      cy.get('input').type('createdFolder') // TODO tests form validation
      cy.contains('button', 'Créer').click()
    })
    cy.contains('[data-test=folder]', 'createdFolder').should('exist')

    // Create ODT
    cy.contains('button', 'NOUVEAU').click()
    cy.get('[data-test="context-menu"]').contains('ODT').click()
    cy.get('[data-test=file-name-modal]').within(() => {
      cy.get('input').type('createdODT') // TODO tests form validation
      cy.contains('button', 'Créer').click()
    })
    cy.get('[data-test=file-display-modal]', { timeout: 10000 }).within(() => {
      cy.get('h1').should('contain', 'createdODT.odt')
      cy.get('[data-test="closeModal"]').click()
    })
    cy.contains('[data-test=file]', 'createdODT.odt').should('exist').find('.selection-icon').click() // Unselect it

    // Create ODS
    cy.contains('button', 'NOUVEAU').click()
    cy.get('[data-test="context-menu"]').contains('ODS').click()
    cy.get('[data-test=file-name-modal]').within(() => {
      cy.get('input').type('createdODS')
      cy.contains('button', 'Créer').click()
    })
    cy.get('[data-test=file-display-modal]', { timeout: 10000 }).within(() => {
      cy.get('h1').should('contain', 'createdODS.ods')
      cy.get('[data-test="closeModal"]').click()
    })
    cy.contains('[data-test=file]', 'createdODS').should('exist').find('.selection-icon').click() // Unselect it

    // Create ODP
    cy.contains('button', 'NOUVEAU').click()
    cy.get('[data-test="context-menu"]').contains('ODP').click()
    cy.get('[data-test=file-name-modal]').within(() => {
      cy.get('input').type('createdODP')
      cy.contains('button', 'Créer').click()
    })
    cy.get('[data-test=file-display-modal]', { timeout: 10000 }).within(() => {
      cy.get('h1').should('contain', 'createdODP.odp')
      cy.get('[data-test="closeModal"]').click()
    })
    cy.contains('[data-test=file]', 'createdODP').should('exist').find('.selection-icon').click() // Unselect it

    // Create Géogébra
    cy.contains('button', 'NOUVEAU').click()
    cy.get('[data-test="context-menu"]').contains('Géogébra').click()
    cy.get('[data-test=file-name-modal]').within(() => {
      cy.get('input').type('createdGéogébra')
      cy.contains('button', 'Créer').click()
    })
    cy.get('[data-test=file-display-modal]', { timeout: 10000 }).within(() => {
      cy.get('h1').should('contain', 'createdGéogébra.ggb')
      cy.get('[data-test="closeModal"]').click()
    })
    cy.get('[data-test=warning-modal]').find('[data-test=confirmButton]').click()
    cy.contains('[data-test=file]', 'createdGéogébra').should('exist').find('.selection-icon').click() // Unselect it

    // Create Carte Mentale
    cy.contains('button', 'NOUVEAU').click()
    cy.get('[data-test="context-menu"]').contains('Carte Mentale').click()
    cy.get('[data-test=file-name-modal]').within(() => {
      cy.get('input').type('createdCarte Mentale')
      cy.contains('button', 'Créer').click()
    })
    cy.get('[data-test=file-display-modal]', { timeout: 10000 }).within(() => {
      cy.get('h1').should('contain', 'createdCarte Mentale.mind')
      cy.get('[data-test="closeModal"]').click()
    })
    cy.get('[data-test=warning-modal]').find('[data-test=confirmButton]').click()
    cy.contains('[data-test=file]', 'createdCarte Mentale').should('exist').find('.selection-icon').click() // Unselect it

    // Create Scratch
    cy.contains('button', 'NOUVEAU').click()
    cy.get('[data-test="context-menu"]').contains('Scratch').click()
    cy.get('[data-test=file-name-modal]').within(() => {
      cy.get('input').type('createdScratch')
      cy.contains('button', 'Créer').click()
    })
    cy.get('[data-test=file-display-modal]', { timeout: 10000 }).within(() => {
      cy.get('h1').should('contain', 'createdScratch.sb3')
      cy.get('[data-test="closeModal"]').click()
    })
    cy.get('[data-test=warning-modal]').find('[data-test=confirmButton]').click()
    cy.contains('[data-test=file]', 'createdScratch').should('exist').find('.selection-icon').click() // Unselect it

    // Create FichierAudio // TODO

    // Create Note
    cy.contains('button', 'NOUVEAU').click()
    cy.get('[data-test="context-menu"]').contains('Note').click()
    cy.get('[data-test=file-name-modal]').within(() => {
      cy.get('input').type('createdNote')
      cy.contains('button', 'Créer').click()
    })
    cy.get('[data-test=file-display-modal]', { timeout: 10000 }).within(() => {
      cy.get('h1').should('contain', 'createdNote.html')
      cy.get('[data-test="closeModal"]').click()
    })
    cy.contains('[data-test=file]', 'createdNote').should('exist')
  })
})
