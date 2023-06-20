import { GLOBAL_ADMIN } from '../../support/constants'
import { url } from '../../support/constants/statistics'

const adminWelcomeSentence = 'Votre demande de support sera traitée par les équipes de Pentila, vous recevrez une réponse dans votre messagerie'
const userWelcomeSentence = "Votre demande de support sera transmise à l'administrateur"

describe('admin desktop support modal', () => { // TODO remove skip when associated back service will exist
  function randomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  context('admin', () => {
    beforeEach(function () {
      cy.login(url, GLOBAL_ADMIN)
      // Go to the support modal
      cy.get('[data-test=togglePopoverMenu]').click()
      cy.get('[data-test=openSupportModal]').click()
    })

    it('navigation', () => {
      // check if there is the admin sentence
      cy.contains(adminWelcomeSentence)

      // close modal
      cy.get('[data-test=closeModal]').click()
      // test on modal body because i can't give property to the entire modal
      cy.get('[data-test=supportModal]').should('not.exist')
      cy.get('[data-test=openSupportModal]').click()
      cy.get('[data-test=supportModal]').should('exist')
    })

    it('send issue', () => {
    // we don't test all behavior in common with user

      // test form
      cy.get('[data-test=submitTicket]').click()
      // TODO uncomment when css fonts will be loaded
      // cy.get('.error-message > label').contains('Ce champ est obligatoire')

      // select service
      cy.get('[data-test=servicesDropDown]').click()
        .contains('Droits de communication ').click()

      // fill ck-editor
      cy.get('[data-test=ck-editor]').children().type('[TEST n°' + randomInt(1, 1000000) + '] ' +
        'description d\'un incident administrateur')
      cy.get('.error-message > label').should('not.exist')
      // add time to let a chance to the ck-editor to update v-model just in time
      cy.wait(500) // TODO remove when ck-editor will be patch

      // submit ticket
      cy.get('[data-test=submitTicket]').click()

      // TODO: test success
    })
  })

  context('nonAdmin', () => {
    beforeEach(function () {
      cy.login(url)
      // Go to the support modal
      cy.get('[data-test=togglePopoverMenu]').click()
      cy.get('[data-test=openSupportModal]').click()
    })

    it('navigation', () => {
      // check if there is the admin sentence
      cy.contains(userWelcomeSentence)

      // close modal
      cy.get('[data-test=closeModal]').click()
      // test on modal body because i can't give property to the entire modal
      cy.get('[data-test=supportModal]').should('not.exist')
      cy.get('[data-test=openSupportModal]').click()
      cy.get('[data-test=supportModal]').should('exist')
    })
  })
})
