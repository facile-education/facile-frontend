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

const goInFolder = (folderName) => {
  cy.contains('[data-test=folder]', folderName).dblclick()
  cy.get('[data-test="breadcrumb"]').find('.current-folder', folderName)
  cy.get('[data-test=spinner]').should('not.exist')
}

describe('Move and duplicate', () => {
  beforeEach(() => {
    cy.exec('npm run db:loadTables documents_tables_basic.sql')
    cy.clearDBCache()
    cy.login(url, HEADMASTER)

    deleteAll()
    // We must have real file in document library to get bytes for duplication
    createManualEntities()
  })

  it('duplicate one file', () => {
    cy.contains('[data-test=file]', 'createdNote.html').rightclick()
    cy.get('[data-test="context-menu"]').contains('Dupliquer').click()
    cy.get('[data-test=file-picker-modal]').within(() => {
      cy.get('.folder').contains('createdFolder').click()
      cy.get('[data-test=submitButton]').click()
    }).should('not.exist')
    goInFolder('createdFolder')
    cy.contains('[data-test=file]', 'createdNote.html').should('exist')

    // re-duplicate for conflicts
    cy.visit(url + '/8040788')
    cy.contains('[data-test=file]', 'createdNote.html').rightclick()
    cy.get('[data-test="context-menu"]').contains('Dupliquer').click()
    cy.get('[data-test=file-picker-modal]').within(() => {
      cy.get('.folder').contains('createdFolder').click()
      cy.get('[data-test=submitButton]').click()
    }).should('not.exist')
    cy.get('[data-test=conflict-modal]').within(() => {
      cy.contains('button', 'Remplacer').click()
    })
    cy.contains('[data-test=file]', 'createdNote.html').should('exist').rightclick()
    cy.get('[data-test="context-menu"]').contains('Détails').click()
    cy.get('.version-list').within(() => {
      cy.contains('1.0')
    })
    goInFolder('createdFolder')
    cy.wait(500)
    cy.contains('[data-test=file]', 'createdNote.html').should('exist').rightclick()
    cy.get('.version-list').within(() => {
      cy.contains('1.0')
      cy.contains('2.0')
    })
  })

  it('duplicate many documents at once', () => {
    cy.contains('[data-test=folder]', 'createdFolder').click()
    cy.contains('[data-test=file]', 'createdNote.html').find('.selection-icon').click().rightclick()
    cy.get('[data-test="context-menu"]').contains('Dupliquer').click()
    cy.get('[data-test=file-picker-modal]').within(() => {
      cy.get('[data-test=submitButton]').click() // duplicate in root folder
    }).should('not.exist')
    // Resolve conflict
    cy.get('[data-test=conflict-modal]').within(() => {
      cy.contains('button', 'Conserver').click()
    })
    cy.contains('[data-test=folder]', 'createdFolder').should('exist')
    cy.contains('[data-test=folder]', 'createdFolder (1)').should('exist')
    cy.contains('[data-test=file]', 'createdNote.html').should('exist')
    cy.contains('[data-test=file]', 'createdNote (1).html').should('exist')
  })

  it('move one file', () => {
    cy.contains('[data-test=file]', 'createdNote.html').rightclick()
    cy.get('[data-test="context-menu"]').contains('Déplacer').click()
    cy.get('[data-test=file-picker-modal]').within(() => {
      cy.get('.folder').contains('createdFolder').click()
      cy.get('[data-test=submitButton]').click()
    }).should('not.exist')
    cy.contains('[data-test=file]', 'createdNote.html').should('not.exist')
    goInFolder('createdFolder')
    cy.contains('[data-test=file]', 'createdNote.html').should('exist')

    // re-duplicate for conflicts
    cy.visit(url + '/8040788')
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
    cy.contains('[data-test=file]', 'createdNote').should('exist').rightclick()

    // Move it
    cy.get('[data-test="context-menu"]').contains('Déplacer').click()
    cy.get('[data-test=file-picker-modal]').within(() => {
      cy.get('.folder').contains('createdFolder').click()
      cy.get('[data-test=submitButton]').click()
    }).should('not.exist')
    cy.get('[data-test=conflict-modal]').within(() => {
      cy.contains('button', 'Remplacer').click()
    })
    cy.contains('[data-test=file]', 'createdNote.html').should('not.exist')
    goInFolder('createdFolder')
    cy.wait(500)
    cy.contains('[data-test=file]', 'createdNote.html').should('exist').rightclick()
  })
})
