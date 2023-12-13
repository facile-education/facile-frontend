import { scheduleURL } from '../../support/constants/urls'
import { DOYEN, HEADMASTER, PARENT, SCHOOL_ADMIN, SECRETARY, STUDENT, TEACHER } from '../../support/constants/users'
import { waitScheduleToBeLoaded } from '../../support/utils/scheduleUtils'
import { selectAutocompleteItem, selectDropdownItem } from '../../support/utils/testUtils'

const scheduleUsers = [HEADMASTER, SCHOOL_ADMIN, DOYEN, SECRETARY, TEACHER, STUDENT, PARENT]
const canCreateSlotUsers = [HEADMASTER, SCHOOL_ADMIN]

const isInList = (list, user) => {
  return list.indexOf(user) !== -1
}

const fillSessionModal = (slotToCreate) => {
  const slotStartDate = Cypress.dayjs(slotToCreate.startDate, 'YYYY/MM/DD HH:mm')

  // Slot day
  selectDropdownItem('[data-test="day-dropdown"]', slotStartDate.format('dddd'))

  // Slot slot
  selectDropdownItem('[data-test="slot-dropdown"]', slotToCreate.schoolSlotNumber)

  // Slot group
  selectDropdownItem('[data-test="group-dropdown"]', slotToCreate.groupName)

  // Slot subject
  selectDropdownItem('[data-test="subject-dropdown"]', slotToCreate.courseSubject)

  // Slot teacher
  selectAutocompleteItem('[data-test="subject-dropdown"] > [placeholder="Enseignant"]', slotToCreate.teacher.firstName + ' ' + slotToCreate.teacher.firstName)

  // Slot room
  cy.get('input[placeholder="Salle"').type(slotToCreate.room)

  // Slot recurrence
  if (slotToCreate.isRecurrent) {
    cy.get('input[type="checkbox"]').click()
    cy.get('input[type="checkbox"]').should('be.checked')
  }
}

describe('Schedule_CreateSlot', () => {
  before(() => {
    cy.loadTables('scheduleConfiguration/scheduleNormalConfiguration_tables.sql')
  })

  beforeEach(() => {
    cy.fixture('schedule.json').as('scheduleData').then(data => {
      cy.clock(Cypress.dayjs(data.now, 'YYYY/MM/DD HH:mm').toDate().getTime())
    })
    cy.intercept('GET', '**/schedule.cdtsession/get-user-sessions**').as('getUserSessions')
  })

  context('Check display', () => {
    it('Schedule_CreateSlot_CheckDisplayForRole', () => {
      scheduleUsers.forEach(user => {
        cy.log('Check display for role ' + user.role)
        cy.login(user, scheduleURL)

        waitScheduleToBeLoaded()

        cy.get('[data-test="body"]').within(() => {
          if (isInList(canCreateSlotUsers, user)) {
            cy.contains('button', 'NOUVEAU').should('be.visible')
          } else {
            cy.contains('button', 'NOUVEAU').should('not.exist')
          }
        })
      })
    })

    it('Schedule_CreateSlot_CheckDisplayOnMobile', () => {
      cy.login(canCreateSlotUsers[0], scheduleURL)
      cy.viewport('iphone-5')

      waitScheduleToBeLoaded()

      cy.contains('button', 'NOUVEAU').should('be.visible')
    })

    it.skip('Schedule_CreateSlot_HideOptionOutOfSchoolYear', () => {
      cy.login(canCreateSlotUsers[0], scheduleURL)
      cy.clock().invoke('setSystemTime', Cypress.dayjs(this.scheduleData.schoolYearEndDate, 'YYYY/MM/DD').add(7, 'day').toDate().getTime()) // To put after login to make it works

      waitScheduleToBeLoaded()

      cy.contains('button', 'NOUVEAU').should('not.exist')
    })
  })

  // todo: load schedule tables on the create tests context
  it('Schedule_CreateSlot_CreateSlot', () => {
    const slotToCreate = {
      schoolSlotNumber: 'P2',
      startDate: '2023/10/02 08:45',
      endDate: '2023/10/02 09:30',
      teacher: TEACHER,
      room: 'te57',
      courseName: 'AL0922',
      courseSubject: 'Allemand',
      groupName: this.scheduleData.selectedGroup.groupName,
      isRecurrent: false
    }

    cy.login(canCreateSlotUsers[0], scheduleURL)
    waitScheduleToBeLoaded()

    cy.contains('button', 'NOUVEAU').click()
    cy.get('[data-test="create-session-modal"]').within(() => {
      fillSessionModal(slotToCreate)

      cy.contains('button', 'Créer').click()
    })
  })

  // modale initialisation (depend of selected group, current week
})
