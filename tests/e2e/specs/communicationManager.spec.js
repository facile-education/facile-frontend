describe('Service Access', () => {
  it('Loading the service', () => {
    cy.visit('/#administrationtools')
    cy.contains('h4', 'Communication interne')
    // simulate hover
    cy.get('.menu-item').trigger('mouseover')
    cy.get('.popover').should('be.visible')
  })
})
