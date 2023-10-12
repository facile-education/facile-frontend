import { HHCURL } from '../../support/constants/urls'
import { HEADMASTER } from '../../support/constants/users'
import { formatEventTeacherName, getSlot } from '../../support/utils/horairesHorsCardesUtils'

const checkSlotSelectionMenu = (slotTypes) => {
  cy.get('[data-test=user-completion-input]').should('not.exist')
  cy.get('.fc').should('not.exist')
  cy.get('.date-picker').should('not.exist')

  // Check all the slot types are here
  cy.get('[data-test*=slot-type-item]', { timeout: 5000 }).should('have.length', 5).parent().within(() => {
    cy.get('[data-test=slot-type-item-' + slotTypes.tutoring.type + ']').should('exist')
    cy.get('[data-test=slot-type-item-' + slotTypes.study.type + ']').should('exist')
    cy.get('[data-test=slot-type-item-' + slotTypes.replayTest.type + ']').should('exist')
    cy.get('[data-test=slot-type-item-' + slotTypes.detention.type + ']').should('exist')
    cy.get('[data-test=slot-type-item-' + slotTypes.fired.type + ']').should('exist')
  })
}

describe('desktop navigation', () => {
  beforeEach(() => {
    cy.fixture('hhc.json').as('hhcData').then(data => {
      cy.clock(Cypress.dayjs(data.now, 'YYYY/MM/DD HH:mm').toDate().getTime())
    })
    cy.loadTables('schoollife/schoollife_tables.sql')
    cy.login(HEADMASTER, HHCURL)
  })

  it('contains slot selection', function () {
    // At the beginning (when no slot type is selected), there is no display of calendar and user selection
    checkSlotSelectionMenu(this.hhcData.slotsTypes)
  })

  it('select slot type', function () {
    const slotTypes = this.hhcData.slotsTypes
    for (const attr in slotTypes) {
      const slotType = slotTypes[attr]
      cy.log('select ' + slotType.label)
      // Select tutoring type
      cy.get('[data-test=slot-type-item-' + slotType.type + ']', { timeout: 6000 }).click()

      // User selection and Calendar should appear
      cy.get('[data-test=user-completion-input]').should('be.visible')
      cy.get('.fc').should('be.visible')
      // Check events number
      cy.get('.fc-timegrid-event').should('have.length', slotType.nbSlotsAtSelectedWeek)
      // Check the good event type an it teacher is displayed
      getSlot(slotType.slotExample).within(() => {
        cy.contains(slotType.label).should('exist')
        cy.contains(formatEventTeacherName(slotType.slotExample.teacher)).should('exist')
      })
    }
  })
})

describe('mobile navigation', () => {
  beforeEach(() => {
    cy.fixture('hhc.json').as('hhcData').then(data => {
      cy.clock(Cypress.dayjs(data.now, 'YYYY/MM/DD HH:mm').toDate().getTime())
    })
    cy.loadTables('schoollife/schoollife_tables.sql')
    cy.viewport('iphone-5')
    cy.login(HEADMASTER, HHCURL)
  })

  it('contains slot selection', function () {
    // At the beginning (when no slot type is selected), there is no display of calendar and user selection
    checkSlotSelectionMenu(this.hhcData.slotsTypes)
  })

  it('select slot type', function () {
    const slotTypes = this.hhcData.slotsTypes
    const now = Cypress.dayjs(this.hhcData.now)
    for (const attr in slotTypes) {
      const slotType = slotTypes[attr]
      cy.log('select ' + slotType.label)

      // Select tutoring type
      cy.get('[data-test=slot-type-item-' + slotType.type + ']', { timeout: 6000 }).click()

      // User selection and Calendar should appear
      cy.get('[data-test=user-completion-input]').should('be.visible')
      cy.get('.toolbar [data-test=slot-type-item-' + slotType.type + ']').should('be.visible').as(slotType.label)
      cy.get('[data-test=toggle-calendar-selector]').should('be.visible')
      cy.get('.toolbar [data-test=user-completion-input]').should('be.visible')

      // Calendar should be visible with today date only
      cy.get('.fc').should('be.visible')
      cy.contains(now.format('dddd DD/MM')).should('exist')
      cy.contains(now.add(1, 'day').format('dddd DD/MM')).should('not.exist')
      cy.contains(now.subtract(1, 'day').format('dddd DD/MM')).should('not.exist')

      // Check events number
      cy.get('.fc-timegrid-event').should('have.length', slotType.nbSlotsAtSelectedDay)

      // Click on slotType to go back on slot selection
      cy.get('@' + slotType.label).click()
    }
  })
})
