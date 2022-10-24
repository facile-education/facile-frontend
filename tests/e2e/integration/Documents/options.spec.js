import { url } from '../../support/constants/documents'
import { HEADMASTER } from '../../support/constants'

const deleteAll = () => {
  cy.get('body').type('{ctrl}a')
  cy.get('body').type('{del}')
  cy.get('[data-test="warning-modal"]').get('[data-test="confirmButton"]').click()
  cy.get('[data-cy=document]').should('not.exist')
}

const createManualEntities = () => {
  // Create Folder
  cy.get('[title="Nouveau"]').click()
  cy.get('[data-test="context-menu"]').contains('Dossier').click()
  cy.get('[data-test=folder-name-modal]').within(() => {
    cy.get('input').type('createdFolder') // TODO tests form validation
    cy.contains('button', 'Créer').click()
  })
  cy.contains('[data-test=folder]', 'createdFolder').should('exist')

  // Create file
  cy.get('[title="Nouveau"]').click()
  cy.get('[data-test="context-menu"]').contains('Note').click()
  cy.get('[data-test=file-name-modal]').within(() => {
    cy.get('input').type('createdNote')
    cy.contains('button', 'Créer').click()
  })
  cy.get('[data-test=file-display-modal]', { timeout: 10000 }).within(() => {
    cy.get('[data-test="closeModal"]').click()
  })
  cy.contains('[data-test=file]', 'createdNote').should('exist')
}

describe('Other options', () => {
  beforeEach(() => {
    cy.viewport('macbook-16')
    cy.exec('npm run db:loadTables documents_tables_basic.sql')
    cy.clearDBCache()
    cy.login(url + '/15401808', HEADMASTER) // land in 'dossier1'

    deleteAll()
    // We must have real file in document library for those tests
    createManualEntities()
  })

  it.only('Open', () => { // On file only
    cy.contains('[data-test=folder]', 'createdFolder').rightclick()
    cy.get('[data-test="context-menu"]').contains('Ouvrir').should('not.exist')

    cy.contains('[data-test=file]', 'createdNote.html').click('right')
    cy.get('[data-test="context-menu"]').should('not.exist')
    cy.contains('[data-test=file]', 'createdNote.html').should('have.class', 'selected').rightclick()
    cy.get('[data-test="context-menu"]').contains('Ouvrir').click()

    cy.get('[data-test=file-display-modal]', { timeout: 10000 }).within(() => {
      cy.get('h1').should('contain', 'createdNote.html') // TODO test WISIWIG editor
      cy.get('[data-test="closeModal"]').click()
    })

    cy.contains('[data-test=file]', 'createdNote.html').click('right')
    cy.get('[data-test="context-menu"]').should('not.exist')
    cy.contains('[data-test=file]', 'createdNote.html').should('have.class', 'selected').rightclick()

    // Test the absence of option on mobile
    cy.viewport('iphone-5')
    cy.reload()
    cy.contains('[data-test=folder]', 'createdFolder').find('.selection-icon').click()
    cy.get('[data-test="hidden-items"]').click()
    // cy.contains('[data-test=folder]', 'createdFolder').find('.selection-icon').click()
    // cy.contains('[data-test=file]', 'createdFile.html').find('.selection-icon').click()
    // cy.get('[data-test="hidden-items"]').click()
  })
})
