import { messagingURL } from '../../support/constants/urls'
import { HEADMASTER } from '../../support/constants/users'
import { getThread, waitMessagingToBeLoaded } from '../../support/utils/messagingUtils'

describe('Messaging navigation and structure', () => {
  beforeEach(() => {
    cy.loadTables('messaging/messaging_tables.sql')
    cy.fixture('messaging.json').as('messagingData')
    cy.login(HEADMASTER, messagingURL)
    waitMessagingToBeLoaded()
  })

  context('desktop', function () {
    it('Displays 2 areas', () => {
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
      cy.get('[data-test=threads-panel] > [data-test=thread-list-header]').within(() => {
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

    // Keyboard navigation
    it('keyboard navigation', function () {
      waitMessagingToBeLoaded()
      const totalThreads = this.messagingData.existingThreads

      for (let j = totalThreads.length - 1; j >= -1; j--) {
        if (j >= 0) {
          cy.get('body').type('{downArrow}')
          getThread(totalThreads[j]).find('.main').should('have.class', 'theme-background-color')
          getThread(totalThreads[j]).within(() => {
            cy.get('[data-test="unread-icon"]').should('be.not.exist')
          })
        } else {
          cy.get('[data-test="thread-list-item"]').last().find('.main').should('have.class', 'theme-background-color')
        }
      }
      for (let i = 1; i < totalThreads.length; i++) {
        if (i <= 3) {
          cy.get('body').type('{upArrow}')
          getThread(totalThreads[i]).find('.main').should('have.class', 'theme-background-color')
        } else {
          cy.get('[data-test="thread-list-item"]').first().find('.main').should('have.class', 'theme-background-color')
        }
      }
      cy.get('body').type('{del}')
      cy.get('.scroll').find('[data-test="thread-list-item"]').should('have.length', totalThreads.length - 1)
      cy.get('[data-test="option_toggleMessagingMenu"]').click()
      cy.get('[data-test="messaging-menu"]').within(() => {
        cy.contains('button', 'Corbeille').click()
      })
      cy.get('.scroll').find('[data-test="thread-list-item"]').should('have.length', 1)
    })

    // multiSelection ctrl
    it('Messaging_ThreadMultiSelection_ctrl', function () {
      waitMessagingToBeLoaded()
      // CTRL click
      const totalThreads = this.messagingData.existingThreads
      cy.get('body').type('{ctrl}', { release: false })
      // Select all threads with ctrl click
      for (let i = 0; i < totalThreads.length; i++) {
        getThread(totalThreads[i]).click()
      }

      // check if all threads have class : theme-background-color
      cy.get('[data-test="thread-list-item"]').each(() => {
        cy.get('[data-test="thread-list-item"]').find('div').should('have.class', 'theme-background-color')
      })
      cy.get('[data-test="thread-list-item"]').first().click()
      cy.get('[data-test="thread-list-item"]').first().should('not.have.class', 'theme-background-color')
      cy.get('body').type('{ctrl}', { release: true })
    })

    // multiSelection click --> shift
    it('Messaging_ThreadMultiSelection_click --> shift', function () {
      cy.get('[data-test="thread-list-item"]').first().click()
      cy.get('body').type('{shift}', { release: false })

      // Select all threads with shift click
      cy.get('[data-test="thread-list-item"]').last().click()

      // check if all threads have class : theme-background-color
      cy.get('.scroll').within(() => {
        cy.get('[data-test="thread-list-item"]').each(() => {
          cy.get('[data-test="thread-list-item"]').find('div').should('have.class', 'theme-background-color')
        })
      })
      cy.get('[data-test="thread-list-item"]').first().click()
      cy.get('.scroll').within(() => {
        cy.get('[data-test="thread-list-item"]').each(($element, index) => {
          console.log($element)
          if (index !== 0) { // Exclude the second element (for example)
            cy.wrap($element).find('.main').should('not.have.class', 'theme-background-color')
          }
        })
      })
    })

    // multiSelection shift --> click
    it('Messaging_ThreadMultiSelection_shift --> click', function () {
      cy.get('body').type('{shift}', { release: false })

      // Select all threads with shift click
      cy.get('[data-test="thread-list-item"]').first().click()
      cy.get('[data-test="thread-list-item"]').last().click()

      // check if all threads have class : theme-background-color
      cy.get('.scroll').within(() => {
        cy.get('[data-test="thread-list-item"]').each(() => {
          cy.get('[data-test="thread-list-item"]').find('div').should('have.class', 'theme-background-color')
        })
      })
      cy.get('[data-test="thread-list-item"]').first().click()
      cy.get('.scroll').within(() => {
        cy.get('[data-test="thread-list-item"]').each(($element, index) => {
          console.log($element)
          if (index !== 0) { // Exclude the second element (for example)
            cy.wrap($element).find('.main').should('not.have.class', 'theme-background-color')
          }
        })
      })
    })
  })

  context('mobile', function () {
    beforeEach(function () {
      cy.viewport('iphone-5')
      cy.fixture('messaging.json').as('messagingData')
      cy.login(HEADMASTER, messagingURL)
      waitMessagingToBeLoaded()
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

    // multiSelection option button
    it('multiSelection option button', function () {
      const totalThreads = this.messagingData.existingThreads

      cy.get('[data-test="option_toggleMultiSelection"]').click()
      for (let i = 0; i < totalThreads.length; i++) {
        getThread(totalThreads[i]).click()
      }

      // check if all threads have class : theme-background-color
      cy.get('[data-test="thread-list-item"]').each(() => {
        cy.get('[data-test="thread-list-item"]').find('div').should('have.class', 'theme-background-color')
      })
      cy.get('[data-test="thread-list-item"]').first().click()
      cy.get('[data-test="thread-list-item"]').first().should('not.have.class', 'theme-background-color')
    })
  })
})
