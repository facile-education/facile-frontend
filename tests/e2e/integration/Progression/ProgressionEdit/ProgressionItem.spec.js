import { now, url } from '../../../support/constants/progression'
import { createFromNewButtonMenu, selectTreeItem } from '../../../support/utils/progressionUtils'

const updatedItemName = 'updatedItemName'

describe('Items', () => { // TODO Mind how to handle differences between devoirs and séances
  beforeEach(() => {
    cy.clock(now.toDate().getTime())

    cy.exec('npm run db:loadTables progression_tables.sql')
    cy.clearDBCache()
    cy.login(url + '/15401321')
    selectTreeItem('Le Pouvoir') // Unfold section
    selectTreeItem('Grammaire') // Unfold sub-section
    selectTreeItem('Introduction') // select empty sub-section
  })

  it('can create section, sub-section, item from item', () => {
    // Section
    createFromNewButtonMenu('SECTION', 4)
    cy.get('.tree').contains('Section').should('exist')
    selectTreeItem('Introduction') // Go back in original item
    // Sub-section
    createFromNewButtonMenu('SOUS-SECTION DE Le Pouvoir', 4)
    cy.get('.tree').contains('.section', 'Le Pouvoir').contains('Sous-section').should('exist')
    selectTreeItem('Introduction') // Go back in original item
    // Item
    createFromNewButtonMenu('DEVOIR', 4)
    cy.get('.tree').contains('.tree-subsection', 'Grammaire').contains('Devoir 2').should('exist')
  })

  it('can update item (name)', () => {
    cy.login(url + '/15401321')

    selectTreeItem('Le Pouvoir') // Unfold section
    selectTreeItem('Grammaire') // Unfold sub-section
    selectTreeItem('Introduction') // select empty sub-section
    cy.get('.progression-item').find('input').click().should('have.focus').clear().type(updatedItemName + '{enter}')
    cy.get('.tree').contains('.tree-subsection', 'Grammaire').contains(updatedItemName).should('exist')
  })

  it('can delete item', () => {
    cy.login(url + '/15401321')

    selectTreeItem('Le Pouvoir') // Unfold section
    selectTreeItem('Grammaire') // Unfold sub-section
    selectTreeItem('Devoir 1')
    cy.get('.delete-item').click()
    cy.get('[data-test=warning-modal]').find('[data-test=confirmButton]').click()
    cy.get('.tree').contains('Devoir 1').should('not.exist')
    // The selection now have to be the parent sub-section
    cy.get('.tree').contains('.tree-subsection', 'Grammaire').get('.subsection-header').should('have.class', 'selected')
  })
})
