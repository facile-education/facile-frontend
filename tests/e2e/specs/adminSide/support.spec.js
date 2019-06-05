describe('admin support service', () => {
  function randomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  beforeEach(function () {
    // Go to the support modal
    cy.fixture('profiles.json').then((user) => {
      cy.visit('/')
      cy.get(':nth-child(1) > .form-control').type(user.admin.login)
      cy.get(':nth-child(2) > .form-control').type(user.admin.login)
      cy.get('.btn').click()
      cy.get('[data-test=togglePopoverMenu]').click()
      cy.get('[data-test=openSupportModal]').click()
    })
  })

  it('send issue', () => {
    cy.get('[data-test=closeModal]').click()
    cy.get('[data-test=openSupportModal]').click()
    // we don't test all behavior in common with user
    cy.fixture('profiles.json').then((user) => {
      cy.server()
      cy.route({
        method: 'GET',
        url: '*' // yep...
      }).as('submit')

      // check if there is the admin sentence
      cy.contains(user.admin.supportModal.welcomeSentence)

      // fill ck-editor
      cy.get('[data-test=ck-editor]').children().type('[TEST n°' + randomInt(1, 1000000) + '] ' +
                                                      'description d\'un incident administrateur')
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
      // go to the messaging to check if the mail was send?
    })
  })
})
