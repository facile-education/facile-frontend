import { HHCURL } from '../../support/constants/urls'
import { CLASSTEACHER2, DOYEN, HEADMASTER, SECRETARY, TEACHER2 } from '../../support/constants/users'
import {
  addTimeToSlot,
  getSlot,
  selectSlotType,
  selectWeek
} from '../../support/utils/horairesHorsCardesUtils'

const rolesThatCanDelete = [HEADMASTER, SECRETARY, DOYEN]
const rolesThatCannotDelete = [TEACHER2, CLASSTEACHER2] // Not taking the first Teacher to avoid firing justification

const nbWeeksToDeleteSlots = 2 // The current week and one after

describe('HHC slots deletion', () => {
  beforeEach(() => {
    cy.fixture('hhc.json').as('hhcData').then(data => {
      cy.clock(Cypress.dayjs(data.now, 'YYYY/MM/DD HH:mm').toDate().getTime())
    })
    cy.loadTables('schoollife/schoollife_tables.sql')
    cy.loadTables('messaging/messaging_tables_empty.sql') // to empty
  })

  it(' is present for good roles', function () {
    const slotType = this.hhcData.slotsTypes.tutoring // No need to test all slot types
    const slotToModify = slotType.slotExample

    rolesThatCannotDelete.forEach(role => {
      cy.login(role, HHCURL)
      selectSlotType(slotType)

      getSlot(slotToModify).click()
      cy.get('[data-test=event-popup]').get('[data-test=deleteSlot-option]').should('not.exist')
    })

    rolesThatCanDelete.forEach(role => {
      cy.login(role, HHCURL)
      selectSlotType(slotType)

      getSlot(slotToModify).click()
      cy.get('[data-test=event-popup]').get('[data-test=deleteSlot-option]').should('exist')
    })
  })

  it('Delete slot', function () { // Only test for study
    const deleter = rolesThatCanDelete[0]
    cy.login(deleter, HHCURL)
    const slotType = this.hhcData.slotsTypes.study
    const slotToDelete = slotType.slotExample
    const previousWeek = Cypress.dayjs(this.hhcData.now, 'YYYY/MM/DD HH:mm').add(-1, 'week')
    const nextWeek = Cypress.dayjs(this.hhcData.now, 'YYYY/MM/DD HH:mm').add(1, 'week')
    const weekAfterLimit = Cypress.dayjs(this.hhcData.now, 'YYYY/MM/DD HH:mm').add(nbWeeksToDeleteSlots, 'week')

    // Open deleteModal
    selectSlotType(slotType)
    getSlot(slotToDelete).click()
    cy.get('[data-test=event-popup]').get('[data-test=deleteSlot-option]').click()

    // Test delete Modal
    const slotDatesLabel = Cypress.dayjs(slotToDelete.startDate, 'YYYY/MM/DD HH:mm').format('dddd [de] HH:mm') + Cypress.dayjs(slotToDelete.endDate, 'YYYY/MM/DD HH:mm').format(' [à] HH:mm')
    cy.get('[data-test="delete-slot-modal"]')
      .should('contain', slotType.label)
      .should('contain', slotDatesLabel)
      .within(() => {
        cy.get('[data-test=period]').within(() => {
          const startDate = Cypress.dayjs(slotToDelete.startDate, 'YYYY/MM/DD HH:mm')
          const endDate = Cypress.dayjs(slotToDelete.startDate, 'YYYY/MM/DD HH:mm').add(nbWeeksToDeleteSlots - 1, 'week')
          cy.get('button').click()
          cy.tick(500)
          cy.selectDateRangeInVCalendar(startDate, endDate)
          cy.tick(500)
        })
        cy.contains('button', 'Supprimer').click()
      })
    cy.get('[data-test="warning-modal"]').contains('button', 'Continuer').click()
    cy.get('[data-test="warning-modal"]').should('not.exist')
    cy.get('[data-test="delete-slot-modal"]').should('not.exist')

    getSlot(slotToDelete).should('not.exist')

    // Check previous week (should not be deleted)
    selectWeek(previousWeek)
    getSlot(addTimeToSlot(slotToDelete, -1, 'week')).should('exist')

    // Check next week
    selectWeek(nextWeek)
    cy.get('.fc-event') // Wait calendar events to loads
    getSlot(addTimeToSlot(slotToDelete, 1, 'week')).should('not.exist')

    // Check week after limit
    selectWeek(weekAfterLimit)
    getSlot(addTimeToSlot(slotToDelete, nbWeeksToDeleteSlots, 'week')).should('exist')

    // // Check deregistration notif for student in deleted slot // TODO: check notifs when we make dev for send it
    // cy.login(DOYEN, messagingURL)
    // waitMessagingToBeLoaded()
    // getThread([{
    //   sender: deleter.firstName + ' ' + deleter.lastName,
    //   recipients: [DOYEN.firstName + ' ' + DOYEN.lastName],
    //   date: '',
    //   subject: 'Fin du cercle d\'étude le ' + Cypress.dayjs(slotToDelete.startDate, 'YYYY/MM/DD HH:mm').format('dddd [à] H[h]mm'),
    //   content: 'TODO',
    //   messageIndexInThread: 0
    // }]).should('be.visible')
  })
})
