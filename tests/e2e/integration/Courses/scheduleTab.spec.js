import { coursesURL } from '../../support/constants/urls'
import { TEACHER } from '../../support/constants/users'

const currentSession = {
  startDate: '2023-11-14 11:25',
  endDate: '2023-11-14 12:10',
  slotName: 'HI1133'
}

describe('HHC_Checkin', () => {
  beforeEach(() => {
    // cy.viewport('iphone-5')
    cy.clock(Cypress.dayjs(currentSession.startDate, 'YYYY/MM/DD HH:mm').add(10, 'minute').toDate().getTime())

    cy.login(TEACHER, coursesURL)
  })

  it('Select the current session', function () {
    cy.get('.session-details', { timeout: 10000 }).should('be.visible').and('contain', currentSession.slotName)
  })
})
