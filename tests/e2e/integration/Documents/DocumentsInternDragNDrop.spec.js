import { url } from '../../support/constants/documents'
import { HEADMASTER } from '../../support/constants'

// Have to define here because the generated event for handling function is type of Event not DragEvent by default
// see https://github.com/cypress-io/cypress/issues/649
class DataTransfer {
  constructor () {
    this.data = {}
    this.types = []
    this.files = []
  }

  setData (format, data) {
    this.data[format] = data
  }

  getData (format) {
    return this.data[format]
  }
}

let currentDataTransfer // bad practice but i don't have better.

function dragStartOnDocument (yielded) {
  const dataTransfer = new DataTransfer()
  yielded.trigger('dragstart', { dataTransfer: dataTransfer })
  currentDataTransfer = dataTransfer
}

function dragOverOnDocument (yielded) {
  yielded.trigger('dragover')
}

function leaveDragOverOnDocument (yielded) {
  yielded.trigger('dragleave')
}

function dragEndOnDocument (yielded) {
  yielded.trigger('dragend')
  // currentDataTransfer = undefined // more secure but should never appends
}

function dropOnDocument (yielded) {
  yielded.trigger('drop', { dataTransfer: currentDataTransfer })
}

function dragOverAnOtherDocument (oldDoc, newDoc) { // correspond to over other document without release mouse
  leaveDragOverOnDocument(oldDoc)
  dragOverOnDocument(newDoc)
}

const createFiles = () => {
  const filesToCreate = [
    {
      name: 'fichier1_1',
      folderPath: '/15401808',
      content: 'content'
    },
    {
      name: 'fichier1_2',
      folderPath: '/15401808'
    }
  ]

  filesToCreate.forEach((file) => {
    cy.visit(url + file.folderPath)
    cy.get('[title="Nouveau"]').click()
    cy.get('[data-test="context-menu"]').contains('Note').click()
    cy.get('.file-name-modal').get('input').type(file.name)
    cy.get('[data-test="submitButton"]').click()
    if (file.content) {
      cy.get('.file-display-modal').get('.ck-editor').click()
      cy.get('body').type('{ctrl}A', { release: true }).type(file.content)
    }
    cy.get('.file-display-modal').get('[data-test="closeModal"]').click()
    cy.contains('[data-test=file]', file.name + '.html').should('exist')
  })
}

describe('Documents DragNDrop', () => {
  beforeEach(() => {
    cy.exec('npm run db:loadTables documents_tables_basic.sql')
    cy.clearDBCache()
    cy.login(url + '/15401808', HEADMASTER) // land in 'dossier1'
    // createFiles()
  })

  it('File drop', () => {
    dragStartOnDocument(cy.contains('[data-test=file]', 'fichier1_1.html'))

    // Drag file over folders
    dragOverOnDocument(cy.contains('[data-test=folder]', 'dossier1_1'))
    cy.contains('[data-test=folder]', 'dossier1_1').should('have.class', 'active')
    dragOverAnOtherDocument(cy.contains('[data-test=folder]', 'dossier1_1'), cy.contains('[data-test=folder]', 'dossier1_2'))
    cy.contains('[data-test=folder]', 'dossier1_1').should('not.have.class', 'active')
    cy.contains('[data-test=folder]', 'dossier1_2').should('have.class', 'active')

    // Drop file in folder
    dropOnDocument(cy.contains('[data-test=folder]', 'dossier1_2'))
    // cy.contains('[data-test=file]', 'fichier1_1.html').should('not.exist')
    // cy.visit(url + '/15401814')
    // cy.contains('[data-test=file]', 'fichier1_1.html').should('exist')
    // dragEndOnDocument(cy.contains('[data-test=file]', 'fichier1_1.html'))

    // Drag file over breadCrumb item // TODO: collapsed breadcrumb
    // dragStartOnDocument(cy.contains('[data-test=file]', 'fichier1_1.html'))
    // dragOverOnDocument(cy.contains('[data-test="breadcrumb-item"]', 'dossier1'))
    // cy.contains('[data-test="breadcrumb-item"]', 'dossier1').should('have.class', 'active')
    // dragOverAnOtherDocument(cy.contains('[data-test="breadcrumb-item"]', 'dossier1'), cy.contains('[data-test="breadcrumb-item"]', 'Mon cartable'))
    // cy.contains('[data-test="breadcrumb-item"]', 'dossier1').should('not.have.class', 'active')
    // cy.contains('[data-test="breadcrumb-item"]', 'Mon cartable').should('have.class', 'active')

    // Drop file over breadCrumb item
    // dropOnDocument(cy.contains('[data-test=folder]', 'Mon cartable'))
    // cy.contains('[data-test=file]', 'fichier1_1.html').should('not.exist')
    // cy.visit(url + '/8040788')
    // cy.contains('[data-test=file]', 'fichier1_1.html').should('exist')
  })
})
