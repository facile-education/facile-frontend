import { url } from '../../support/constants/messaging'
import { HEADMASTER } from '../../support/constants'
import { waitMessagingToBeLoaded } from '../../support/utils/messagingUtils'

describe('Personal folders', () => {
  before(() => {
    cy.exec('npm run db:loadTables messaging_tables.sql')
    cy.clearDBCache()
    cy.login(url, HEADMASTER)
    waitMessagingToBeLoaded()
  })

  it('Manage personal folders (create, rename, delete)', () => {
    cy.log('Open messaging menu')
    cy.get('[data-test=option_toggleMessagingMenu]').click()
    cy.log('Create a first personal Folder')
    cy.get('[data-test=messaging-menu]').within(() => {
      cy.get('[data-test=folder-actions]').invoke('show') // TODO replace by user action like (hover)
      cy.get('[data-test=createMessagingFolder]').should('be.visible').click()
      cy.get('input').type('My first personal folder')
    })
    cy.globalKeyPress('{enter}') // Have to target the body element, so it can't be in the previous within()

    cy.log('Create a second personal Folder')
    cy.get('[data-test=messaging-menu]').within(() => {
      cy.get('[data-test=folder-actions]').invoke('show')
      cy.get('[data-test=createMessagingFolder]').should('be.visible').click()
      cy.get('input').type('My second personal folder')
    })
    cy.globalKeyPress('{enter}')

    cy.get('[data-test=messaging-menu]').within(() => {
      cy.get('.personal-sub-folder').contains('My first personal folder').parent().as('firstFolderItem')
      cy.get('.personal-sub-folder').contains('sous-dossier').parent().as('thirdFolderItem')
      cy.get('.personal-sub-folder').contains('test').parent().as('fourthFolderItem')
      cy.get('.personal-sub-folder').contains('My second personal folder').parent().as('secondFolderItem').trigger('mouseover')

      cy.log('Create personal subFolder')
      cy.get('.folder-actions > .add').click()
      cy.get('input').type('My subFolder')
    })
    cy.globalKeyPress('{enter}')
    cy.get('[data-test=messaging-menu]').within(() => {
      cy.get('.personal-sub-folder').contains('My subFolder').parent().as('subFolderItem')
    })

    // Test folder navigation
    cy.log('Test folder navigation')
    cy.get('@secondFolderItem').click()
    cy.get('.personal-sub-folder').should('not.contain', 'My subFolder')
    cy.get('@secondFolderItem').click()
    cy.get('@subFolderItem').should('exist')
    cy.contains('Mes dossiers').click()
    cy.get('.personal-sub-folder').should('not.exist')
    cy.contains('Mes dossiers').click()
    cy.get('@firstFolderItem').should('exist')
    cy.get('@secondFolderItem').should('exist')
    cy.get('.personal-sub-folder').should('not.contain', 'My subFolder')

    // Test folder renaming
    cy.log('Test folder renaming')
    cy.get('@firstFolderItem').trigger('mouseover').within(() => {
      cy.get('.edit').click()
    })
    cy.get('[data-test=messaging-menu]').within(() => {
      cy.get('input').type(' (modified)')
    })
    cy.globalKeyPress('{enter}')
    cy.get('[data-test=messaging-menu]').within(() => {
      cy.get('.personal-sub-folder').contains('My first personal folder (modified)').parent().as('firstFolderItem')
    })

    // Delete folders
    cy.log('Delete folders')
    cy.get('@firstFolderItem').trigger('mouseover').within(() => {
      cy.get('.delete').click()
    })
    cy.get('[data-test=warning-modal]').find('[data-test=confirmButton]').click()
    cy.get('.personal-sub-folder').should('not.contain', 'My first personal folder (modified)')
    cy.get('@secondFolderItem').trigger('mouseover').within(() => {
      cy.get('.delete').click()
    })
    cy.get('[data-test=warning-modal]').find('[data-test=confirmButton]').click()
    cy.get('@thirdFolderItem').trigger('mouseover').within(() => {
      cy.get('.delete').click()
    })
    cy.get('[data-test=warning-modal]').find('[data-test=confirmButton]').click()
    cy.get('@fourthFolderItem').trigger('mouseover').within(() => {
      cy.get('.delete').click()
    })
    cy.get('[data-test=warning-modal]').find('[data-test=confirmButton]').click()
    cy.get('.personal-sub-folder').should('not.exist')
    cy.reload() // To be sure that the back data are up-to date
    cy.get('[data-test=messaging-menu]').within(() => {
      cy.contains('Mes dossiers')
      cy.get('.personal-sub-folder').should('not.exist')
    })
  })
})
