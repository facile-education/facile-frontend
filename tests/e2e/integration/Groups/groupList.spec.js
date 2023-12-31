
describe.skip('Group list', () => {
  before(() => {
    cy.login(url, HEADMASTER)
  })

  it('Test group List interface (desktop)', () => {
    cy.get('[data-test=group-item]').should('have.length', 12)

    // Test filter
    cy.get('.toolbar').find('input').type('reten', { force: true })
    cy.get('[data-test=group-item]').should('have.length', 1)
    cy.contains('[data-test=group-item]', 'Retenues').should('exist')
  })
})
