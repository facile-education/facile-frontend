import { now, url } from '../../../support/constants/progression'
import { createFromNewButtonMenu, selectTreeItem } from '../../../support/utils/progressionUtils'

const updatedSubSectionName = 'updatedSubSectionName'

describe('Sub-section', () => {
  before(() => {
    cy.clock(now.toDate().getTime())

    cy.exec('npm run db:loadTables progression_tables.sql')
    cy.clearDBCache()
    cy.login(url + '/15401321')
    selectTreeItem('Le Pouvoir') // Unfold section
    selectTreeItem('Projets') // select empty sub-section
  })

  it('can create section, sub-section, item from sub-section', () => {
    // Section
    createFromNewButtonMenu('SECTION', 4)
    cy.get('.tree').contains('Section').should('exist')
    selectTreeItem('Projets') // Go back in original sub-section
    // Sub-section
    createFromNewButtonMenu('SOUS-SECTION DE Le Pouvoir', 4)
    cy.get('.tree').contains('.section', 'Le Pouvoir').contains('Sous-section').should('exist')
    selectTreeItem('Projets') // Go back in original sub-section
    // Item
    createFromNewButtonMenu('DEVOIR', 4)
    cy.get('.tree').contains('.tree-subsection', 'Projets').contains('Devoir 1').should('exist')
  })

  it('can update sub-section (name)', () => {
    cy.login(url + '/15401321')

    selectTreeItem('Le Pouvoir') // Unfold section
    selectTreeItem('Projets') // select empty sub-section
    cy.get('.folder-header > input').click().should('have.focus').clear().type(updatedSubSectionName + '{enter}')
    cy.get('.tree').contains('.section', 'Le Pouvoir').contains(updatedSubSectionName).should('exist')
  })

  it('can delete sub-section', () => {
    cy.login(url + '/15401321')

    selectTreeItem(updatedSubSectionName)
    cy.contains('button', 'Supprimer cette section').click()
    cy.get('[data-test=warning-modal]').find('[data-test=confirmButton]').click()
    cy.get('.tree').contains(updatedSubSectionName).should('not.exist')
    // The selection now have to be the parent section of subSection
    cy.get('.tree').contains('.section', 'Le Pouvoir').get('.section-name').should('have.class', 'selected')
  })
})
