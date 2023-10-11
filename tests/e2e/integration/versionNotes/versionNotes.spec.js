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

describe('Version notes', () => {
  beforeEach(() => {
    cy.loadTables('versionNotes/version_notes_tables.sql')
    cy.fixture('versionNotes.json').as('versionNotesData') // Load in beforeEach to be accessible from 'this' in tests
  })

  it('contains the sorted list of version notes', function () {
    const lastVersion = this.versionNotesData.databaseExistingNotes[0]
    const middleVersion = this.versionNotesData.databaseExistingNotes[1]
    const firstVersion = this.versionNotesData.databaseExistingNotes[2]

    cy.login(HEADMASTER, scheduleURL)
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

  // CHECK NOTIF
  it('notification behaviour', function () {
    cy.login(STUDENT, scheduleURL)
    cy.get('[data-test=togglePopoverMenu]').click()
    cy.get('[data-test=popover-menu]').within(() => {
      cy.contains('li', 'Nouveautés').find('.pellet').should('be.visible')
      cy.contains('Nouveautés').click()
    })
    // Find Banner User Profil Pellet
    cy.get('[data-test=togglePopoverMenu').find('.pellet').should('be.visible')
    cy.get('[data-test="closeModal"]').click()
    cy.get('[data-test=popover-menu]').within(() => {
      cy.contains('li', 'Nouveautés').find('.pellet').should('not.exist')
    })
    cy.get('[data-test=togglePopoverMenu').find('.pellet').should('not.exist')
  })

  // CREATE
  it('admin can create new version note', function () {
    const noteCreate = this.versionNotesData.noteToCreate

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
    cy.get('[data-test="closeModal"]').click()
  })

  // UPDATE
  it('admin can update an existing version note', function () {
    const noteModified = this.versionNotesData.modifiedText

    cy.login(GLOBAL_ADMIN, scheduleURL)
    openVersionNotes()

    cy.get('[aria-label="Options"] > img').click()
    cy.contains('button', 'Modifier').click()
    cy.get('[data-test="saveVersionNoteModal"]').within(() => {
      cy.get('.ck-editor')
      cy.type_ckeditor(noteModified)
      cy.contains('button', 'Modifier').click()
    })
    cy.get('.version-note-details').contains(noteModified)
    cy.get('[data-test="closeModal"]').click()
  })

  // DELETE
  it('admin can delete an existing version note', function () {
    const totalNote = this.versionNotesData.databaseExistingNotes
    cy.login(GLOBAL_ADMIN, scheduleURL)
    openVersionNotes()

    cy.get('[aria-label="Options"] > img').click()
    cy.contains('button', 'Supprimer').click()
    cy.contains('button', 'Continuer').click()
    cy.get('[data-test="versionListDropDown"] > .button').click()
    cy.get('.suggestion-list').find('li').should('have.length', totalNote.length - 1)
  })
})
