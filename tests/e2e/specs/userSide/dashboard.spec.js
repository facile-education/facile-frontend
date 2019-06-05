describe('user dashboard', () => {
  before(function () {
    // Connection
    cy.visit('/')
    cy.get(':nth-child(1) > .form-control').type('ajones')
    cy.get(':nth-child(2) > .form-control').type('ajones')
    cy.get('.btn').click()
    cy.url().should('include', '/tableau-de-bord')
  })
  it('check dashboard main elements', () => {
    // checks for banner items
    cy.get('[data-test=banner-search]').should('be.visible')
    cy.get('[data-test=togglePopoverMenu]').get('[data-test=togglePopoverMenu] > .fa').click()
    cy.contains('ALEXANDRE JONES')
    cy.get('[data-test=openPreferencesModal]').should('be.visible')
    cy.get('[data-test=openInformationModal]').should('be.visible')
    cy.get('[data-test=openSupportModal]').should('be.visible')
    cy.get('[data-test=logout]').should('be.visible')

    // check main elements
    // TODO
  })
})
