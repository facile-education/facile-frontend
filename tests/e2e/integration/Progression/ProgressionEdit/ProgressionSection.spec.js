import { now, url } from '../../../support/constants/progression'
import { createFromNewButtonMenu, selectTreeItem } from '../../../support/utils/progressionUtils'

const updatedSectionName = 'updatedSectionName'

describe('Section', () => {
  before(() => {
    cy.clock(now.toDate().getTime())

    cy.exec('npm run db:loadTables progression_tables.sql')
    cy.clearDBCache()
    cy.login(url + '/15401321')
    selectTreeItem('La notion de Héros') // Select empty section
  })

  it('can create section, sub-section, item from section', () => {
    // Section
    createFromNewButtonMenu('SECTION', 4)
    cy.get('.tree').contains('Section').should('exist')
    selectTreeItem('La notion de Héros') // Go back in original section
    // Sub-section
    createFromNewButtonMenu('SOUS-SECTION DE La notion de Héros', 4)
    cy.get('.tree').contains('.section', 'La notion de Héros').contains('Sous-section').should('exist')
    selectTreeItem('La notion de Héros') // Go back in original section
    // Item
    createFromNewButtonMenu('DEVOIR', 4)
    cy.get('.tree').contains('.section', 'La notion de Héros').contains('Devoir 1').should('exist')
  })

  it('can update section (name)', () => {
    cy.login(url + '/15401321')

    selectTreeItem('Section')
    cy.get('.folder-header > input').click().should('have.focus').clear().type(updatedSectionName + '{enter}')
    cy.get('.tree').contains(updatedSectionName).should('exist')
  })

  it('can delete section', () => {
    cy.login(url + '/15401321')

    selectTreeItem(updatedSectionName)
    cy.contains('button', 'Supprimer cette section').click()
    cy.get('[data-test=warning-modal]').find('[data-test=confirmButton]').click()
    cy.get('.tree').contains(updatedSectionName).should('not.exist')
    // Test the first section of the progression being selected after the section deletion
    cy.get('.tree').find('.tree-section').first().get('.section-name').should('have.class', 'selected')
  })
})
