import { url } from '../../support/constants/groups'
import { HEADMASTER } from '../../support/constants'

const createdGroup = {
  name: 'createdGroup',
  description: 'Ma description',
  members: [
    {
      name: 'Salvatore Di Dio',
      isCreator: true,
      isAdmin: true
    },
    {
      name: 'Alexandre Regad',
      isCreator: false,
      isAdmin: true
    },
    {
      name: 'ANYA ALOSTA',
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
      name: 'Alexandre Regad',
      isCreator: false,
      isAdmin: true
    }
  ],
  addedMember: [
    {
      name: 'MANON FREY',
      isCreator: false,
      isAdmin: false
    }
  ]
}

describe('Group list', () => {
  before(() => {
    cy.login(url, HEADMASTER)
  })

  it('Group creation', () => {
    cy.get('[data-test=createGroupButton]').click()

    cy.get('[data-test=edit-group-modal]').within(() => {
      cy.get('input[placeholder=\'Nom du groupe\']').type(createdGroup.name)
      cy.get('input[placeholder=\'Description\']').type(createdGroup.description)
      createdGroup.members.forEach((member) => {
        cy.get('input[placeholder=\'Rechercher par Nom\']').clear().type(member.name)
        cy.contains('.group-user-item', member.name).click()
        cy.contains('.selected-group-member-item', member.name)
        if (member.isCreator) {
          cy.contains('.selected-group-member-item', member.name).parent().parent().find('input[title]=\'Administrator\']').should('be.disabled')
        } else if (member.isAdmin) {
          cy.contains('.selected-group-member-item', member.name).parent().parent().find('input[title]=\'Administrator\']')
            .should('not.be.disabled')
            .click()
          cy.contains('.selected-group-member-item', member.name).parent().parent().should('contain', 'Oui')
        } else {
          cy.contains('.selected-group-member-item', member.name).parent().parent().should('contain', 'Non').find('input[title]=\'Administrator\']')
            .should('not.be.disabled')
        }
      })

      // Create group
      cy.get('.confirm-button').click()
      cy.get('[data-test=edit-group-modal]').should('not.exist')

      // Check group creation
      cy.contains('[data-test=group-item]', createdGroup.name)
      cy.contains('[data-test=group-item]', createdGroup.description).click()
    })

    cy.get('[data-test=group-details-panel]').within(() => {
      // Members
      cy.contains('3 Membres')
      // test toggle
      cy.contains('1 Administrateur').click()
      cy.contains('Salvatore Di Dio').should('exist')

      cy.contains('1 Enseignant').click()
      cy.contains('Alexandre Regad')
      cy.contains('Isabel Mendez')

      cy.contains('1 Autre').click()
      cy.contains('ANYA ALOSTA')
    })
  })

  it('Group modification', () => {
    // TODO: tests if modification is impossible with non-admins
    cy.contains('[data-test=group-item]', createdGroup.description).parent().get('[data-test=edit-group-icon]').click()

    cy.get('[data-test=edit-group-modal]').within(() => {
      cy.get('input[placeholder=\'Nom du groupe\']').clear().type(updatedGroup.name)
      cy.get('input[placeholder=\'Description\']').clear().type(updatedGroup.description)

      updatedGroup.removedMember.forEach((member) => {
        cy.contains('.selected-group-member-item', member.name).parent().get('.close-button').click()
        cy.contains('.selected-group-member-item', member.name).should('not.exist')
      })

      updatedGroup.addedMember.forEach((member) => {
        cy.get('input[placeholder=\'Rechercher par Nom\']').clear().type(member.name)
        cy.contains('.group-user-item', member.name).click()
        cy.contains('.selected-group-member-item', member.name)
        if (member.isAdmin) {
          cy.contains('.selected-group-member-item', member.name).parent().parent().find('input[title]=\'Administrator\']')
            .should('not.be.disabled')
            .click()
          cy.contains('.selected-group-member-item', member.name).parent().parent().should('contain', 'Oui')
        } else {
          cy.contains('.selected-group-member-item', member.name).parent().parent().should('contain', 'Non').find('input[title]=\'Administrator\']')
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
      cy.contains('Salvatore Di Dio').should('exist')

      cy.contains('0 Enseignant').click()

      cy.contains('2 Autre').click()
      cy.contains('ANYA ALOSTA')
      cy.contains('MANON FREY')
    })
  })

  it('Group deletion', () => {
    // Todo: test forbidden cases
    cy.contains('[data-test=group-item]', updatedGroup.description).parent().get('[data-test=delete-group-icon]').click()
    cy.contains('[data-test=group-item]', updatedGroup.description).should('not.exist')
  })
})
