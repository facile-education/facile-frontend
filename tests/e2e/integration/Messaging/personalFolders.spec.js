import { messagingURL } from '../../support/constants/urls'
import { SCHOOL_ADMIN } from '../../support/constants/users'
import { getThread } from '../../support/utils/messagingUtils'
import { exactString } from '../../support/utils/testUtils'

/* =========== Local methods ============= */
const openMessagingMenu = () => {
  cy.get('[data-test=option_toggleMessagingMenu]', { timeout: 5000 }).click()
  cy.get('[data-test=messaging-menu]').should('be.visible')
}
const toggleFolder = (folder) => {
  cy.get('[data-test=personal-folders]').contains(exactString(folder.name)).click()
}
const triggerOptionOnFolder = (folder, action) => {
  cy.get('[data-test=personal-folders]').contains('span', exactString(folder.name)).trigger('mouseover')
  cy.get('[data-test=personal-folders]').contains('button', folder.name).find('[data-test=' + action + ']').click() // Todo: understand why exactString doesn't works
}

/* =========== Tests ============= */

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
      const existingPersonalFolders = this.messagingData.personalFolders.existingPersonalFolders

      // Set testing viewport
      Cypress._.isArray(size) ? cy.viewport(size[0], size[1]) : cy.viewport(size)

      cy.get('[data-test=messaging-menu]').within(() => {
        cy.get('[data-test=personal-folders]').find('li').should('have.length', existingPersonalFolders.length)

        existingPersonalFolders.forEach(personalFolder => {
          cy.get('[data-test=personal-folders]').contains(exactString(personalFolder.name)).should('be.visible')
          personalFolder.subFolders.forEach(subFolder => {
            cy.get('[data-test=personal-folders]').contains(exactString(subFolder.name)).should('not.exist') // Folded by default
            toggleFolder(personalFolder)
            cy.get('[data-test=personal-folders]').contains(exactString(subFolder.name)).should('be.visible')
          })
        })
      })
    })
  })

  // Messaging_CreatePersonalFolder
  it('Messaging_CreatePersonalFolder', function () {
    const personalFoldersToCreate = this.messagingData.personalFolders.personalFoldersToCreate

    cy.get('[data-test=messaging-menu]').within(() => {
      // Create folders
      personalFoldersToCreate.forEach(folderToCreate => {
        cy.get('[data-test=createMessagingFolder]').click()
        cy.get('input').type(folderToCreate.name, { force: true })
        cy.get('input').blur()
        cy.get('[data-test=personal-folders]').find('li').contains(exactString(folderToCreate.name)).should('be.visible')
        // Create subFolders
        folderToCreate.subFolders.forEach(subFolderToCreate => {
          triggerOptionOnFolder(folderToCreate, 'add')
          cy.get('input').type(subFolderToCreate.name, { force: true })
          cy.get('input').blur()
          cy.get('[data-test=personal-folders]').contains(exactString(subFolderToCreate.name)).should('be.visible')
        })
      })
    })
  })

  // Messaging_UpdatePersonalFolder
  it('Messaging_UpdatePersonalFolder', function () {
    const existingPersonalFolders = this.messagingData.personalFolders.existingPersonalFolders
    const personalFolderToRename = existingPersonalFolders[0]
    const personalSubFolderToRename = personalFolderToRename.subFolders[0] // Assume that the first folder in list have subFolder
    const personalFolderNewName = this.messagingData.personalFolders.modifiedFolderName
    const personalSubFolderNewName = this.messagingData.personalFolders.modifiedSubFolderName
    const personalFolderThread = this.messagingData.existingDraftThreads[1]

    // Modify personal folder
    cy.get('[data-test=messaging-menu]').within(() => {
      // Click on folder to see the content
      toggleFolder(personalFolderToRename)
    })
    // Check if content exist
    cy.get('[data-test="threads-panel"]').within(() => {
      getThread(personalFolderThread).should('be.exist')
    })

    // Edit personal forler name
    cy.get('[data-test=messaging-menu]').within(() => {
      triggerOptionOnFolder(personalFolderToRename, 'rename')
      cy.get('input').clear()
      cy.get('input').type(personalFolderNewName, { force: true })
      cy.get('input').blur()
      cy.get('[data-test=personal-folders]').contains(exactString(personalFolderNewName)).should('be.visible')
    })
    // Check if content already exist
    cy.get('[data-test="threads-panel"]').within(() => {
      getThread(personalFolderThread).should('be.exist')
    })

    // Modify personal sub folder
    cy.get('[data-test=messaging-menu]').within(() => {
      // Click on folder to see the content
      cy.get('[data-test="personalSubFolder-dossier perso modifié"]').click()
    })

    // Edit sub folder name
    cy.get('[data-test=messaging-menu]').within(() => {
      toggleFolder({ name: personalFolderNewName })
      triggerOptionOnFolder(personalSubFolderToRename, 'rename')
      cy.get('input').clear()
      cy.get('input').type(personalSubFolderNewName, { force: true })
      cy.get('input').blur()
      cy.get('[data-test=personal-folders]').contains(exactString(personalSubFolderNewName)).should('be.visible')
    })
  })

  // Messaging_DeletePersonalFolder
  it('Messaging_DeletePersonalFolder', function () {
    const existingPersonalFolders = this.messagingData.personalFolders.existingPersonalFolders
    const personalFolderToDelete = existingPersonalFolders[0]
    const PersonalFolderThread = this.messagingData.existingDraftThreads[1]
    const PersonalSubFolderThread = this.messagingData.existingDraftThreads[2]

    // Click on personalFolder to see the content
    cy.get('[data-test=messaging-menu]').within(() => {
      toggleFolder(personalFolderToDelete)
    })
    // Check if content folder exist
    cy.get('[data-test="threads-panel"]').within(() => {
      getThread(PersonalFolderThread).should('be.exist')
    })
    // Click on subFolder to see the content
    cy.get('[data-test=messaging-menu]').within(() => {
      cy.get('[data-test="personalSubFolder-sous-dossier"]').click()
    })
    // Check if content subFolder exist
    cy.get('[data-test="threads-panel"]').within(() => {
      getThread(PersonalSubFolderThread).should('be.exist')
    })

    // Delete personalFolder
    cy.get('[data-test=messaging-menu]').within(() => {
      triggerOptionOnFolder(personalFolderToDelete, 'delete')
    })
    // Accept warning modal
    cy.get('[data-test=warning-modal]').within(() => {
      cy.contains('button', 'Continuer').click()
    })
    // Check if personalFolder and subFolder doesn't exist
    cy.get('[data-test=messaging-menu]').find('[data-test=personal-folders]').contains(exactString(personalFolderToDelete.name)).should('not.exist')
    cy.get('[data-test=messaging-menu]').find('[data-test=personal-folders]').contains(exactString(personalFolderToDelete.subFolders[0].name)).should('not.exist')

    // Go to trash
    cy.get('[data-test="messaging-menu"]').contains('button', 'Corbeille').click()
    getThread(PersonalFolderThread).should('be.exist')
    getThread(PersonalSubFolderThread).should('be.exist')
  })

  // Messaging_DeleteSubFolder
  it('Messaging_DeleteSubFolder', function () {
    const existingPersonalFolders = this.messagingData.personalFolders.existingPersonalFolders
    const personalFolderToDelete = existingPersonalFolders[0]
    const personalSubFolderToDelete = personalFolderToDelete.subFolders[0] // Assume that the first folder in list have subFolder
    const subFolderThread = this.messagingData.existingDraftThreads[2]

    // Delete subFolder
    cy.get('[data-test=messaging-menu]').within(() => {
      toggleFolder(personalFolderToDelete)
      cy.get('[data-test="personalSubFolder-sous-dossier"]').click()
    })
    // Check if content exist
    cy.get('[data-test="threads-panel"]').within(() => {
      getThread(subFolderThread).should('be.exist')
    })
    // Delete subFolder
    cy.get('[data-test=messaging-menu]').within(() => {
      triggerOptionOnFolder(personalSubFolderToDelete, 'delete')
    })
    // Accept in warning modal
    cy.get('[data-test=warning-modal]').within(() => {
      cy.contains('button', 'Continuer').click()
    })
    // Check if subFolder doesn't exist
    cy.get('[data-test=messaging-menu]').find('[data-test=personal-folders]').contains(exactString(personalSubFolderToDelete.name)).should('not.exist')
    // Check if content doesn't exist
    cy.get('[data-test="threads-panel"]').within(() => {
      getThread(subFolderThread).should('not.exist')
    })
    // Go to trash
    cy.get('[data-test="messaging-menu"]').contains('button', 'Corbeille').click()
    getThread(subFolderThread).should('be.exist')
  })

  // Messaging_PersonalFolderBehaviour
  it('Messaging_PersonalFolderBehaviour', function () {
    const existingPersonalFolders = this.messagingData.personalFolders.existingPersonalFolders
    const personalFolderToDelete = existingPersonalFolders[0]
    const PersonalFolderThread = this.messagingData.existingDraftThreads[1]

    // Click on personalFolder
    cy.get('[data-test=messaging-menu]').within(() => {
      toggleFolder(personalFolderToDelete)
    })
    // Check if content folder exist
    cy.get('[data-test="threads-panel"]').within(() => {
      getThread(PersonalFolderThread).should('be.exist')
    })
    // Check if subFolder is visible
    cy.get('[data-test="personalSubFolder-sous-dossier"]').should('be.visible')

    // Click on personalFolder
    cy.get('[data-test=messaging-menu]').within(() => {
      toggleFolder(personalFolderToDelete)
    })
    // Check if subFolder is not visible
    cy.get('[data-test="personalSubFolder-sous-dossier"]').should('not.exist')
  })
})
