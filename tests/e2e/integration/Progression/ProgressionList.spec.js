import { now, url } from '../../support/constants/progression'

const progressionToCreate = {
  name: 'My new progression',
  discipline: 'Mathematiques',
  volee: '10'
}

const updatedProgression = {
  name: 'My updated progression',
  discipline: 'Allemand',
  volee: '11'
}

describe('Progression list', () => {
  before(() => {
    cy.clock(now.toDate().getTime())

    cy.exec('npm run db:loadTables progression_tables_no_progression.sql')
    cy.clearDBCache()
    cy.login(url)
  })

  it('Progression creation/modification/suppression from scratch', () => {
    // Test placeholder
    cy.contains('Aucun contenu existant.')
    cy.contains('a', 'Ajouter votre progression').click()
    cy.get('[data-test=edit-progression-modal]').find('.close').click()
    cy.get('[data-test=edit-progression-modal]').should('not.exist')

    // Progression creation
    cy.contains('button', 'NOUVEAU').click()
    // Modal
    cy.get('[data-test=edit-progression-modal]').within(() => {
      cy.contains('button', 'Créer').should('have.class', 'disabled').click()
      cy.get('label:contains(Champ requis)').should('have.length', 3)

      cy.get('input').type(progressionToCreate.name)
      cy.get('.base-dropdown.subject').click().within(() => {
        cy.get('li').contains(progressionToCreate.discipline).click()
      })
      cy.get('.base-dropdown.volee').click().within(() => {
        cy.get('li').should('have.length', 4).contains(progressionToCreate.volee).click()
      })

      cy.contains('button', 'Créer').should('not.have.class', 'disabled').click()
    })

    // Progression verification
    cy.get('[data-test=edit-progression-modal]').should('not.exist')
    cy.get('[data-test=progression-item]').should('have.length', 1).and('be.visible').within(() => {
      cy.contains(progressionToCreate.name)
      cy.contains(progressionToCreate.discipline)
      cy.contains(progressionToCreate.volee)

      cy.get('[data-test=edit-progression-icon]').click()
    })

    // Progression modification
    cy.get('[data-test=edit-progression-modal]').within(() => {
      cy.get('input').clear().type(updatedProgression.name)
      cy.get('.base-dropdown.subject').click().within(() => {
        cy.get('li').contains(updatedProgression.discipline).click()
      })
      cy.get('.base-dropdown.volee').click().within(() => {
        cy.get('li').should('have.length', 4).contains(updatedProgression.volee).click()
      })

      cy.contains('button', 'Modifier').should('not.have.class', 'disabled').click()
    })

    // Progression verification
    cy.get('[data-test=edit-progression-modal]').should('not.exist')
    cy.get('[data-test=progression-item]').should('have.length', 1).and('be.visible').within(() => {
      cy.contains(updatedProgression.name)
      cy.contains(updatedProgression.discipline)
      cy.contains(updatedProgression.volee)

      cy.get('[data-test=delete-progression-icon]').click()
    })

    // Progression suppression (warning modal)
    cy.get('[data-test=warning-modal]').find('[data-test=confirmButton]').click()

    // Placeholder verification
    cy.contains('Aucun contenu existant.')
  })

  // TODO
  it('test filters', () => {
  //   cy.exec('npm run db:loadTables progression_tables.sql')
  //   cy.clearDBCache()
  //   cy.login(url)
  //
  //   cy.contains('')
  })
})
