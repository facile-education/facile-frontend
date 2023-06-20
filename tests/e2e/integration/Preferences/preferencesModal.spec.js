import { HEADMASTER } from '../../support/constants'
import { url } from '../../support/constants/statistics'

describe('preference modal', () => {
  it('panels and closure behavior', () => {
    // Connection
    cy.login(url, HEADMASTER)
    cy.get('[data-test=togglePopoverMenu]').click()
    cy.get('[data-test=openPreferencesModal]').click()

    // Default tab
    cy.get('[data-test=account-tab]').should('exist')
    // Go on term of use tab
    cy.get('.tabs > :nth-child(2)').click() // access by property
    cy.get('[data-test=messaging-tab]').should('exist')
    // Return to the default tab
    cy.get('.tabs > :nth-child(1)').click()
    cy.get('[data-test=account-tab]').should('exist')

    // Test the closure of the modal
    cy.get('[data-test=closeModal]').click()
    cy.get('[data-test=informationModal]').should('not.exist')
  })

  context('change data', () => {
    beforeEach(function () {
      cy.exec('npm run db:loadTables preferences_tables.sql')
      cy.clearDBCache()
      cy.login(url, HEADMASTER) // land in 'dossier1'
      cy.get('[data-test=togglePopoverMenu]').click()
      cy.get('[data-test=openPreferencesModal]').click()
    })

    it('account-tab changes', () => {
      cy.get('[data-test=account-tab]').within(() => {
        cy.get('section.user-data').within(() => {
          cy.contains('Salvatore Di Dio')

          // Test the reportChange button
          cy.contains('button', 'Signaler un changement').click()
        })
      })
      cy.get('[data-test="supportModal"]').should('exist').within(() => {
        cy.get('[data-test="closeModal"]').click()
      })
      cy.get('[data-test=account-tab]').within(() => {
        cy.get('section.theme-color').within(() => {
          cy.get('.swatch').click().should('have.css', 'background-color').and('eq', 'rgb(231, 76, 60)')
          cy.get('.popover').find('.swatch').eq(0).click()
          cy.get('.popover').should('not.exist')
          cy.get('.swatch').should('have.css', 'background-color').and('not.eq', 'rgb(231, 76, 60)')
        })

        cy.get('section.activity-report').within(() => {
          cy.get('.base-dropdown').should('contain', 'Quotidien').click()
          cy.get('.base-dropdown > .base-autocomplete').should('be.visible')
          cy.contains('Hebdomadaire').click()
        })
      })

      // Close and re-open modal to see if change have been saved
      cy.get('[data-test="closeModal"]').click()
      cy.get('[data-test=openPreferencesModal]').click()
      cy.get('[data-test=account-tab]').within(() => {
        cy.get('section.theme-color').within(() => {
          cy.get('.swatch').should('have.css', 'background-color').and('not.eq', 'rgb(231, 76, 60)')
        })

        cy.get('section.activity-report').within(() => {
          cy.get('.base-dropdown').should('contain', 'Hebdomadaire')
        })
      })
    })

    it('messaging-tab changes', () => {
      cy.get('.tabs > :nth-child(2)').click() // access by property
      cy.get('[data-test=messaging-tab]').within(() => {
        cy.get('input[placeholder=\'Ajouter un couriel\']').type('test@gmail.com').type('{enter}')

        cy.contains('.param-header', ' Être averti par courriel').find('input').parent().find('span')
          .should('have.class', 'theme-background-color')
          .parent().click()
          .find('span').should('not.have.class', 'theme-background-color')

        cy.type_ckeditor('My new auto reply') // Match the last instance of ckEditor (i.e the auto reply one)
        cy.get('input[placeholder=\'Ajouter un couriel\']').click({ force: true, position: 'right' }) // Just click outside the ck editor to trigger save
      })
      // Tests modification save
      cy.get('[data-test="closeModal"]').click()
      cy.get('[data-test=openPreferencesModal]').click()
      cy.get('.tabs > :nth-child(2)').click() // access by property
      cy.get('[data-test=messaging-tab]').within(() => {
        cy.contains('test@gmail.com')
        cy.contains('.param-header', ' Être averti par courriel').find('input').parent().find('span')
          .should('not.have.class', 'theme-background-color')
        cy.contains('My new auto reply')
      })
    })
  })
})
