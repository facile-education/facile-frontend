import { HHCURL } from '../../support/constants/urls'
import { HEADMASTER, STUDENT } from '../../support/constants/users'
import { selectSlotType } from '../../support/utils/horairesHorsCardesUtils'

describe('User selection on HHC', () => {
  beforeEach(() => {
    cy.loadTables('schoollife/schoollife_tables_empty.sql')
    cy.login(HEADMASTER, HHCURL)
    cy.fixture('hhc.json').as('hhcData').then(data => {
      cy.clock(Cypress.dayjs(data.now, 'YYYY/MM/DD HH:mm').toDate().getTime())
    })
  })

  const sizes = ['iphone-5', 'ipad-2', [1024, 768]]

  sizes.forEach(size => {
    it(`select user in ${size} screen`, function () {
      // Set testing viewport
      Cypress._.isArray(size) ? cy.viewport(size[0], size[1]) : cy.viewport(size)

      selectSlotType(this.hhcData.slotsTypes.tutoring)

      let nbExpectedSlots = (size === 'iphone-5') ? this.hhcData.slotsTypes.tutoring.nbSlotsAtSelectedDay : this.hhcData.slotsTypes.tutoring.nbSlotsAtSelectedWeek
      // the HHC slots are here
      cy.get('.fc-timegrid-event').should('have.length', nbExpectedSlots)

      // Select student
      cy.get('[data-test=user-completion-input] input').type(STUDENT.lastName)
      cy.tick(500)
      // Select student user
      cy.contains(STUDENT.lastName + ' ' + STUDENT.firstName).click()

      // Student's slots were added to previous ones
      nbExpectedSlots += (size === 'iphone-5') ? this.hhcData.studentSlotsNumberAtTuesday : this.hhcData.studentSlotsNumberAtWeek35
      cy.get('.fc-timegrid-event').should('have.length', nbExpectedSlots)
    })
  })
})
