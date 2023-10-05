import { messagingURL } from '../../support/constants/urls'
import { HEADMASTER } from '../../support/constants/users'
import { getThread, waitMessagingToBeLoaded } from '../../support/utils/messagingUtils'

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
  beforeEach(() => {
    cy.loadTables('messaging/messaging_tables.sql')
    cy.login(HEADMASTER, messagingURL)
    cy.fixture('messaging.json').as('messagingData') // Load in beforeEach to be accessible from 'this' in tests
    waitMessagingToBeLoaded()
  })

  it('drag and drop', function () {
    const dataTransfer = new DataTransfer()
    const headMasterPersonalFolder = this.messagingData.personalFolders.headMasterPersonalFolder
    const firstThread = this.messagingData.existingThreads[0]
    const secondThread = this.messagingData.existingThreads[1]
    const thirdThread = this.messagingData.existingThreads[2]
    const fourthThread = this.messagingData.existingThreads[3]

    cy.get('[data-test=threads-panel]').find('.thread-list-item').as('threads')
    cy.log('Open messaging menu')
    cy.get('[data-test=option_toggleMessagingMenu]').click()
    cy.get('[data-test=messaging-menu]').within(() => {
      cy.contains('Boîte de réception').as('inBoxFolder')
      cy.contains('Brouillons').as('draftFolder')
      cy.contains('Envoyés').as('sentFolder')
      cy.contains('Corbeille').as('trashFolder')
      cy.contains(headMasterPersonalFolder).as('personalFolder')
    })

    cy.log('move thread to draft')
    getThread(firstThread).trigger('dragstart', { dataTransfer })
    currentDataTransfer = dataTransfer
    cy.get('@inBoxFolder').trigger('dragover').should('not.have.class', 'active')
    cy.get('@inBoxFolder').trigger('drop', { dataTransfer: currentDataTransfer })
    cy.get('@threads').should('have.length', 4)
    cy.get('@draftFolder').trigger('dragover').should('have.class', 'active')
    cy.get('@draftFolder').trigger('drop', { dataTransfer: currentDataTransfer })
    cy.get('@threads').should('have.length', 3) // The thread should have been moved

    cy.log('move message to sent')
    getThread(secondThread).trigger('dragstart', { dataTransfer })
    currentDataTransfer = dataTransfer
    cy.get('@sentFolder').trigger('dragover').should('have.class', 'active')
    cy.get('@sentFolder').trigger('drop', { dataTransfer: currentDataTransfer })
    cy.get('@threads').should('have.length', 2) // The thread should have been moved

    cy.log('move message to trash')
    getThread(thirdThread).trigger('dragstart', { dataTransfer })
    currentDataTransfer = dataTransfer
    cy.get('@trashFolder').trigger('dragover').should('have.class', 'active')
    cy.get('@trashFolder').trigger('drop', { dataTransfer: currentDataTransfer })
    cy.get('@threads').should('have.length', 1) // The thread should have been moved

    cy.log('move message to personal folder')
    getThread(fourthThread).trigger('dragstart', { dataTransfer })
    currentDataTransfer = dataTransfer
    cy.get('@personalFolder').trigger('dragover').should('have.class', 'active')
    cy.get('@personalFolder').trigger('drop', { dataTransfer: currentDataTransfer })
    cy.get('@threads').should('have.length', 0) // The thread should have been moved

    cy.log('check messages and return them in inbox folder')
    // Draft
    cy.get('@draftFolder').click()
    cy.get('.header-label').should('contain', 'BROUILLONS')
    getThread(firstThread).trigger('dragstart', { dataTransfer })
    currentDataTransfer = dataTransfer
    cy.get('@inBoxFolder').trigger('dragover').should('have.class', 'active')
    cy.get('@inBoxFolder').trigger('drop', { dataTransfer: currentDataTransfer })
    cy.get('@threads').should('have.length', 0)

    // Sent
    cy.get('@sentFolder').click()
    cy.get('.header-label').should('contain', 'ENVOYÉS')
    getThread(secondThread).trigger('dragstart', { dataTransfer })
    currentDataTransfer = dataTransfer
    cy.get('@inBoxFolder').trigger('dragover').should('have.class', 'active')
    cy.get('@inBoxFolder').trigger('drop', { dataTransfer: currentDataTransfer })
    cy.get('@threads').should('have.length', 1) // the sent messages still be display here

    // Trash
    cy.get('@trashFolder').click()
    cy.get('.header-label').should('contain', 'CORBEILLE')
    getThread(thirdThread).trigger('dragstart', { dataTransfer })
    currentDataTransfer = dataTransfer
    cy.get('@inBoxFolder').trigger('dragover').should('have.class', 'active')
    cy.get('@inBoxFolder').trigger('drop', { dataTransfer: currentDataTransfer })
    cy.get('@threads').should('have.length', 0)

    // Personal
    cy.get('@personalFolder').click()
    cy.get('.header-label').should('contain', 'SOUS-DOSSIER')
    getThread(fourthThread).trigger('dragstart', { dataTransfer })
    currentDataTransfer = dataTransfer
    cy.get('@inBoxFolder').trigger('dragover').should('have.class', 'active')
    cy.get('@inBoxFolder').trigger('drop', { dataTransfer: currentDataTransfer })
    cy.get('@threads').should('have.length', 0)

    cy.log('Check inboxFolder')
    cy.get('@inBoxFolder').click()
    cy.get('.header-label').should('contain', 'BOÎTE DE RÉCEPTION')
    cy.get('@threads').should('have.length', 4)
  })
})
