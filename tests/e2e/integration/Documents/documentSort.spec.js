import { documentURL } from '../../support/constants/urls'
import { HEADMASTER } from '../../support/constants/users'
import { waitDocumentServiceToBeLoaded } from '../../support/utils/documents'

describe('Documents_SortDocuments', () => {
  beforeEach(() => {
    cy.fixture('documents.json').as('documentsData').then(documentsData => {
      // Go at sub folder level
      cy.login(HEADMASTER, documentURL)

      waitDocumentServiceToBeLoaded()
    })
  })

  it.skip('Sort well', () => {
    cy.get('[data-cy=document]').as('docs').should('have.length', 4)
    // Initial sort: alphanumeric (asc)
    cy.get('@docs').eq(0).should('contain', 'dossier1')
    cy.get('@docs').eq(1).should('contain', 'dossier2')
    cy.get('@docs').eq(2).should('contain', 'fichier1.html')
    cy.get('@docs').eq(3).should('contain', 'fichier2.html')

    // Alphanumeric (desc)
    cy.get('[data-test=fields]').contains('Nom').click()
    cy.get('[data-cy=document]').as('docs').eq(0).should('contain', 'dossier2')
    cy.get('@docs').eq(1).should('contain', 'dossier1')
    cy.get('@docs').eq(2).should('contain', 'fichier2.html')

    // TODO modify dump to have differents document dates
    // // Last modif (desc)
    // cy.get('[data-test=fields]').contains('Dernière modif.').click()
    // cy.get('[data-cy=document]').as('docs').eq(0).should('contain', 'Dossier WEBDAV')
    // cy.get('@docs').eq(1).should('contain', 'Icônes')
    // cy.get('@docs').eq(2).should('contain', 'Di Dio Salvatore - Rapport d_import des parents.csv')
    //
    // // Last modif (asc)
    // cy.get('[data-test=fields]').contains('Dernière modif.').click()
    // cy.get('[data-cy=document]').as('docs').eq(0).should('contain', 'Icônes')
    // cy.get('@docs').eq(1).should('contain', 'Dossier WEBDAV')
    // cy.get('@docs').eq(2).should('contain', 'NOte.jpg')
  })
})
