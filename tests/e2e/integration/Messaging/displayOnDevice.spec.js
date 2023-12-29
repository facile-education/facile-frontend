import { messagingURL } from '../../support/constants/urls'
import { HEADMASTER } from '../../support/constants/users'
import { waitMessagingToBeLoaded } from '../../support/utils/messagingUtils'

describe('DisplayOnDevice', () => {
  beforeEach(() => {
    cy.login(HEADMASTER, messagingURL)
    waitMessagingToBeLoaded()
  })

  const sizes = ['iphone-5', 'ipad-2', [1024, 768]]
  const mobile = sizes[0]

  sizes.forEach(size => {
    it(`Messaging_DisplayMenuOnDevice: ${size}`, function () {
      cy.viewport(size)

      if (size === sizes[2]) {
        cy.get('[data-test="option_toggleMessagingMenu"]').click()
      } else {
        cy.get('.open-menu').click()
      }

      cy.get('[data-test="messaging-menu"]').should('be.visible')
    })
    it(`Messaging_DisplayMessagePanelOnMobile: ${size}`, () => {
      cy.viewport(size)
      if (size === mobile) {
        cy.get('[data-test="messages-panel"]').should('not.be.visible')
      }
      cy.get('[data-test="thread-list-item"]').first().click()
      cy.get('[data-test="messages-panel"]').should('be.visible')
    })
  })
})
