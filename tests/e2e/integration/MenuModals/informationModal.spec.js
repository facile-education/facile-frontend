import { GLOBAL_ADMIN } from '../../support/constants'
import { url } from '../../support/constants/statistics'

function randomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

describe('information modal', () => {
  context('admin', () => {
    beforeEach(function () {
      // Connection
      cy.login(url, GLOBAL_ADMIN)
      cy.get('[data-test=togglePopoverMenu]').click()
      cy.get('[data-test=openInformationModal]').click()
    })

    it('panels and closure behavior', () => {
      // Default tab
      cy.get('[data-test=version-details]').should('exist')
      // Go on term of use tab
      cy.get('.tabs > :nth-child(2)').click() // access by property
      cy.get('[data-test=terms-of-use]').should('exist')
      // Return to the default tab
      cy.get('.tabs > :nth-child(1)').click()
      cy.get('[data-test=version-details]').should('exist')

      // Test the closure of the modal
      cy.get('[data-test=closeModal]').click()
      cy.get('[data-test=informationModal]').should('not.exist')
    })

    it('consulting terms of use', () => {
      cy.get('.tabs > :nth-child(2)').click() // go on terms of uses tab //TODO pass by id
      cy.get('[data-test=confidentialityRulesLink').should('have.attr', 'href')
        .and('include', 'www.pentilanero.com/?page_id=533') // test link?
      cy.get('[data-test=bodyCharter]').should('be.not.empty')
    })

    it('check a previous version', () => {
      // not empty in first place
      cy.get('[data-test=versionDetails]').contains('Unable to get version details').should('not.exist')
      cy.get('[data-test=versionListDropDown]').click()
      cy.get('.suggestion-list').children().its('length').then((nbVersion) => {
        expect(nbVersion).not.to.equal(0)
        cy.get('.suggestion-list > :nth-child(' + nbVersion + ')').click()
      })
      cy.get('[data-test=versionDetails]').contains('Unable to get version details').should('not.exist')
    })

    it('add a version', () => {
      const prefix = '3.3.3' // this version tests have 3.3.3 prefix
      const id = randomInt(1, 1000000) // TODO find an other way to clean data

      // check form
      // TODO uncomment when the css fonts will be loaded
      // cy.get('[data-test=versionNumber-input]  > .error-message > label').should('be.visible')
      // cy.get('[data-test=versionDetails-input]  > .error-message > label').should('be.visible')
      cy.get('[data-test=versionNumber-input]  > input').type(prefix)
      // cy.get('[data-test=versionNumber-input]  > .error-message > label').should('be.visible')
      cy.get('[data-test=versionNumber-input]  > input').clear()
      cy.get('[data-test=versionNumber-input]  > input').type(prefix + '.' + id)
      cy.get('[data-test=versionNumber-input]  > .error-message > label').should('not.be.visible')
      cy.get('[data-test=versionDetails-input]  > input').type('baaaah')
      // cy.get('[data-test=versionDetails-input]  > .error-message > label').should('be.visible')
      cy.get('[data-test=versionDetails-input]  > input').clear()
      cy.get('[data-test=versionDetails-input]  > input').type('{}')
      // cy.get('[data-test=versionDetails-input]  > .error-message > label').should('be.visible')
      cy.get('[data-test=versionDetails-input]  > input').clear()
      cy.get('[data-test=versionDetails-input]  > input').type('{{}"news":[{{}"title":"add e2e tests !"}], ' +
        '"others":"we can now be safe"}')

      cy.get('[data-test=versionDetails-input]  > .error-message > label').should('not.be.visible')
      // add the typed version
      cy.get('[data-test=addVersion]').click()
      cy.get('[data-test=editVersion]').should('not.exist')

      // check if the version is into the dropdown
      cy.get('[data-test=versionListDropDown]').click()
      cy.contains(prefix + '.' + id).click()
      cy.contains('add e2e tests !')
      cy.contains('we can now be safe')
    })
  })

  context('nonAdmin', () => {
    beforeEach(function () {
      // Connection
      cy.login(url)
      cy.get('[data-test=togglePopoverMenu]').click()
      cy.get('[data-test=openInformationModal]').click()
    })

    it('cannot edit version', () => {
      cy.get('[data-test=addVersion]').should('not.exist')
    })
  })
})
