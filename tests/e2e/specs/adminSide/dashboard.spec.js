describe('admin dashboard', () => {
  before(function () {
    // Connection
    cy.visit('/')
    cy.get(':nth-child(1) > .form-control').type('pentila')
    cy.get(':nth-child(2) > .form-control').type('pentila')
    cy.get('.btn').click()
    cy.url().should('include', '/tableau-de-bord')
  })
  it('check dashboard main elements', () => {
    expect(true).to.equal(true) // TODO
  })
})
