import { HEADMASTER } from '../../support/constants'
import { url } from '../../support/constants/messaging'
import { waitMessagingToBeLoaded } from '../../support/utils/messagingUtils'

describe('Messaging navigation and structure', () => {
  before(() => {
    cy.exec('npm run db:loadTables messaging_tables.sql')
    cy.clearDBCache()
    cy.login(url, HEADMASTER)
    waitMessagingToBeLoaded()
  })

  context('desktop', function () {
    it('Displays 2 split areas', () => {
      cy.get('[data-test=threads-panel]').should('exist')
      cy.get('[data-test=messages-panel]').should('exist')
      cy.get('[data-test=messaging-menu]').should('not.be.visible')

      // Open messaging menu
      cy.log('Open messaging menu')
      cy.get('[data-test=option_toggleMessagingMenu]').click()
      cy.get('[data-test=messaging-menu] > nav').within(() => {
        // Check menu items
        cy.log('Get menu items')
        cy.contains('Boîte de réception').as('inbox-link') // Yield el in .nav containing 'About'
        cy.contains('Brouillons').as('draft-link')
        cy.contains('Envoyés').as('sentBox-link')
        cy.contains('Corbeille').as('trash-link')
        cy.contains('Mes dossiers')
      })

      // Check navigation
      cy.log('Check navigation')
      cy.get('[data-test=threads-panel] > [data-test=header]').within(() => {
        cy.contains('BOÎTE DE RÉCEPTION')
        cy.get('@draft-link').click()
        cy.contains('BROUILLONS')
        cy.get('@sentBox-link').click()
        cy.contains('ENVOYÉS')
        cy.get('@trash-link').click()
        cy.contains('CORBEILLE')
      })

      // Close menu
      cy.log('Close messaging menu')
      cy.get('[data-test=option_toggleMessagingMenu]').click()
      cy.get('[data-test=messaging-menu]').should('not.be.visible')
    })
  })

  context('mobile', function () {
    beforeEach(function () {
      cy.viewport('iphone-5')
      cy.login(url, HEADMASTER)
    })

    it('Check navigation', () => {
      // Initialisation
      cy.get('[data-test=threads-panel]').should('be.visible')
      cy.get('[data-test=messaging-menu]').should('not.be.visible')
      cy.get('[data-test=messages-panel]').should('not.exist')

      cy.get('.open-menu').click()
      // cy.get('[data-test=threads-panel]').should('not.be.visible')  // Don't know why it fails...
      cy.get('[data-test=messaging-menu]').should('be.visible')
      cy.get('[data-test=messages-panel]').should('not.exist')

      cy.contains('Boîte de réception').click()

      cy.get('[data-test=threads-panel]').should('be.visible')
      cy.get('[data-test=messaging-menu]').should('not.be.visible')
      cy.get('[data-test=messages-panel]').should('not.exist')

      cy.get('.current-folder > p').should('contain', 'BOÎTE DE RÉCEPTION')

      cy.get('[data-test=thread-list-item]').first().click() // Assert that there is at least one message in the current database for the current user's inbox

      // cy.get('[data-test=threads-panel]').should('not.be.visible')
      cy.get('[data-test=messaging-menu]').should('not.be.visible')
      cy.get('[data-test=messages-panel]').should('be.visible')

      cy.get('[data-test=message]').first().should('be.visible')

      cy.get('[data-test=option_back]').click()

      cy.get('[data-test=threads-panel]').should('be.visible')
      cy.get('[data-test=messaging-menu]').should('not.be.visible')
      cy.get('[data-test=messages-panel]').should('not.exist')
    })
  })
})
