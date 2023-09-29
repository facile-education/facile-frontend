import dayjs from 'dayjs' // TODO import and set daysjs stuff elsewhere
import fr from 'dayjs/locale/fr'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'

import { SCHOOL_ADMIN } from '../../support/constants'
import { scheduleURL } from '../../support/constants/urls' // One of the resource-less service to load

dayjs.extend(LocalizedFormat)
dayjs.locale(fr)

const formatVersionDate = (date) => {
  return 'Mise à jour du ' + dayjs(date, 'YYY/MM/DD').format('DD MMMM YYYY')
}
const openVersionNotes = () => {
  cy.get('[data-test=togglePopoverMenu]').click()
  cy.get('[data-test=popover-menu]').within(() => {
    cy.contains('Nouveautés').click()
  })
  cy.get('[data-test=versionNoteModal]', { timeout: 5000 }).should('be.visible') // TODO: remove timout and make login with redirection method robust (automatically waits for the service to be full loaded (no request pending?))
}

const selectNoteInDropdown = (index) => {
  cy.get('[data-test="versionListDropDown"] > .button').click()
  cy.get('[data-test="versionListDropDown"]').get('ul.suggestion-list > li').eq(index).click()
}

describe('Version notes', () => {
  beforeEach(() => {
    cy.loadTables('versionNotes/version_notes_tables.sql')
    cy.fixture('versionNotes.json').as('versionNotesData') // Aliases are deleted between each test so define it here
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

  it('Admin can create new version note', function () {

  })

  it('Admin can update an existing version note', function () {

  })

  it('Admin can delete an existing version note', function () {

  })
})
