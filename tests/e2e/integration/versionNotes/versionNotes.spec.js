import { SCHOOL_ADMIN } from '../../support/constants'
import { scheduleURL } from '../../support/constants/urls' // One of the resource-less service to load

const openVersionNotes = () => {
  cy.get('[data-test=togglePopoverMenu]').click()
  cy.get('[data-test=popover-menu]').within(() => {
    cy.contains('Nouveautés').click()
  })
  cy.get('[data-test=versionNoteModal]', { timeout: 5000 }).should('be.visible') // TODO: remove timout and make login with redirection method robust (automatically waits for the service to be full loaded (no request pending?))
}

describe('Version notes', () => {
  beforeEach(() => {
    cy.fixture('versionNotes.json').as('versionNotesData') // Aliases are deleted between each test so define it here
  })

  it('contains the sorted list of version notes', function () {
    cy.login(SCHOOL_ADMIN, scheduleURL)
    openVersionNotes()

    cy.get('[data-test=versionNoteModal]').within(() => {
      cy.contains(`${this.versionNotesData.databaseExistingNotes[0].content}`)
    })
  })
})
