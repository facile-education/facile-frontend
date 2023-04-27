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
      cy.get('[data-test=createMessagingFolder]').invoke('show').click() // TODO replace by user action like (hover)
      cy.get('input').type('My first personal folder', { force: true })
    })
    cy.globalKeyPress('{enter}') // Have to target the body element, so it can't be in the previous within()

    cy.log('Create a second personal Folder')
    cy.get('[data-test=messaging-menu]').within(() => {
      cy.get('[data-test=createMessagingFolder]').invoke('show').click()
      cy.get('input').type('My second personal folder', { force: true })
    })
    cy.globalKeyPress('{enter}')

    cy.get('[data-test=messaging-menu]').within(() => {
      cy.get('.personal-sub-folder').contains('My first personal folder').parent().as('firstFolderItem')
      cy.get('.personal-sub-folder').contains('sous-dossier').parent().as('thirdFolderItem')
      cy.get('.personal-sub-folder').contains('test').parent().as('fourthFolderItem')
      cy.get('.personal-sub-folder').contains('My second personal folder').parent().as('secondFolderItem')

      cy.log('Create personal subFolder')
      cy.get('[data-test=personalSubFolder-My\\ second\\ personal\\ folder]').find('[data-test=add]').invoke('show').click()
      cy.get('input').type('My subFolder', { force: true })
    })
    cy.globalKeyPress('{enter}')
    cy.get('[data-test=messaging-menu]').within(() => {
      cy.get('.personal-sub-folder').contains('My subFolder').parent().as('subFolderItem')
    })

    // Test folder navigation
    cy.log('Test folder navigation')
    cy.get('@secondFolderItem').click('top')
    cy.get('.personal-sub-folder').should('not.contain', 'My subFolder')
    cy.get('@secondFolderItem').click('top')
    cy.get('@subFolderItem').should('exist')
    cy.contains('Mes dossiers').click('top')
    cy.get('.personal-sub-folder').should('not.exist')
    cy.contains('Mes dossiers').click('top')
    cy.get('@firstFolderItem').should('exist')
    cy.get('@secondFolderItem').should('exist')
    cy.get('.personal-sub-folder').should('not.contain', 'My subFolder')

    // Test folder renaming
    cy.log('Test folder renaming')
    cy.get('@firstFolderItem').find('[data-test=rename]').invoke('show').click()
    cy.get('[data-test=messaging-menu]').within(() => {
      cy.get('input').type(' (modified)', { force: true })
    })
    cy.globalKeyPress('{enter}')
    cy.get('[data-test=messaging-menu]').within(() => {
      cy.get('.personal-sub-folder').contains('My first personal folder (modified)').parent().as('firstFolderItem')
    })

    // Delete folders
    cy.log('Delete folders')
    cy.get('@firstFolderItem').find('[data-test=delete]').invoke('show').click()
    cy.get('[data-test=warning-modal]').find('[data-test=confirmButton]').click()
    cy.get('.personal-sub-folder').should('not.contain', 'My first personal folder (modified)')
    cy.get('@secondFolderItem').find('[data-test=delete]').invoke('show').click()
    cy.get('[data-test=warning-modal]').find('[data-test=confirmButton]').click()
    cy.get('@thirdFolderItem').find('[data-test=delete]').invoke('show').click()
    cy.get('[data-test=warning-modal]').find('[data-test=confirmButton]').click()
    cy.get('@fourthFolderItem').find('[data-test=delete]').invoke('show').click()
    cy.get('[data-test=warning-modal]').find('[data-test=confirmButton]').click()
    cy.get('.personal-sub-folder').should('not.exist')
    cy.reload() // To be sure that the back data are up-to date
    cy.get('[data-test=option_toggleMessagingMenu]').click()
    cy.get('[data-test=messaging-menu]').within(() => {
      cy.contains('Mes dossiers')
      cy.get('.personal-sub-folder').should('not.exist')
    })
  })
})
