import { url } from '../../support/constants/groups'
import { HEADMASTER } from '../../support/constants'

describe('Group Details', () => {
  // before(() => {
  //   // cy.exec('npm run db:loadTables groups_tables_basic.sql')
  //   // cy.clearDBCache()
  //   cy.login(url, HEADMASTER)
  // })

  beforeEach(() => {
    cy.login(url, HEADMASTER)
  })

  it('Test group panel', () => {
    // Open panel
    cy.contains('[data-test=group-item]', 'groupTest').click()
    cy.get('[data-test=group-details-panel]').should('exist')

    // Close
    cy.get('[data-test=close-panel]').click()
    cy.get('[data-test=group-details-panel]').should('not.exist')

    // Open panel
    cy.contains('[data-test=group-item]', 'groupTest').click()
    cy.get('[data-test=group-details-panel]').should('exist')

    // Panel Options (test on option tests)
  })

  it('Test group data', () => {
    // Open panel
    cy.contains('[data-test=group-item]', 'groupTest').click()
    cy.get('[data-test=group-details-panel]').within(() => {
      // Expiration Date
      cy.contains('Expire le 01 sept. 2023')

      // Description
      cy.contains('test') // todo: have a better description (unique string in panel)

      // Members
      cy.contains('5 Membres')
      // test toggle
      cy.contains('Di Dio Salvatore').should('not.exist')
      cy.contains('1 Administrateur').click()
      cy.contains('Di Dio Salvatore').should('exist')
      cy.contains('1 Administrateur').click()
      cy.contains('Di Dio Salvatore').should('not.exist')

      cy.contains('1 Enseignant').click()
      cy.contains('Mendez Isabel')

      cy.contains('1 Elève').click()
      cy.contains('ALOSTA ANYA').should('exist')
      cy.contains('1 Responsable légal').click()
      cy.contains('ROUSAN DYALA').should('exist')
      cy.contains('2 Personnels').click()
      cy.contains('Berisha Erona').click() // test Messaging Modal
      cy.get('[data-test=send-message]').click()
    })

    cy.get('[data-test="createMessageModal"]').within(() => {
      cy.contains('.recipients', 'Berisha Erona').should('exist')
      cy.get('[data-test="closeModal"]').click()
    })

    // Access to documents
    cy.get('[data-test=group-details-panel]').within(() => {
      cy.contains('a', 'Accéder aux documents').click()
    })

    cy.url().should('contain', Cypress.config().baseUrl + '/nero/documents/groups/') // TODO: replace 'nero/documents' by the appropriated constant
    cy.get('[data-test="breadcrumb"]').within(() => {
      cy.contains('.current-folder', 'groupTest')
    })
  })

  it('Test expired group data', () => {
    // Todo
    // test panel options
  })

  it('Test group Activity', () => {
    // Open panel
    cy.contains('[data-test=group-item]', 'groupTest').click()
    cy.get('[data-test=group-details-panel]').within(() => {
      cy.contains('Activités').click()

      // Can be a bit long should we add a wait/sleep ?

      // Test activities
      cy.get('.activity').eq(0)
        .should('contain', 'Salvatore Di Dio')
        .should('contain', 'a inscrit')
        .should('contain', 'DYALA ROUSAN')

      cy.get('.activity').eq(1)
        .should('contain', 'Salvatore Di Dio')
        .should('contain', 'a supprimé')
        .should('contain', 'Alexandre Regad')

      /*
      cy.get('.activity').eq(2)
        .should('contain', 'Salvatore Di Dio')
        .should('contain', 'a supprimé le fichier')
        .should('contain', 'document de groupe.html')

      cy.get('.activity').eq(3)
        .should('contain', 'Salvatore Di Dio')
        .should('contain', 'a partagé le fichier')
        .should('contain', 'document de groupe.html')
      */
    })
  })
})
