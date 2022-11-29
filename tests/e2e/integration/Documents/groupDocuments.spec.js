import { groupDocUrl } from '../../support/constants/documents'
import { HEADMASTER } from '../../support/constants'

describe('Group documents', () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      console.log(err, runnable)
      return false
    })
    // Not load table because it depends only of the groups
    cy.login(groupDocUrl, HEADMASTER) // land in 'dossier1'
  })

  it('navigation / behaviour', () => {
    cy.get('.grid-document').should('have.length', 12)

    cy.get('[data-test="breadcrumb"]').find('.current-folder', 'Collaboratifs')

    cy.contains('.grid-document', 'groupTest').should('exist').dblclick()
    cy.get('[data-test="breadcrumb"]').find('.current-folder', 'groupTest')
    cy.get('.list-document').should('have.length', 1).should('contain', 'document de groupe.html')
    cy.get('.grid-document').should('not.exist')
  })

  it('mobile behaviour', () => {
    cy.viewport('iphone-5')

    cy.get('.grid-document').should('have.length', 12)

    cy.contains('.grid-document', 'groupTest').find('[data-test="open-details-icon"]').click()

    cy.get('[data-test=groups-details-modal]').should('exist')
    cy.get('[data-test="closeModal"]').click()

    cy.contains('.grid-document', 'groupTest').should('exist').dblclick()
    cy.get('[data-test="breadcrumb"]').find('.current-folder', 'groupTest')
    cy.get('.list-document').should('have.length', 1).should('contain', 'document de groupe.html')
    cy.get('.grid-document').should('not.exist')
  })

  it('détails Panel', () => {
    cy.contains('.grid-document', 'groupTest').should('exist').click()

    cy.get('[data-test=group-details-panel]').within(() => {
      // Description
      cy.contains('.description').should('not.exist')

      // Access to documents
      cy.contains('button', 'Accéder aux documents').should('not.exist')

      // Activity panel
      cy.contains('Activités').click()

      cy.contains('Fil d\'activité').should('exist')

      // Test activities (should only contains the doc activities
      cy.get('.activity').should('have.length', 2)
      cy.get('.activity').eq(0)
        .should('contain', 'Salvatore Di Dio')
        .should('contain', 'a partagé le fichier')
        .should('contain', 'document de groupe.html')
      cy.get('.activity').eq(1)
        .should('contain', 'Salvatore Di Dio')
        .should('contain', 'a supprimé le fichier')
        .should('contain', 'document de groupe.html')
    })
  })
})
