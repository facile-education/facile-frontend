import { messagingURL } from '../../support/constants/urls'
import { HEADMASTER } from '../../support/constants/users'
import { waitMessagingToBeLoaded } from '../../support/utils/messagingUtils'

describe('DisplayOnDevice', () => {
  beforeEach(() => {
    cy.login(HEADMASTER, messagingURL)
    waitMessagingToBeLoaded()
  })

  const sizes = ['iphone-5', 'ipad-2', [1024, 768]]

  sizes.forEach(size => {
    it(`Messaging_DisplayMenuOnDevice: ${size}`, function () {
      // Set testing viewport
      if (Array.isArray(size)) {
        cy.viewport(size[0], size[1])
      } else {
        cy.viewport(size)
      }

      if (size === sizes[2]) {
        cy.get('[data-test="option_toggleMessagingMenu"]').click()
      } else {
        cy.get('.open-menu').click()
      }

      cy.get('[data-test="messaging-menu"]').should('be.visible')
    })
    it.only(`Messaging_DisplayMessagePanelOnMobile: ${size}`, () => {
      // Set testing viewport
      if (Array.isArray(size)) {
        cy.viewport(size[0], size[1])
      } else {
        cy.viewport(size)
      }
      cy.get('[data-test="thread-list-item"]').first().click()
      cy.get('.details').should('be.visible')
    })
  })
})
