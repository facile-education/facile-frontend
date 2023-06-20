import { now, slotTypes, url } from '../../support/constants/horairesHorsCadres'

const checkSlotSelectionMenu = () => {
  cy.get('[data-test=user-completion-input]').should('not.exist')
  cy.get('.fc').should('not.exist')
  cy.get('.date-picker').should('not.exist')

  // Check all the slot types are here
  cy.get('[data-test*=slot-type-item]').should('have.length', 5).parent().within(() => {
    cy.get('[data-test=slot-type-item-' + slotTypes.tutoring.type + ']').should('exist')
    cy.get('[data-test=slot-type-item-' + slotTypes.study.type + ']').should('exist')
    cy.get('[data-test=slot-type-item-' + slotTypes.replayTest.type + ']').should('exist')
    cy.get('[data-test=slot-type-item-' + slotTypes.detention.type + ']').should('exist')
    cy.get('[data-test=slot-type-item-' + slotTypes.fired.type + ']').should('exist')
  })
}

describe('desktop navigation', () => {
  beforeEach(() => {
    cy.clock(now.toDate().getTime())
    cy.exec('npm run db:loadTables schoollife_tables.sql')
    cy.clearDBCache()
    cy.logout()
    cy.login(url)
  })

  it('contains slot selection', () => {
    // At the beginning (when no slot type is selected), there is no display of calendar and user selection
    checkSlotSelectionMenu()
  })

  for (const attr in slotTypes) {
    const slot = slotTypes[attr]
    it('select ' + slot.label, () => {
      // Select tutoring type
      cy.get('[data-test=slot-type-item-' + slot.type + ']').click()

      // User selection and Calendar should appear
      cy.get('[data-test=user-completion-input]').should('be.visible')
      cy.get('.fc').should('be.visible')
      // Check events number
      cy.get('.fc-timegrid-event').should('have.length', slot.nbSlotsAtWeek35)
      // Check event type teacher is displayed
      cy.get('.fc-day-wed > .fc-timegrid-col-frame > :nth-child(2) >> .fc-timegrid-event').within(() => {
        cy.contains(slot.label).should('be.visible')
        cy.contains(slot.teacherNameAtWednesdaySlot).should('be.visible')
        // cy.contains('Capacité').should('be.visible') // TODO when refactoring capacity
      })
    })
  }
})

describe('mobile navigation', () => {
  beforeEach(() => {
    cy.logout()
    cy.clock(now.toDate().getTime())
    cy.viewport('iphone-5')
    cy.login(url)
  })

  it('contains slot selection', () => {
    // At the beginning (when no slot type is selected), there is no display of calendar and user selection
    checkSlotSelectionMenu()
  })

  for (const attr in slotTypes) {
    const slot = slotTypes[attr]
    it('select ' + slot.label, () => {
      // Select tutoring type
      cy.get('[data-test=slot-type-item-' + slot.type + ']').click()

      // User selection and Calendar should appear
      cy.get('[data-test=user-completion-input]').should('be.visible')
      cy.get('.toolbar [data-test=slot-type-item-' + slot.type + ']').should('be.visible').as(slot.label)
      cy.get('.toolbar .date-picker').should('be.visible')
      cy.get('.toolbar [data-test=user-completion-input]').should('be.visible')

      // Calendar should be visible with today date only
      cy.get('.fc').should('be.visible')
      cy.contains(now.format('dddd DD/MM')).should('exist')
      cy.contains(now.add(1, 'day').format('dddd DD/MM')).should('not.exist')
      cy.contains(now.subtract(1, 'day').format('dddd DD/MM')).should('not.exist')

      // Check events number
      cy.get('.fc-timegrid-event').should('have.length', 1)
      // Check event type teacher is displayed
      cy.get('.fc-day-wed > .fc-timegrid-col-frame > :nth-child(2) >> .fc-timegrid-event').within(() => {
        cy.contains(slot.label).should('be.visible')
        cy.contains(slot.teacherNameAtWednesdaySlot).should('be.visible')
        // cy.contains('Capacité').should('be.visible') // TODO when refactoring capacity
      })

      // Click on slotType to go back on slot selection
      cy.get('@' + slot.label).click()
      checkSlotSelectionMenu()
    })
  }
})
