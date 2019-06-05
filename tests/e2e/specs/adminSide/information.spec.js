describe('admin information service', () => {
  function randomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  beforeEach(function () {
    // Connection
    cy.fixture('profiles.json').then((user) => {
      cy.visit('/')
      cy.get(':nth-child(1) > .form-control').type(user.admin.login) // depend of the seed
      cy.get(':nth-child(2) > .form-control').type(user.admin.password) // depend of the seed
      cy.get('.btn').click()
      cy.get('[data-test=togglePopoverMenu]').click()
      cy.get('[data-test=openInformationModal]').click()
    })
  })

  it('navigation', () => {
    cy.get('[data-test=createVersion]').click()
    cy.get('[data-test=editVersion]').should('exist')
    cy.get('[data-test=editVersion] > .modal-mask > .window-wrapper > .window-container > .window-header ' +
           '> [data-test=closeModal]').click()
    cy.get('[data-test=editVersion]').should('not.exist')
    cy.get('[data-test=informationModal]').should('exist')
  })

  it('add a version', () => {
    let prefix = '3.3.3' // this version tests have 3.3.3 prefix
    let id = randomInt(1, 1000000)

    cy.get('[data-test=createVersion]').click()
    // check form
    cy.get('[data-test=addVersion]').click()
    cy.get('[data-test=versionNumber-input]  > .error-message > label').should('be.visible') // TODO be more specific on error type
    cy.get('[data-test=versionDetails-input]  > .error-message > label').should('be.visible')
    cy.get('[data-test=versionNumber-input]  > .input').type(prefix)
    cy.get('[data-test=versionNumber-input]  > .error-message > label').should('be.visible')
    cy.get('[data-test=versionNumber-input]  > .input').clear()
    cy.get('[data-test=versionNumber-input]  > .input').type(prefix + '.' + id)
    cy.get('[data-test=versionNumber-input]  > .error-message > label').should('not.be.visible')
    cy.get('[data-test=versionDetails-input]  > .input').type('baaaah')
    cy.get('[data-test=versionDetails-input]  > .error-message > label').should('be.visible')
    cy.get('[data-test=versionDetails-input]  > .input').clear()
    cy.get('[data-test=versionDetails-input]  > .input').type('{}')
    cy.get('[data-test=versionDetails-input]  > .error-message > label').should('be.visible')
    cy.get('[data-test=versionDetails-input]  > .input').clear()
    cy.get('[data-test=versionDetails-input]  > .input').type('{{}"news":[{{}"title":"add e2e tests !"}], ' +
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
