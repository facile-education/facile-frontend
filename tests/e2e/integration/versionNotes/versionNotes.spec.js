import { scheduleURL } from '../../support/constants/urls' // One of the resource-less service to load
import { SCHOOL_ADMIN } from '../../support/constants/users'

/* =========== Local methods ============= */
const openVersionNotes = () => {
  cy.get('[data-test=togglePopoverMenu]').click()
  cy.get('[data-test=popover-menu]').within(() => {
    cy.contains('Nouveautés').click()
  })
  cy.get('[data-test=versionNoteModal]', { timeout: 5000 }).should('be.visible') // TODO: find why timeout is necessary and remove it
}
const selectNoteInDropdown = (index) => {
  cy.get('[data-test="versionListDropDown"] > .button').click()
  cy.get('[data-test="versionListDropDown"]').get('ul.suggestion-list > li').eq(index).click()
}

const formatVersionDate = (date) => {
  return 'Mise à jour du ' + Cypress.dayjs(date, 'YYY/MM/DD').format('DD MMMM YYYY')
}

/* =========== Tests ============= */

describe('Version notes', () => {
  beforeEach(() => {
    cy.loadTables('versionNotes/version_notes_tables.sql')
    cy.fixture('versionNotes.json').as('versionNotesData')
  })

  it('contains the sorted list of version notes', function () {
    const lastVersion = this.versionNotesData.databaseExistingNotes[0]
    const middleVersion = this.versionNotesData.databaseExistingNotes[1]
    const firstVersion = this.versionNotesData.databaseExistingNotes[2]

    cy.login(SCHOOL_ADMIN, scheduleURL)
    openVersionNotes()

    cy.get('[data-test=versionNoteModal]').within(() => {
      // Check if the last version is selected by default
      cy.get('[data-test="versionListDropDown"] > .button').contains(formatVersionDate(lastVersion.date))
      cy.contains(`${lastVersion.content}`)
      // Check if version are sorted by date in dropdown and test content
      selectNoteInDropdown(1)
      cy.contains(`${middleVersion.content}`)
      selectNoteInDropdown(2)
      cy.contains(`${firstVersion.content}`)
    })
  })

  it('notification behaviour', function () {

  })

  it('admin can create new version note', function () {

  })

  it('admin can update an existing version note', function () {

  })

  it('admin can delete an existing version note', function () {

  })
})
