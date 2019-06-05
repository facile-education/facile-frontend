describe('user support service', () => {
  function randomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  before(function () {
    // Go to the support modal
    cy.fixture('profiles.json').then((user) => {
      cy.visit('/')
      cy.get(':nth-child(1) > .form-control').type(user.nonAdmin.login)
      cy.get(':nth-child(2) > .form-control').type(user.nonAdmin.login)
      cy.get('.btn').click()
      cy.get('[data-test=togglePopoverMenu]').click()
      cy.get('[data-test=openSupportModal]').click()
    })
  })

  it('navigation', () => {
    cy.get('[data-test=closeModal]').click()
    // test on modal body because i can't give property to the entire modal
    cy.get('[data-test=supportModal]').should('not.exist')
    cy.get('[data-test=openSupportModal]').click()
    cy.get('[data-test=supportModal]').should('exist')
  })

  it('send issue', () => {
    cy.fixture('profiles.json').then((user) => {
      cy.server()
      cy.route({
        method: 'GET',
        url: '*' // yep...
      }).as('submit')

      cy.contains(user.nonAdmin.supportModal.welcomeSentence)
      cy.get('[data-test=servicesDropDown]').click()
      cy.contains(user.nonAdmin.supportModal.serviceList[1]).click()
      // test form
      cy.get('[data-test=submitTicket]').click()
      cy.get('.error-message > label').contains(user.nonAdmin.requiredSentence)

      // fill ck-editor
      cy.get('[data-test=ck-editor]').children().type('[TEST n°' + randomInt(1, 1000000) + '] ' +
                                                      'description d\'un incident non administrateur')
      cy.get('.error-message > label').should('not.be.visible')
      // add time to let a chance to the ck-editor to update v-model just in time
      cy.wait(500) // TODO remove when ck-editor will be patch

      // submit ticket
      cy.get('[data-test=submitTicket]').click()
      cy.get('[data-test=closeModal]').click()

      // check network status
      cy.wait('@submit')
      // Assert on XHR
      cy.get('@submit').then(function (xhr) {
        expect(xhr.status).to.eq(200)
        expect(xhr.url).contains('subjectField')
        expect(xhr.url).contains('contentField')
        expect(xhr.url).contains('mail')
        expect(xhr.url).contains('attachFiles')
        expect(xhr.url).contains('isUsurpastionAllowed')
        expect(xhr.responseBody).property('success').to.eq(true)
      })

      // go to the admin messaging to check if the mail was send ?
    })
  })
})
