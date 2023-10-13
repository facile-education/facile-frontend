import { HHCURL } from '../../support/constants/urls'
import { CLASSTEACHER2, DOYEN, HEADMASTER, SECRETARY, TEACHER } from '../../support/constants/users'
import utils, {
  addTimeToSlot,
  clickOnEmptySlot, formatSchoolSlotLabel, getSlot,
  selectHours,
  selectSlotType,
  selectWeek,
  submit
} from '../../support/utils/horairesHorsCardesUtils'

const form = {
  startHour: '14:00',
  endHour: '15:00',
  teacherName: 'Jovanovic Darko',
  teacherSearch: 'dar',
  roomNumber: 'A110',
  capacity: 20
}

const slotToCreate = {
  nbWeekToCreateSlot: 2,
  schoolSlotNumber: 'P6',
  startDate: '2023/10/03 12:50',
  endDate: '2023/10/03 13:35',
  teacher: TEACHER,
  roomNumber: 'A110',
  capacity: 20
}

const rolesThatCanRegister = [HEADMASTER, SECRETARY, DOYEN]
const rolesThatCannotRegister = [TEACHER, CLASSTEACHER2]

const fillEditSlotModal = (clickedEmptySlot, slotToCreate) => {
  cy.get('[data-test=edit-slot-modal]').within(() => {
    utils.submit()

    cy.get('[data-test=teacher-part]').contains('.error-message', 'Champ requis').should('be.visible')
    cy.get('[data-test=room-part]').contains('.error-message', 'Champ requis').should('be.visible')
    cy.get('[data-test=capacity-part]').contains('.error-message', 'Champ requis').should('be.visible')

    // Set slot
    cy.get('[data-test=time-selection]').find('.base-dropdown').within(() => {
      cy.get('button').should('contain', formatSchoolSlotLabel(clickedEmptySlot.linkedSchoolSlot)).click()
      cy.get('.suggestion-list').contains(formatSchoolSlotLabel(slotToCreate)).click()
      cy.get('.suggestion-list').should('not.exist')
    })

    // Set duration
    cy.get('[data-test=period]').within(() => {
      const startDate = Cypress.dayjs(slotToCreate.startDate, 'YYYY/MM/DD HH:mm')
      const endDate = Cypress.dayjs(slotToCreate.startDate, 'YYYY/MM/DD HH:mm').add(slotToCreate.nbWeekToCreateSlot - 1, 'week')
      cy.get('button').click()
      cy.selectDateRangeInVCalendar(startDate, endDate)
    })

    // Teacher field
    cy.get('[data-test=teacher-part]').within(() => {
      cy.get('input').type(slotToCreate.teacher.lastname)
      cy.tick(500)
      cy.get('.suggestion-list').contains(slotToCreate.teacher.lastname + ' ' + slotToCreate.teacher.firstName).click()
    })

    // Room number
    cy.get('[data-test=room-part]').within(() => {
      cy.get('input').type(slotToCreate.roomNumber)
    })

    // Capacity
    cy.get('[data-test=capacity-part]').within(() => {
      cy.get('input').type(slotToCreate.capacity)
    })

    utils.submit()
  })
  cy.get('[data-test=edit-slot-modal]').should('not.exist')
}

describe('HHC slots creation', () => {
  beforeEach(() => {
    cy.fixture('hhc.json').as('hhcData').then(data => {
      cy.clock(Cypress.dayjs(data.now, 'YYYY/MM/DD HH:mm').toDate().getTime())
    })
    cy.loadTables('schoollife/schoollife_tables_empty.sql')
  })

  it(' is present for good roles', function () {
    const emptySlot = this.hhcData.emptySlot
    const slotType = this.hhcData.slotsTypes.tutoring // No need to test all slot types

    rolesThatCannotRegister.forEach(role => {
      cy.login(role, HHCURL)
      selectSlotType(slotType)

      clickOnEmptySlot(emptySlot.day, emptySlot.slotNumberOnCalendar)
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(500) // Modal should not be present after 500ms
      cy.get('[data-test=edit-slot-modal]').should('not.exist')
    })

    rolesThatCanRegister.forEach(role => {
      cy.login(role, HHCURL)
      selectSlotType(slotType)

      clickOnEmptySlot(emptySlot.day, emptySlot.slotNumberOnCalendar)
      cy.get('[data-test=edit-slot-modal]').should('be.visible')
    })
  })

  it.only('Create slot', function () {
    const previousWeek = Cypress.dayjs(this.hhcData.now, 'YYYY/MM/DD HH:mm').add(-1, 'week')
    const nextWeek = Cypress.dayjs(this.hhcData.now, 'YYYY/MM/DD HH:mm').add(1, 'week')
    const weekAfterLimit = Cypress.dayjs(this.hhcData.now, 'YYYY/MM/DD HH:mm').add(slotToCreate.nbWeekToCreateSlot - 1, 'week')
    const slotTypes = this.hhcData.slotsTypes
    const emptySlot = this.hhcData.emptySlot
    const slotToCreateFormattedDate = Cypress.dayjs(slotToCreate.startDate, 'YYYY/MM/DD HH:mm').format('HH:mm') +
      ' - ' +
      Cypress.dayjs(slotToCreate.endDate, 'YYYY/MM/DD HH:mm').format('HH:mm')

    cy.login(rolesThatCanRegister[0], HHCURL)

    for (const attr in slotTypes) {
      const currentSlotType = slotTypes[attr]
      const existingSlot = currentSlotType.slotExample
      cy.log('==================== Test ' + currentSlotType.label + ' creation ====================')

      selectSlotType(currentSlotType)
      cy.get('.weeknumber-label').eq(2).click() // Go on current week (we don't know the date at each loop beginning)

      // Create slot
      clickOnEmptySlot(emptySlot.day, emptySlot.slotNumberOnCalendar)
      cy.get('[data-test=edit-slot-modal]')

      fillEditSlotModal(slotToCreate)

      getSlot(slotToCreate)
        .should('contain', currentSlotType.label)
        .should('contain', slotToCreateFormattedDate)
        .should('contain', slotToCreate.capacity + '/' + slotToCreate.capacity)
        .should('contain', slotToCreate.teacher.lastName)

      // Check previous week
      selectWeek(previousWeek)
      getSlot(addTimeToSlot(existingSlot, -1, 'week')).should('be.visible')
      getSlot(addTimeToSlot(slotToCreate, -1, 'week')).should('not.exist')

      // Check next week
      selectWeek(nextWeek)
      getSlot(addTimeToSlot(slotToCreate, 1, 'week')).should('be.visible')

      // Check week after limit
      selectWeek(weekAfterLimit)
      getSlot(addTimeToSlot(existingSlot, slotToCreate.nbWeekToCreateSlot, 'week')).should('be.visible')
      getSlot(addTimeToSlot(weekAfterLimit, slotToCreate.nbWeekToCreateSlot, 'week')).should('not.exist')
    }
  })
})
