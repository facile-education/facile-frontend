import { url } from '../../support/constants/groups'
import { HEADMASTER } from '../../support/constants'

const createdGroup = {
  name: 'aCreatedGroup',
  description: 'Ma description',
  members: [
    {
      name: 'Di Dio Salvatore',
      isCreator: true,
      isAdmin: true
    },
    {
      name: 'Regad Alexandre',
      isCreator: false,
      isAdmin: true
    },
    {
      name: 'ALOSTA ANYA',
      isCreator: false,
      isAdmin: false
    }
  ]
}

const updatedGroup = {
  name: 'updatedGroup',
  description: 'My new description',
  removedMember: [
    {
      name: 'Regad Alexandre',
      isCreator: false,
      isAdmin: true
    }
  ],
  addedMember: [
    {
      name: 'FREY MANON',
      isCreator: false,
      isAdmin: false
    }
  ]
}

describe('Group list', () => {
  beforeEach(() => {
    cy.login(url, HEADMASTER)
  })

  it('Group creation', () => {
    cy.get('[data-test=createGroupButton]').click()

    cy.get('[data-test=edit-group-modal]').within(() => {
      cy.get('input[placeholder=\'Nom du groupe\']').type(createdGroup.name)
      cy.get('textarea[placeholder=\'Description\']').type(createdGroup.description)
      createdGroup.members.forEach((member) => {
        cy.get('input[placeholder=\'Rechercher par nom\']').click({force: true}).clear().type(member.name)
        cy.contains('.group-user-item', member.name).click()
        cy.contains('.selected-group-member-item', member.name)
        if (member.isCreator) {
          cy.contains('.selected-group-member-item', member.name).find('input[title=\'Administrateur\']').should('be.disabled')
        } else if (member.isAdmin) {
          cy.contains('.selected-group-member-item', member.name).find('input[title=\'Administrateur\']')
            .should('not.be.disabled')
            .parent().click()
          cy.contains('.selected-group-member-item', member.name).should('contain', 'Oui')
        } else {
          cy.contains('.selected-group-member-item', member.name).should('contain', 'Non').find('input[title=\'Administrateur\']')
            .should('not.be.disabled')
        }
      })

      // Create group
      cy.get('.confirm-button').click()
      cy.get('[data-test=edit-group-modal]').should('not.exist')
    })

    // Check group creation
    cy.contains('[data-test=group-item]', createdGroup.name)
    cy.contains('[data-test=group-item]', createdGroup.description).click()

    cy.get('[data-test=group-details-panel]').within(() => {
      // Members
      cy.contains('3 Membres')
      // test toggle
      cy.contains('2 Administrateur').click()
      cy.contains('Di Dio Salvatore').should('exist')
      cy.contains('Regad Alexandre').should('exist')
      cy.contains('2 Administrateur').click()

      cy.contains('1 Enseignant').click()
      cy.contains('Regad Alexandre').should('exist')

      cy.contains('1 Elève').click()
      cy.contains('ALOSTA ANYA')
    })
  })

  it('Group modification', () => {
    // TODO: tests if modification is impossible with non-admins
    cy.contains('[data-test=group-item]', createdGroup.description).find('[data-test=edit-group-icon]').click()

    cy.get('[data-test=edit-group-modal]').within(() => {
      cy.get('input[placeholder=\'Nom du groupe\']').clear().type(updatedGroup.name)
      cy.get('textarea[placeholder=\'Description\']').clear().type(updatedGroup.description)

      updatedGroup.removedMember.forEach((member) => {
        cy.contains('.selected-group-member-item', member.name).find('.close-button').click()
        cy.contains('.selected-group-member-item', member.name).should('not.exist')
      })

      updatedGroup.addedMember.forEach((member) => {
        cy.get('input[placeholder=\'Rechercher par nom\']').click({force: true}).clear().type(member.name)
        cy.contains('.group-user-item', member.name).click()
        cy.contains('.selected-group-member-item', member.name)
        if (member.isAdmin) {
          cy.contains('.selected-group-member-item', member.name).find('input[title=\'Administrateur\']')
            .should('not.be.disabled')
            .parent()
            .click()
          cy.contains('.selected-group-member-item', member.name).should('contain', 'Oui')
        } else {
          cy.contains('.selected-group-member-item', member.name).should('contain', 'Non').find('input[title=\'Administrateur\']')
            .should('not.be.disabled')
        }
      })
    })

    // Update group
    cy.get('.confirm-button').click()
    cy.get('[data-test=edit-group-modal]').should('not.exist')

    // Check group creation
    cy.contains('[data-test=group-item]', updatedGroup.name)
    cy.contains('[data-test=group-item]', updatedGroup.description).click()

    cy.get('[data-test=group-details-panel]').within(() => {
      // Members
      cy.contains('3 Membres')
      // test toggle
      cy.contains('1 Administrateur').click()
      cy.contains('Di Dio Salvatore').should('exist')

      cy.contains('2 Elèves').click()
      cy.contains('ALOSTA ANYA')
      cy.contains('FREY MANON')
    })
  })

  it('Group deletion', () => {
    // Todo: test forbidden cases
    cy.contains('[data-test=group-item]', updatedGroup.description).find('[data-test=delete-group-icon]').click()
    cy.get('[data-test=warning-modal]').find('[data-test=confirmButton]').click()
    cy.contains('[data-test=group-item]', updatedGroup.description).should('not.exist')
  })
})
