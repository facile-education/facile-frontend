import { scheduleURL } from '../../support/constants/urls' // One of the resource-less service to load
import { GLOBAL_ADMIN, HEADMASTER, STUDENT } from '../../support/constants/users'

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
  return cy.get('[data-test="versionListDropDown"]').get('ul.suggestion-list > li').eq(index).click()
}

const formatVersionDate = (date) => {
  return 'Mise à jour du ' + Cypress.dayjs(date, 'YYY/MM/DD').format('DD MMMM YYYY')
}

/* =========== Tests ============= */

describe('VersionNotes_ReadNotes', () => {
  beforeEach(() => {
    cy.fixture('versionNotes.json').as('versionNotesData') // Load in beforeEach to be accessible from 'this' in tests
  })

  it('VersionNotes_ReadNotes_ContainsTheSortedListOfVersionNotes', function () {
    cy.loadTables('versionNotes/version_notes_tables.sql')
    const lastVersion = this.versionNotesData.databaseExistingNotes[0]
    const middleVersion = this.versionNotesData.databaseExistingNotes[1]
    const firstVersion = this.versionNotesData.databaseExistingNotes[2]

    cy.login(HEADMASTER, scheduleURL)
    openVersionNotes()

    cy.get('[data-test=versionNoteModal]').within(() => {
      // Check if the last version is selected by default
      cy.get('[data-test="versionListDropDown"] > .button').contains(formatVersionDate(lastVersion.date))
      cy.contains(lastVersion.content)
      // Check if version are sorted by date in dropdown and test content
      selectNoteInDropdown(1)
      cy.contains(middleVersion.content)
      selectNoteInDropdown(2)
      cy.contains(firstVersion.content)
    })
  })

  // CHECK NOTIF
  it.only('VersionNotes_Notification_NotificationBehaviour', function () {
    cy.loadTables('versionNotes/version_notes_tables.sql')
    cy.login(STUDENT, scheduleURL)

    // Find Banner User Profil Pellet
    cy.get('[data-test=togglePopoverMenu').find('.pellet').should('be.visible')

    // Find pellet popover menu
    cy.get('[data-test=togglePopoverMenu]').click()
    cy.get('[data-test=popover-menu]').within(() => {
      cy.contains('li', 'Nouveautés').find('.pellet').should('be.visible')
      cy.contains('li', 'Nouveautés').click()
    })

    // Test if pellet doesn't exist anymore
    cy.get('[data-test="closeModal"]').click()
    cy.get('[data-test=togglePopoverMenu]').click()
    cy.get('[data-test=popover-menu]').within(() => {
      cy.contains('li', 'Nouveautés').find('.pellet').should('not.exist')
    })
    cy.get('[data-test=togglePopoverMenu').find('.pellet').should('not.exist')
  })

  it('VersionNotes_Notification_PelletIsNotVisibleIfNoVersionNoteExist', function () {
    cy.loadTables('versionNotes/version_notes_tables_empty.sql')
    cy.login(STUDENT, scheduleURL)

    cy.intercept(
      { method: 'GET', url: '**/get-user-infos*' }
    ).as('waitUserInfo')

    cy.wait('@waitUserInfo')

    // Find Banner User Profil Pellet
    cy.get('[data-test=togglePopoverMenu').should('be.visible')
    cy.get('[data-test=togglePopoverMenu').find('.pellet').should('not.exist')

    // Find pellet popover menu
    cy.get('[data-test=togglePopoverMenu]').click()
    cy.get('[data-test=popover-menu]').within(() => {
      cy.contains('li', 'Nouveautés').find('.pellet').should('not.exist')
    })
  })

  // CREATE
  it('VersionNotes_Creation_AdminCreateVersionNote', function () {
    cy.loadTables('versionNotes/version_notes_tables.sql')
    const noteCreate = this.versionNotesData.noteToCreate

    // Check if button "Nouveau" dosesn't exist
    cy.login(STUDENT, scheduleURL)
    openVersionNotes()
    cy.get('[data-test=versionNoteModal]').should('not.contain', 'button', 'Nouveau')

    // Create note
    cy.login(GLOBAL_ADMIN, scheduleURL)
    openVersionNotes()

    cy.get('[data-test=versionNoteModal]').within(() => {
      cy.contains('button', 'Nouveau').click()
    })
    cy.get('[data-test=saveVersionNoteModal]').within(() => {
      cy.contains('button', 'Créer').click()
      cy.get('.labelled').type(noteCreate.title)
      cy.type_ckeditor(noteCreate.content)
      cy.contains('button', 'Créer').click()
    })
  })

  // UPDATE
  it('VersionNotes_Modification_AdminUpdateVersionNote', function () {
    cy.loadTables('versionNotes/version_notes_tables.sql')
    const noteModified = this.versionNotesData.modifiedText

    cy.login(GLOBAL_ADMIN, scheduleURL)
    openVersionNotes()

    cy.get('[data-test="buttonToggleOptions"]').click()
    cy.contains('button', 'Modifier').click()
    cy.get('[data-test="saveVersionNoteModal"]').within(() => {
      cy.type_ckeditor(noteModified)
      cy.contains('button', 'Modifier').click()
    })
    cy.get('.version-note-details').contains(noteModified)
  })

  // DELETE
  it('VersionNotes_Deletion_AdminDeleteVersionNote', function () {
    cy.loadTables('versionNotes/version_notes_tables.sql')
    const Notes = this.versionNotesData.databaseExistingNotes

    cy.login(GLOBAL_ADMIN, scheduleURL)
    openVersionNotes()

    // Check if last note exist
    cy.get('[data-test="versionListDropDown"] > .button').should('contain', formatVersionDate(Notes[0].date))
    cy.get('.version-note-details').should('contain', Notes[0].content)

    // Delete Note
    cy.get('[data-test="buttonToggleOptions"]').click()
    cy.contains('button', 'Supprimer').click()
    cy.get('[data-test="warning-modal"]').within(() => {
      cy.contains('button', 'Continuer').click()
    })

    // Check if last note doesn't exist
    cy.get('[data-test="versionListDropDown"] > .button').click()
    cy.get('.suggestion-list').find('li').should('have.length', Notes.length - 1)
    cy.get('[data-test="versionListDropDown"] > .button').should('not.contain', formatVersionDate(Notes[0].date))
    cy.get('.version-note-details').should('not.contain', Notes[0].content)
  })
})
