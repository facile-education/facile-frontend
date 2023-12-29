import { scheduleURL } from '../../support/constants/urls'
import { DOYEN, HEADMASTER, PARENT, SCHOOL_ADMIN, SECRETARY, STUDENT, TEACHER } from '../../support/constants/users'
import { checkScheduleSlot, getSlot, waitScheduleToBeLoaded } from '../../support/utils/scheduleUtils'
import { isInList, selectAutocompleteItem, selectDropdownItem } from '../../support/utils/testUtils'

const scheduleUsers = [HEADMASTER, SCHOOL_ADMIN, DOYEN, SECRETARY, TEACHER, STUDENT, PARENT]
const canCreateSlotUsers = [HEADMASTER, SCHOOL_ADMIN]
const fillSessionModal = (slotToCreate) => {
  const slotStartDate = Cypress.dayjs(slotToCreate.startDate, 'YYYY/MM/DD HH:mm')

  // Slot day
  selectDropdownItem(cy.get('[data-test="day-dropdown"]'), slotStartDate.format('dddd'))

  // Slot slot
  selectDropdownItem(cy.get('[data-test="slot-dropdown"]'), slotToCreate.schoolSlotNumber)

  // Slot group
  selectDropdownItem(cy.get('[data-test="group-dropdown"]'), slotToCreate.groupName)

  // Slot subject
  selectDropdownItem(cy.get('[data-test="subject-dropdown"]'), slotToCreate.courseSubject)

  // Slot teacher
  slotToCreate.teachers.forEach(teacher => {
    cy.get('[data-test="tagsInput"]').as('teacherTagsInput') // Change selector to get the tags input that contain [placeholder="Enseignants"] property
    selectAutocompleteItem(cy.get('@teacherTagsInput'), teacher.lastName + ' ' + teacher.firstName)
  })

  // Slot room
  cy.get('input[placeholder="Salle"]').type(slotToCreate.room)

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

  context('Check display', function () {
    it('Schedule_CreateSlot_CheckOptionForRole', () => {
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

  it.skip('Schedule_CreateSlot_CreateSlot', function () { // TODO: unskip when the date is handle by the frontend
    const weekListFormat = 'D MMM'
    const currentWeek = Cypress.dayjs(this.scheduleData.now, 'YYYY/MM/DD HH:mm')
    const nextWeekLabel = currentWeek.add(1, 'week').startOf('week').format(weekListFormat)
    const slotToCreate = {
      schoolSlotNumber: 'P2',
      startDate: '2023/10/02 08:45',
      endDate: '2023/10/02 09:30',
      teachers: [TEACHER],
      room: 'te57',
      courseName: 'AL0922',
      courseSubject: 'Allemand',
      groupName: this.scheduleData.selectedGroup.name,
      isRecurrent: false
    }
    const secondSlotToCreate = {
      schoolSlotNumber: 'P4',
      startDate: '2023/10/02 10:35',
      endDate: '2023/10/02 11:20',
      teachers: [TEACHER, DOYEN],
      room: 'te57',
      courseName: 'AL0922',
      courseSubject: 'Allemand',
      groupName: this.scheduleData.selectedGroup.name,
      isRecurrent: true
    }

    cy.loadTables('schedule/schedule_tables_empty.sql')

    cy.login(canCreateSlotUsers[0], scheduleURL)

    waitScheduleToBeLoaded()

    // Create first slot
    cy.contains('button', 'NOUVEAU').click()
    cy.get('[data-test="create-session-modal"]').within(() => {
      fillSessionModal(slotToCreate)

      cy.contains('button', 'Créer').click()
    })
    cy.get('[data-test="create-session-modal"]').should('not.exist')

    // Group dropdown selection is updated with the selected class
    cy.contains('[data-test="dropdown"]', this.scheduleData.selectedGroup.name)

    // Check calendar content
    cy.get('.fc-timegrid-event').should('have.length', this.scheduleData.selectedGroup.nbWeekSlots + 1)
    checkScheduleSlot(slotToCreate)

    // Create second slot (recurrent with multi-teachers)
    cy.contains('button', 'NOUVEAU').click()
    cy.get('[data-test="create-session-modal"]').within(() => {
      fillSessionModal(secondSlotToCreate)

      cy.contains('button', 'Créer').click()
    })
    cy.get('[data-test="create-session-modal"]').should('not.exist')

    // Group dropdown selection is updated with the selected class
    cy.contains('[data-test="dropdown"]', this.scheduleData.selectedGroup.name)

    // Check calendar content
    cy.get('.fc-timegrid-event').should('have.length', this.scheduleData.selectedGroup.nbWeekSlots + 2)
    checkScheduleSlot(secondSlotToCreate)

    // Go one week after
    cy.get('[data-test="weekList"]').within(() => {
      cy.contains('button', nextWeekLabel).click()
    })

    // Check slots
    cy.get('.fc-timegrid-event').should('have.length', this.scheduleData.selectedGroup.nbWeekSlots + 1)
    getSlot(slotToCreate).should('not.exist')
    checkScheduleSlot({
      ...secondSlotToCreate,
      startDate: Cypress.dayjs(secondSlotToCreate.startDate, 'YYYY/MM/DD HH:mm').add(1, 'week'),
      endDate: Cypress.dayjs(secondSlotToCreate.endDate, 'YYYY/MM/DD HH:mm').add(1, 'week')
    })

    // Go to previous week to not see the created slots
  })

  it.skip('Schedule_CreateSlot_CreateSlotWithConflicts', function () {
    // Create new slot at the same moment as an other slot with same teachers or same room
  })

  it('Schedule_CreateSlot_CheckModalInitialisationAndValidation', function () {
    cy.intercept('GET', '**/schedule.cdtsession/get-group-sessions**').as('getGroupSessions')

    cy.login(canCreateSlotUsers[0], scheduleURL)

    waitScheduleToBeLoaded()

    // Select a class
    cy.contains('[data-test="dropdown"]', 'Groupe').click()
    cy.contains('.suggestion-list > li', this.scheduleData.selectedGroup.name).click()
    cy.wait('@getGroupSessions')

    cy.contains('button', 'NOUVEAU').click()
    cy.get('[data-test="create-session-modal"]').within(() => {
      // Slot group
      cy.get('[data-test="group-dropdown"]').should('contain', this.scheduleData.selectedGroup.name)
      // No particular other init behaviour to test

      // Form validation
      cy.contains('button', 'Créer').click()
      cy.get('.teachers').within(() => {
        cy.contains('.error-message', 'Veuillez sélectionner au moins un enseignant')
      })
      cy.get('.room').within(() => {
        cy.contains('.error-message', 'Champ requis')
      })
    })
  })
})
