

function randomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

describe.skip('InformationModal', () => {
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
})
