import { url } from '../../support/constants/messaging'
import { HEADMASTER } from '../../support/constants'
import { waitMessagingToBeLoaded } from '../../support/utils/messagingUtils'

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

describe('Drag and drop messages', () => {
  before(() => {
    cy.exec('npm run db:loadTables messaging_tables.sql')
    cy.clearDBCache()
    cy.login(url, HEADMASTER)
    waitMessagingToBeLoaded()
  })

  it('drag and drop', () => {
    const dataTransfer = new DataTransfer()

    cy.get('[data-test=threads-panel]').get('.thread-list-item').as('threads')
    cy.get('[data-test=messaging-menu]').within(() => {
      cy.contains('Boîte de réception').as('inBoxFolder')
      cy.contains('Brouillons').as('draftFolder')
      cy.contains('Envoyés').as('sentFolder')
      cy.contains('Corbeille').as('trashFolder')
      cy.contains('sous-dossier').as('personalFolder')
    })

    cy.log('move thread to draft')
    cy.get('@threads').eq(0).trigger('dragstart', { dataTransfer: dataTransfer })
    currentDataTransfer = dataTransfer
    cy.get('@inBoxFolder').trigger('dragover').should('not.have.class', 'active')
    cy.get('@inBoxFolder').trigger('drop', { dataTransfer: currentDataTransfer })
    cy.get('@threads').should('have.length', 4)
    cy.get('@draftFolder').trigger('dragover').should('have.class', 'active')
    cy.get('@draftFolder').trigger('drop', { dataTransfer: currentDataTransfer })
    cy.get('[data-test=spinner]').should('exist')
    cy.get('[data-test=spinner]').should('not.exist')
    cy.get('@threads').should('have.length', 3) // The thread should have been moved

    cy.log('move message to sent')
    cy.get('@threads').eq(0).trigger('dragstart', { dataTransfer: dataTransfer })
    currentDataTransfer = dataTransfer
    cy.get('@sentFolder').trigger('dragover').should('have.class', 'active')
    cy.get('@sentFolder').trigger('drop', { dataTransfer: currentDataTransfer })
    cy.get('[data-test=spinner]').should('exist')
    cy.get('[data-test=spinner]').should('not.exist')
    cy.get('@threads').should('have.length', 2) // The thread should have been moved

    cy.log('move message to trash')
    cy.get('@threads').eq(0).trigger('dragstart', { dataTransfer: dataTransfer })
    currentDataTransfer = dataTransfer
    cy.get('@trashFolder').trigger('dragover').should('have.class', 'active')
    cy.get('@trashFolder').trigger('drop', { dataTransfer: currentDataTransfer })
    cy.get('[data-test=spinner]').should('exist')
    cy.get('[data-test=spinner]').should('not.exist')
    cy.get('@threads').should('have.length', 1) // The thread should have been moved

    cy.log('move message to personal folder')
    cy.get('@threads').eq(0).trigger('dragstart', { dataTransfer: dataTransfer })
    currentDataTransfer = dataTransfer
    cy.get('@personalFolder').trigger('dragover').parent().should('have.class', 'active')
    cy.get('@personalFolder').trigger('drop', { dataTransfer: currentDataTransfer })
    cy.get('[data-test=spinner]').should('exist')
    cy.get('[data-test=spinner]').should('not.exist')
    cy.get('@threads').should('have.length', 0) // The thread should have been moved

    cy.log('check messages and return them in inbox folder')
    // Draft
    cy.get('@draftFolder').click()
    cy.get('.header-label').should('contain', 'BROUILLONS')
    cy.get('@threads').eq(0).trigger('dragstart', { dataTransfer: dataTransfer })
    currentDataTransfer = dataTransfer
    cy.get('@inBoxFolder').trigger('dragover').should('have.class', 'active')
    cy.get('@inBoxFolder').trigger('drop', { dataTransfer: currentDataTransfer })
    cy.get('[data-test=spinner]').should('exist')
    cy.get('[data-test=spinner]').should('not.exist')
    cy.get('@threads').should('have.length', 0)

    // Sent
    cy.get('@sentFolder').click()
    cy.get('.header-label').should('contain', 'ENVOYÉS')
    cy.get('@threads').eq(1).trigger('dragstart', { dataTransfer: dataTransfer })
    currentDataTransfer = dataTransfer
    cy.get('@inBoxFolder').trigger('dragover').should('have.class', 'active')
    cy.get('@inBoxFolder').trigger('drop', { dataTransfer: currentDataTransfer })
    cy.get('[data-test=spinner]').should('exist')
    cy.get('[data-test=spinner]').should('not.exist')
    cy.get('@threads').should('have.length', 1) // the sent messages still be display here

    // Trash
    cy.get('@trashFolder').click()
    cy.get('.header-label').should('contain', 'CORBEILLE')
    cy.get('@threads').eq(0).trigger('dragstart', { dataTransfer: dataTransfer })
    currentDataTransfer = dataTransfer
    cy.get('@inBoxFolder').trigger('dragover').should('have.class', 'active')
    cy.get('@inBoxFolder').trigger('drop', { dataTransfer: currentDataTransfer })
    cy.get('[data-test=spinner]').should('exist')
    cy.get('[data-test=spinner]').should('not.exist')
    cy.get('@threads').should('have.length', 0)

    // Personal
    cy.get('@personalFolder').click()
    cy.get('.header-label').should('contain', 'sous-dossier')
    cy.get('@threads').eq(0).trigger('dragstart', { dataTransfer: dataTransfer })
    currentDataTransfer = dataTransfer
    cy.get('@inBoxFolder').trigger('dragover').should('have.class', 'active')
    cy.get('@inBoxFolder').trigger('drop', { dataTransfer: currentDataTransfer })
    cy.get('[data-test=spinner]').should('exist')
    cy.get('[data-test=spinner]').should('not.exist')
    cy.get('@threads').should('have.length', 0)

    cy.log('Check inboxFolder')
    cy.get('@inBoxFolder').click()
    cy.get('.header-label').should('contain', 'BOÎTE DE RÉCEPTION')
    cy.get('@threads').should('have.length', 4)
  })
})
