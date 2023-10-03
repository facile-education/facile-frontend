import { messagingURL } from '../../support/constants/urls'
import { SCHOOL_ADMIN } from '../../support/constants/users'
import { exactString } from '../../support/utils/testUtils'

const openMessagingMenu = () => {
  cy.get('[data-test=option_toggleMessagingMenu]', { timeout: 5000 }).click()
  cy.get('[data-test=messaging-menu]').should('be.visible')
}

describe('Personal folders', () => {
  beforeEach(() => {
    cy.loadTables('messaging/messaging_tables.sql')
    cy.login(SCHOOL_ADMIN, messagingURL)
    cy.fixture('messaging.json').as('messagingData') // Load in beforeEach to be accessible from 'this' in tests

    openMessagingMenu()
  })

  const sizes = ['iphone-5', 'ipad-2', [1024, 768]]

  sizes.forEach(size => {
    it(`Consulting personal folders in ${size} screen`, function () { // TODO: Put messages in boxes and test the correct box content
      cy.viewport(size)

      cy.get('[data-test=messaging-menu]').within(() => {
        const existingPersonalFolders = this.messagingData.personalFolders.existingPersonalFolders

        cy.get('[data-test=personal-folders]').find('li').should('have.length', existingPersonalFolders.length)

        existingPersonalFolders.forEach(personalFolder => {
          cy.get('[data-test=personal-folders]').contains(exactString(personalFolder.name)).should('be.visible')
          personalFolder.subFolders.forEach(subFolder => {
            cy.get('[data-test=personal-folders]').contains(exactString(subFolder.name)).should('not.exist') // Folded by default
            cy.get('[data-test=personal-folders]').contains(exactString(personalFolder.name)).click()
            cy.get('[data-test=personal-folders]').contains(exactString(subFolder.name)).should('be.visible')
          })
        })
      })
    })
  })

  it('Create personal folders', function () {

  })

  it('Update personal folders', function () {

  })

  it('delete personal folders', function () {

  })

  it('Manage personal folders (create, rename, delete)', () => {
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
