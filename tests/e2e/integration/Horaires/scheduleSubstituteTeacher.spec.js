import { scheduleURL } from '../../support/constants/urls'
import { DOYEN, HEADMASTER, PARENT, SCHOOL_ADMIN, SECRETARY, STUDENT, TEACHER, TEACHER2 } from '../../support/constants/users'
import { addTimeToSlot, getSlot, getSlotPopover, selectGroupSchedule, selectVisibleWeekInTimeLine, waitScheduleToBeLoaded } from '../../support/utils/scheduleUtils'
import { isInList, selectAutocompleteItem, selectDropdownItem } from '../../support/utils/testUtils'

const scheduleUsers = [HEADMASTER, SCHOOL_ADMIN, DOYEN, SECRETARY, TEACHER, STUDENT, PARENT]
const haveSearchToolbarUsers = [HEADMASTER, SCHOOL_ADMIN, DOYEN, SECRETARY, TEACHER]
const canSubstituteTeachers = [HEADMASTER, SECRETARY, DOYEN]

const lastAffectedDateFormat = 'DD/MM/YYYY HH:mm'
const openSlotSubstituteModal = (slot) => {
  getSlot(slot).click()

  cy.get('[data-test=event-popup]').get('[data-test=saveTeacherSubstitute-option]').click()
}

const selectSubstitute = (substitute) => {
  cy.intercept('GET', '**/user.usersearch/get-schoolife-agents**').as('getCompletion')

  selectAutocompleteItem(
    cy.get('[data-test="user-completion-input"]'),
    substitute.lastName + ' ' + substitute.firstName,
    500,
    '@getCompletion'
  )
}

const loadWeekSlots = (day) => {
  selectVisibleWeekInTimeLine(day)
  cy.wait('@getGroupSessions')
}

describe('Schedule_SubstituteTeacher', () => {
  before(() => {
    cy.loadTables('scheduleConfiguration/scheduleNormalConfiguration_tables.sql')
  })

  beforeEach(() => {
    cy.fixture('schedule.json').as('scheduleData').then(data => {
      cy.clock(Cypress.dayjs(data.now, 'YYYY/MM/DD HH:mm').toDate().getTime())
    })
    cy.intercept('GET', '**/schedule.cdtsession/get-user-sessions**').as('getUserSessions')
    cy.intercept('GET', '**/schedule.cdtsession/get-group-sessions**').as('getGroupSessions')
  })

  it('Schedule_SubstituteTeacher_CheckOptionForRole', function () {
    scheduleUsers.forEach(user => {
      cy.log('Check substituteTeacher option for role ' + user.role)
      cy.login(user, scheduleURL)

      waitScheduleToBeLoaded()

      cy.get('[data-test="body"]').within(() => {
        // CanSubstituteTeachers
        if (isInList(haveSearchToolbarUsers, user)) {
          selectGroupSchedule(this.scheduleData.selectedGroup)

          getSlot(this.scheduleData.selectedGroup.slotExample).click()

          if (isInList(canSubstituteTeachers, user)) {
            cy.get('[data-test=event-popup]').get('[data-test=saveTeacherSubstitute-option]').should('be.visible')
          } else {
            cy.get('[data-test=event-popup]').get('[data-test=saveTeacherSubstitute-option]').should('not.exist')
          }
        }
      })
    })
  })

  context('Change schedule data', function () {
    beforeEach(function () {
      cy.loadTables('schedule/schedule_tables.sql')

      cy.login(canSubstituteTeachers[0], scheduleURL)

      waitScheduleToBeLoaded()

      selectGroupSchedule(this.scheduleData.selectedGroup)
    })

    it('Schedule_SubstituteTeacher_CheckSubstituteModal', function () {
      const currentWeekSlot = this.scheduleData.selectedGroup.slotExample
      const currentWeekSlotStartDate = Cypress.dayjs(currentWeekSlot.startDate, 'YYYY/MM/DD HH:mm')
      const coTeachingSlot = this.scheduleData.selectedGroup.coTeachingSlotExample

      openSlotSubstituteModal(currentWeekSlot)

      cy.get('[data-test=sessionTeacherModal]').should('be.visible').within(() => {
        // Course name
        cy.contains(currentWeekSlot.courseName).should('be.visible')

        // First slot affected
        cy.contains('p', 'Première séance affectée :')
          .should('contain', currentWeekSlotStartDate.format('DD/MM/YYYY'))
          .should('contain', currentWeekSlotStartDate.format('HH:mm'))

        // Current teacher
        cy.contains(currentWeekSlot.teacher.lastName).should('be.visible')

        // Form validation
        // cy.contains('button', 'Valider').should('be.disabled') // TODO: disable the submit button when there is no changes in modal
        cy.contains('button', 'Valider').click()
      })

      // Co-teaching
      cy.log('Test co-teaching slot substitute modal')
      cy.get('[data-test=sessionTeacherModal]').should('not.exist')
      openSlotSubstituteModal(coTeachingSlot)

      cy.get('[data-test=sessionTeacherModal]').should('be.visible').within(() => {
        // Course name
        cy.contains(coTeachingSlot.courseName).should('be.visible')

        coTeachingSlot.teachers.forEach(teacher => {
          cy.contains(teacher.lastName).should('be.visible')
        })

        cy.get('[data-test="user-completion-input"]').should('have.length', coTeachingSlot.teachers.length)
        cy.get('[data-test="dropdown"]').should('have.length', coTeachingSlot.teachers.length)
      })
    })

    it('Schedule_SubstituteTeacher_SubstituteCurrentSlot', function () {
      const now = Cypress.dayjs(this.scheduleData.now, 'YYYY/MM/DD HH:mm')
      const currentWeekSlot = this.scheduleData.selectedGroup.slotExample
      const nextWeekSlot = addTimeToSlot(currentWeekSlot, 1, 'week')
      const nextNextWeekSlot = addTimeToSlot(currentWeekSlot, 2, 'week')
      const substituteTeacher = TEACHER

      openSlotSubstituteModal(currentWeekSlot)

      cy.get('[data-test=sessionTeacherModal]').within(() => {
        // Select substitute
        selectSubstitute(substituteTeacher)

        // Check available dates and select last Date
        const currentWeekSlotStartDate = Cypress.dayjs(currentWeekSlot.startDate, 'YYYY/MM/DD HH:mm')
        const nextCourseSlotDate = Cypress.dayjs(currentWeekSlot.nextCourseSlot.startDate, 'YYYY/MM/DD HH:mm')
        const nextWeekSlotStartDate = currentWeekSlotStartDate.add(1, 'week')

        cy.contains('div', 'Dernière séance affectée').within(() => {
          cy.contains('button', currentWeekSlotStartDate.format(lastAffectedDateFormat)).click()
          cy.get('.suggestion-list').contains('li', nextCourseSlotDate.format(lastAffectedDateFormat)).should('not.exist')
          cy.get('.suggestion-list').contains('li', nextWeekSlotStartDate.format(lastAffectedDateFormat)).click()
        })

        // Form validation
        cy.contains('button', 'Valider').click()
      })

      cy.get('[data-test=sessionTeacherModal]').should('not.exist')
      cy.wait('@getGroupSessions')

      // Check the current week slot is updated
      getSlotPopover(currentWeekSlot)
        .should('contain', substituteTeacher.lastName)
        .should('not.contain', currentWeekSlot.teacher.lastName)
      getSlotPopover(currentWeekSlot.nextCourseSlot)
        .should('not.contain', substituteTeacher.lastName)
        .should('contain', currentWeekSlot.nextCourseSlot.teacher.lastName)

      // Check the next week slot is updated
      loadWeekSlots(now.add(1, 'week'))
      getSlotPopover(nextWeekSlot)
        .should('contain', substituteTeacher.lastName)
        .should('not.contain', currentWeekSlot.teacher.lastName)

      // Check the next next week slot is not updated
      loadWeekSlots(now.add(2, 'week'))
      getSlotPopover(nextNextWeekSlot)
        .should('not.contain', substituteTeacher.lastName)
        .should('contain', currentWeekSlot.teacher.lastName)
    })

    it('Schedule_SubstituteTeacher_SubstituteAllSessionsSlots', function () {
      const now = Cypress.dayjs(this.scheduleData.now, 'YYYY/MM/DD HH:mm')
      const currentWeekSlot = this.scheduleData.selectedGroup.slotExample
      const nextWeekSlot = addTimeToSlot(currentWeekSlot, 1, 'week')
      const substituteTeacher = TEACHER

      openSlotSubstituteModal(currentWeekSlot)

      cy.get('[data-test=sessionTeacherModal]').within(() => {
        // Select substitute
        selectSubstitute(substituteTeacher)

        // Select all courses sessions
        cy.get('input[type="checkbox"]').click()
        cy.get('input[type="checkbox"]').should('be.checked')

        // Check available dates and select last Date
        const defaultLastSlotStartDate = Cypress.dayjs(currentWeekSlot.startDate, 'YYYY/MM/DD HH:mm')
        const nextCourseSlotDate = Cypress.dayjs(currentWeekSlot.nextCourseSlot.startDate, 'YYYY/MM/DD HH:mm')
        const nextWeekSlotStartDate = defaultLastSlotStartDate.add(1, 'week')
        cy.contains('div', 'Dernière séance affectée').within(() => {
          cy.contains('button', defaultLastSlotStartDate.format(lastAffectedDateFormat)).click()
          cy.get('.suggestion-list').contains('li', nextCourseSlotDate.format(lastAffectedDateFormat)).should('be.visible')
          cy.get('.suggestion-list').contains('li', nextWeekSlotStartDate.format(lastAffectedDateFormat)).click()
        })

        // Form validation
        cy.contains('button', 'Valider').click()
      })

      cy.get('[data-test=sessionTeacherModal]').should('not.exist')
      cy.wait('@getGroupSessions')

      // Check the current week slot is updated
      getSlotPopover(currentWeekSlot)
        .should('contain', substituteTeacher.lastName)
        .should('not.contain', currentWeekSlot.teacher.lastName)
      getSlotPopover(currentWeekSlot.nextCourseSlot)
        .should('contain', substituteTeacher.lastName)
        .should('not.contain', currentWeekSlot.nextCourseSlot.teacher.lastName)

      // Check the next week slot is updated
      loadWeekSlots(now.add(1, 'week'))
      getSlotPopover(nextWeekSlot)
        .should('contain', substituteTeacher.lastName)
        .should('not.contain', currentWeekSlot.teacher.lastName)
      // But not the next course because is after the last set course date
      getSlotPopover(nextWeekSlot.nextCourseSlot)
        .should('not.contain', substituteTeacher.lastName)
        .should('contain', currentWeekSlot.nextCourseSlot.teacher.lastName)
    })

    it('Schedule_SubstituteTeacher_deleteSubstitute', function () {
      const now = Cypress.dayjs(this.scheduleData.now, 'YYYY/MM/DD HH:mm')
      const substitution = this.scheduleData.selectedGroup.substitute
      const currentWeekSlot = substitution.concernSlot
      const nextWeekSlot = addTimeToSlot(currentWeekSlot, 1, 'week')

      openSlotSubstituteModal(substitution.concernSlot)

      cy.get('[data-test=sessionTeacherModal]').within(() => {
        // Set the last concern slot as the current week slot
        const lastConcernSlotDate = Cypress.dayjs(currentWeekSlot.startDate, 'YYYY/MM/DD HH:mm')
        selectDropdownItem(
          cy.get('[data-test="dropdown"]'),
          lastConcernSlotDate.format(lastAffectedDateFormat)
        )

        // Remove current substitute
        cy.get('[data-test="user-completion-input"]').should('contain', substitution.substituteTeacher.lastName)
          .find('[data-test=tag-item]')
          .find('button[aria-label="Retirer"]').click()

        // Form validation
        cy.contains('button', 'Valider').click()
      })

      cy.get('[data-test=sessionTeacherModal]').should('not.exist')
      cy.wait('@getGroupSessions')

      // Check the current week slot is updated
      getSlotPopover(currentWeekSlot)
        .should('contain', substitution.baseTeacher.lastName)
        .should('not.contain', substitution.substituteTeacher.lastName)

      // Check the next week slot is not updated (because the last concern slot is only on the current week
      loadWeekSlots(now.add(1, 'week'))
      getSlotPopover(nextWeekSlot)
        .should('not.contain', substitution.baseTeacher.lastName)
        .should('contain', substitution.substituteTeacher.lastName)
    })

    it('Schedule_SubstituteTeacher_SubstituteASubstituteTeacher', function () {
      const now = Cypress.dayjs(this.scheduleData.now, 'YYYY/MM/DD HH:mm')
      const substitution = this.scheduleData.selectedGroup.substitute
      const currentWeekSlot = substitution.concernSlot
      const nextWeekSlot = addTimeToSlot(currentWeekSlot, 1, 'week')

      const newSubstituteTeacher = TEACHER2

      openSlotSubstituteModal(substitution.concernSlot)

      cy.get('[data-test=sessionTeacherModal]').within(() => {
        // Remove current substitute
        cy.get('[data-test="user-completion-input"]').should('contain', substitution.substituteTeacher.lastName)
          .find('[data-test=tag-item]')
          .find('button[aria-label="Retirer"]').click()
        // Select a new one
        selectSubstitute(newSubstituteTeacher)

        // Set the last concern slot as the current week slot
        const lastConcernSlotDate = Cypress.dayjs(currentWeekSlot.startDate, 'YYYY/MM/DD HH:mm')
        selectDropdownItem(cy.get('[data-test="dropdown"]'), lastConcernSlotDate.format(lastAffectedDateFormat))

        // Form validation
        cy.contains('button', 'Valider').click()
      })

      cy.get('[data-test=sessionTeacherModal]').should('not.exist')
      cy.wait('@getGroupSessions')

      // Check the current week slot is not updated
      getSlotPopover(currentWeekSlot)
        .should('contain', newSubstituteTeacher.lastName)
        .should('not.contain', substitution.baseTeacher.lastName)
        .should('not.contain', substitution.substituteTeacher.lastName)

      // Check the next week slot is updated (the base teacher is here)
      loadWeekSlots(now.add(1, 'week'))
      getSlotPopover(nextWeekSlot)
        .should('not.contain', newSubstituteTeacher.lastName)
        .should('not.contain', substitution.baseTeacher.lastName)
        .should('contain', substitution.substituteTeacher.lastName)
    })
  })
})
