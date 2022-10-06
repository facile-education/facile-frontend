import { url } from '../../support/constants/messaging'
import { HEADMASTER } from '../../support/constants'
import { waitMessagingToBeLoaded } from '../../support/utils/messagingUtils'

describe('Delete message', () => {
  before(() => {
    cy.exec('npm run db:loadTables messaging_tables.sql')
    cy.clearDBCache()
    cy.login(url, HEADMASTER)
    waitMessagingToBeLoaded()
  })

  it('delete thread', () => {
    cy.log('delete thread by delete key')
    cy.get('[data-test=threads-panel]').get('.thread-list-item').eq(3).as('threadToDelete').click()
    cy.globalKeyPress('{del}')
    cy.get('@threadToDelete').should('not.exist')

    cy.log('delete thread by context menu')
    cy.get('[data-test=threads-panel]').get('.thread-list-item').eq(2).as('threadToDelete').rightclick()
    cy.get('[data-test=context-menu]').contains('Supprimer').click().should('not.exist')
    cy.get('@threadToDelete').should('not.exist')

    cy.log('delete thread by trash icon')
    cy.get('[data-test=threads-panel]').get('.thread-list-item').eq(1).as('threadToDelete').rightclick()
    cy.get('[data-test=option_trash]').click()
    cy.get('@threadToDelete').should('not.exist')

    cy.log('delete message in thread by delete key')
    cy.get('[data-test=threads-panel]').get('.thread-list-item').eq(0).click()
    cy.get('[data-test=messages-panel]').get('.message-list').children().eq(2).as('messageToDelete').click()
      .should('have.class', 'selected')
    cy.globalKeyPress('{del}')
    cy.get('@messageToDelete').should('not.exist')
    cy.get('[data-test=spinner]').should('not.exist')
    cy.log('test finished test!')

    cy.log('delete message in thread by trash icon')
    cy.get('[data-test=threads-panel]').get('.thread-list-item').eq(0).click()
    cy.get('[data-test=messages-panel]').get('.message-list').children().eq(1).as('messageToDelete').click()
      .should('have.class', 'selected')
    cy.get('[data-test=option_trash]').click()

    cy.get('[data-test=messages-panel]').get('.message-list').children().eq(1).should('not.exist') // TODO: investigate as behaviour
  })
})
