describe('user information service', () => {
  beforeEach(function () {
    // Connection
    cy.fixture('profiles.json').then((user) => {
      cy.visit('/')
      cy.get(':nth-child(1) > .form-control').type(user.nonAdmin.login) // depend of the seed
      cy.get(':nth-child(2) > .form-control').type(user.nonAdmin.password) // depend of the seed
      cy.get('.btn').click()
      cy.get('[data-test=togglePopoverMenu]').click()
      cy.get('[data-test=openInformationModal]').click()
    })
  })

  it('navigation', () => {
    cy.get('[data-test=version-details]').should('exist') // default tab
    cy.get('.tabs > :nth-child(2)').click() // access by property
    cy.get('[data-test=terms-of-use]').should('exist')
    cy.get('.tabs > :nth-child(1)').click()
    cy.get('[data-test=version-details]').should('exist')
    cy.get('[data-test=closeModal]').click()
    cy.get('[data-test=informationModal]').should('not.exist')
    cy.get('[data-test=openInformationModal]').click() // test if the closure of the modal have not broken everything
    cy.get('[data-test=informationModal]').should('exist')
  })

  it('check a previous version', () => {
    // not empty in first place
    cy.get('[data-test=versionDetails]').contains('Unable to get version details').should('not.exist')
    cy.get('[data-test=versionListDropDown]').click()
    cy.get('.suggestion-list').children().its('length').then((nbVersion) => {
      expect(nbVersion).not.to.equal(0)
      cy.get('.suggestion-list > :nth-child(' + nbVersion + ')').click()
    })
    cy.get('[data-test=versionDetails]').contains('Unable to get version details').should('not.exist') // replace by testing store content?
    // -> non car il peut y avoir des cas où le message est affiché mais où le store n'est pas vide
    // -> mais valeur écrite en dur dans le test -> si le texte change, imperceptible dans le test
    // -> comment accéder à la valeur dans le lang sans tout dupliquer dans fixture?
    // comme ça:
    cy.readFile('./src/lang/locale/fr.json').its('SideMenu.category.administration').should('eq', 'Administration')
  })

  it('add a version', () => {
    cy.get('[data-test=createVersion]').should('be.not.visible')
  })

  it('consulting terms of use', () => {
    cy.get('.tabs > :nth-child(2)').click() // go on terms of uses tab //TODO pass by id
    cy.get('[data-test=confidentialityRulesLink').should('have.attr', 'href')
      .and('include', 'www.pentilanero.com/?page_id=533') // test link?
    cy.get('[data-test=bodyCharter]').should('be.not.empty')
  })
})
