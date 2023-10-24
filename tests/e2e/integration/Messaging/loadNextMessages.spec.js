/* eslint-disable indent */
import { messagingURL } from '../../support/constants/urls'
import { HEADMASTER, STUDENT } from '../../support/constants/users'
import { waitMessagingToBeLoaded } from '../../support/utils/messagingUtils'

describe('Load next message', () => {
    beforeEach(() => {
      cy.loadTables('messaging/messaging_tables_full.sql')
      cy.login(STUDENT, messagingURL)
      waitMessagingToBeLoaded()
    })
    it('Messaging_LoadNextMessages ', function () {
    })
})
