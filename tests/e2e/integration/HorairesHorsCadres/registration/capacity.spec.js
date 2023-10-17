import { HHCURL } from '../../../support/constants/urls'
import {
  HEADMASTER,
  STUDENT
} from '../../../support/constants/users'
import {
  getSlot,
  selectSlotType,
  selectStudent
} from '../../../support/utils/horairesHorsCardesUtils'

const studentToRegister = STUDENT
const registerer = HEADMASTER

describe('Capacity check', () => {
  beforeEach(() => {
    cy.fixture('hhc.json').as('hhcData').then(data => {
      cy.clock(Cypress.dayjs(data.now, 'YYYY/MM/DD HH:mm').toDate().getTime())
    })
    cy.loadTables('schoollife/schoollife_tables.sql')
  })

  it('prevent student to be registered if there is no free places', function () {
    const slotToRegisterInside = this.hhcData.slotsTypes.replayTest.slotWithLimitedCapacity

    cy.login(registerer, HHCURL)
    selectSlotType(this.hhcData.slotsTypes.replayTest)
    // Select student
    selectStudent(studentToRegister)
    // Open registration modal
    getSlot(slotToRegisterInside).click()
    cy.get('[data-test=event-popup]').get('[data-test=registerStudent-option]').should('not.exist')
  })

  it.skip('check capacity before class registration for study slot', function () {
    // TODO
  })
})
