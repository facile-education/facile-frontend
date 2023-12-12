import { HHCURL } from '../../support/constants/urls'
import { CLASSTEACHER2, DOYEN, HEADMASTER, SECRETARY, TEACHER, TEACHER2 } from '../../support/constants/users'
import {
  addTimeToSlot,
  formatSchoolSlotLabel, getHHCSlot,
  selectSlotType,
  selectWeek,
  submit
} from '../../support/utils/horairesHorsCardesUtils'

const modifiedSlot = {
  nbWeekToCreateSlot: 2,
  schoolSlotNumber: 'P6',
  startDate: '2023/10/03 12:50',
  endDate: '2023/10/03 13:35',
  teacher: TEACHER,
  room: 'A110',
  capacity: 42
}

const rolesThatCanModify = [HEADMASTER, SECRETARY, DOYEN]
const rolesThatCannotModify = [TEACHER2, CLASSTEACHER2] // Not taking the first Teacher to avoid firing justification

describe('HHC_UpdateSlot', () => { // TODO: factorise with create and delete permission tests
  beforeEach(() => {
    cy.fixture('hhc.json').as('hhcData').then(data => {
      cy.clock(Cypress.dayjs(data.now, 'YYYY/MM/DD HH:mm').toDate().getTime())
    })
    cy.loadTables('schoollife/schoollife_tables.sql')
  })

  it('HHC_UpdateSlot_isPresentForGoodRoles', function () {
    const slotType = this.hhcData.slotsTypes.tutoring // No need to test all slot types
    const slotToModify = slotType.slotExample

    rolesThatCannotModify.forEach(role => {
      cy.login(role, HHCURL)
      selectSlotType(slotType)

      getHHCSlot(slotToModify).click()
      cy.get('[data-test=event-popup]').get('[data-test=updateSlot-option]').should('not.exist')
    })

    rolesThatCanModify.forEach(role => {
      cy.login(role, HHCURL)
      selectSlotType(slotType)

      getHHCSlot(slotToModify).click()
      cy.get('[data-test=event-popup]').get('[data-test=updateSlot-option]').should('exist')
    })
  })

  it('HHC_UpdateSlot_ModifySlotAttributes', function () {
    cy.login(rolesThatCanModify[0], HHCURL)
    const slotType = this.hhcData.slotsTypes.tutoring
    const slotToModify = slotType.slotExample
    const slotToModifyDayLabel = Cypress.dayjs(slotToModify.startDate, 'YYY/MM/DD HH:mm').format('dddd')
    const previousWeek = Cypress.dayjs(this.hhcData.now, 'YYYY/MM/DD HH:mm').add(-1, 'week')
    const nextWeek = Cypress.dayjs(this.hhcData.now, 'YYYY/MM/DD HH:mm').add(1, 'week')

    // Open updateModal
    selectSlotType(slotType)
    getHHCSlot(slotToModify).click()
    cy.get('[data-test=event-popup]').get('[data-test=updateSlot-option]').click()

    // Check and change fields
    cy.get('[data-test="edit-slot-modal"]').within(() => {
      cy.contains('.window-header', slotType.label).should('be.visible')
      cy.contains('Le ' + slotToModifyDayLabel + ' en')

      // Slot
      cy.get('[data-test=time-selection]').find('.base-dropdown').within(() => {
        cy.contains('button', formatSchoolSlotLabel(slotToModify)).click()
        cy.get('.suggestion-list').contains(formatSchoolSlotLabel(modifiedSlot)).click()
        cy.get('.suggestion-list').should('not.exist')
      })

      // Teacher field
      cy.get('[data-test=teacher-part]').within(() => {
        cy.contains('.tag-item', slotToModify.teacher.lastName + ' ' + slotToModify.teacher.firstName).as('currentTagItem').should('be.visible')
        cy.get('@currentTagItem').find('.fa-times').click() // Todo: have a better selector on tag-item remove button
        cy.get('@currentTagItem').should('not.exist')
        cy.get('input').type(modifiedSlot.teacher.lastName)
        cy.tick(500)
        cy.get('.suggestion-list').contains(modifiedSlot.teacher.lastName + ' ' + modifiedSlot.teacher.firstName).click()
      })

      // Room number
      cy.get('[data-test=room-part]').within(() => {
        cy.get('input').should('have.value', slotToModify.room).clear()
        cy.get('input').type(modifiedSlot.room)
      })

      // Capacity
      cy.get('[data-test=capacity-part]').within(() => {
        cy.get('input').should('have.value', slotToModify.capacity).clear()
        cy.get('input').type(modifiedSlot.capacity)
      })

      submit()
    })
    cy.get('[data-test=edit-slot-modal]').should('not.exist')

    // Check slot modifications
    const modifiedSlotExpectedFreePlaces = slotToModify.freePlaces + (modifiedSlot.capacity - slotToModify.capacity)
    getHHCSlot(slotToModify).should('not.exist')
    getHHCSlot(modifiedSlot).click()
    cy.get('[data-test=event-popup]')
      .should('contain', slotType.label)
      .should('contain', modifiedSlotExpectedFreePlaces)
      .should('contain', modifiedSlot.teacher.lastName)
      .should('contain', modifiedSlot.room)

    // Check previous week (expected to not be modified)
    // TODO: currently custom tests to have the expected buggy behaviour, => to expect to have the slotToModify
    selectWeek(previousWeek)
    getHHCSlot(addTimeToSlot(modifiedSlot, -1, 'week')).should('not.exist')
    let customPreviousExpectedSlot = { ...modifiedSlot }
    customPreviousExpectedSlot.startDate = slotToModify.startDate
    customPreviousExpectedSlot.endDate = slotToModify.endDate
    customPreviousExpectedSlot = addTimeToSlot(customPreviousExpectedSlot, -1, 'week')
    getHHCSlot(customPreviousExpectedSlot).click()
    cy.get('[data-test=event-popup]')
      .should('contain', slotType.label)
      .should('contain', modifiedSlotExpectedFreePlaces + 1 + ' places libres') // +1 because this week, the student is not registered
      .should('contain', customPreviousExpectedSlot.teacher.lastName)
      .should('contain', customPreviousExpectedSlot.room)

    // Check next week
    selectWeek(nextWeek)
    getHHCSlot(addTimeToSlot(slotToModify, 1, 'week')).should('not.exist')
    getHHCSlot(addTimeToSlot(modifiedSlot, 1, 'week')).click()
    cy.get('[data-test=event-popup]')
      .should('contain', slotType.label)
      .should('contain', modifiedSlotExpectedFreePlaces + 1) // +1 because this week, the student is not registered
      .should('contain', modifiedSlot.teacher.lastName)
      .should('contain', modifiedSlot.room)

    // No notification to test
  })

  it('HHC_CreateSlot_TryToChangeRoomCapacityBesideTheCurrentRegisteredStudentNumber', function () {
    cy.login(rolesThatCanModify[0], HHCURL)
    const slotType = this.hhcData.slotsTypes.tutoring
    const slotToModify = slotType.slotExample
    const nbStudentsRegistered = slotType.slotExample.capacity - slotType.slotExample.freePlaces

    // Open updateModal
    selectSlotType(slotType)
    getHHCSlot(slotToModify).click()
    cy.get('[data-test=event-popup]').get('[data-test=updateSlot-option]').click()

    // Check and change fields
    cy.get('[data-test="edit-slot-modal"]').within(() => {
      // Capacity
      cy.get('[data-test=capacity-part]').within(() => {
        cy.get('input').should('have.value', slotToModify.capacity).clear()
        cy.get('input').type(nbStudentsRegistered - 1)
      })
    })

    submit()

    cy.get('.error-message').should('be.visible')
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500) // Check if modal is present after 500ms
    cy.get('[data-test="edit-slot-modal"]').should('be.visible')
  })
})
