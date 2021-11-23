import { now, url } from '../../../support/constants/progression'

const newSectionName = 'Ma nouvelle section'

describe('Edit view on empty progression', () => {
  beforeEach(() => {
    cy.clock(now.toDate().getTime())

    cy.exec('npm run db:loadTables progression_tables_empty.sql')
    cy.clearDBCache()
    cy.login(url + '/15401321')
  })

  it('Test placeholder, and section creation', () => {
    // Test create button option
    cy.contains('button', 'NOUVEAU').as('newButton').click()
    cy.get('[data-test=create-menu]').children().should('have.length', 1)
      .and('contain', 'SECTION')
    cy.get('@newButton').click()
    cy.get('[data-test=create-menu]').should('not.exist')

    // Test placeHolder and create new section via placeholder
    cy.contains('Ajouter le premier contenu de votre progression!').click()
    cy.get('[data-test=create-menu]').contains('SECTION').click()
    cy.get('.folder-header > input').should('have.value', 'Section').and('have.focus').type(newSectionName + '{enter}')

    // The new section has been created
    cy.get('.tree').contains('.section-name', newSectionName).should('have.class', 'selected')
    cy.contains('Cette section est vide')

    // Once the section will created, test if the section is selected by default when we load the view
    cy.reload()
    cy.get('.tree').contains('.section-name', newSectionName).should('have.class', 'selected')
  })
})
