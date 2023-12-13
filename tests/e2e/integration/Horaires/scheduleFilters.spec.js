import { scheduleURL } from '../../support/constants/urls'
import { DOYEN, HEADMASTER, MULTI_PARENT, MULTI_STUDENT1, PARENT, SCHOOL_ADMIN, SECRETARY, TEACHER } from '../../support/constants/users'
import { checkScheduleSlot, waitScheduleToBeLoaded } from '../../support/utils/scheduleUtils'

const scheduleUsers = [HEADMASTER, SCHOOL_ADMIN, DOYEN, SECRETARY, TEACHER, MULTI_STUDENT1, PARENT]
const haveFiltersUsers = [HEADMASTER, SCHOOL_ADMIN, DOYEN, SECRETARY, TEACHER]
const UsersInFilterSuggestion = [SCHOOL_ADMIN, DOYEN, TEACHER, MULTI_STUDENT1] // SCHOOL_ADMIN and DOYEN are teachers

const isInList = (list, user) => {
  return list.indexOf(user) !== -1
}

describe('Schedule_Filters', () => {
  beforeEach(() => {
    cy.fixture('schedule.json').as('scheduleData').then(data => {
      cy.clock(Cypress.dayjs(data.now, 'YYYY/MM/DD HH:mm').toDate().getTime())
    })
    cy.intercept('GET', '**/schedule.cdtsession/get-user-sessions**').as('getUserSessions')
    cy.intercept('GET', '**/schedule.cdtsession/get-group-sessions**').as('getGroupSessions')
  })

  scheduleUsers.forEach(user => {
    it('Schedule_Filters_DisplayOrNotFiltersForUser' + user.role, () => {
      cy.login(user, scheduleURL)

      waitScheduleToBeLoaded()

      cy.get('[data-test="body"]').within(() => {
        if (isInList(haveFiltersUsers, user)) {
          cy.get('.toolbar .base-dropdown').should('be.visible')
          cy.get('.toolbar .search').should('be.visible')
        } else {
          cy.get('.toolbar .base-dropdown').should('not.exist')
          cy.get('.toolbar .search').should('not.exist')
        }
      })
    })
  })

  it('Schedule_Filters_SelectUserInFilter', function () {
    cy.login(TEACHER, scheduleURL)

    waitScheduleToBeLoaded()

    checkScheduleSlot(this.scheduleData[TEACHER.firstName].slotExample)

    cy.get('[data-test="user-completion-input"]').within(() => {
      cy.get('[data-test="tag-item"]').find('button[aria-label="Retirer"]').click()
      cy.get('[data-test="tag-item"]').should('not.exist')
      cy.get('input').type(MULTI_STUDENT1.firstName)
      cy.tick(500)
      cy.contains('.suggestion-list > li', MULTI_STUDENT1.lastName + ' ' + MULTI_STUDENT1.firstName).click()
      cy.get('[data-test="tag-item"]').should('contain', MULTI_STUDENT1.lastName + ' ' + MULTI_STUDENT1.firstName)
    })
    cy.wait('@getUserSessions')

    cy.get('.fc-timegrid-event').should('have.length', this.scheduleData[MULTI_STUDENT1.firstName].nbWeekSlots)
    checkScheduleSlot(this.scheduleData[MULTI_STUDENT1.firstName].slotExample)
  })

  it('Schedule_Filters_SelectGroup', function () {
    cy.login(TEACHER, scheduleURL)

    waitScheduleToBeLoaded()

    checkScheduleSlot(this.scheduleData[TEACHER.firstName].slotExample)

    // Select group
    cy.contains('[data-test="dropdown"]', 'Groupe').click()
    cy.contains('.suggestion-list > li', this.scheduleData.selectedGroup.name).click()
    cy.wait('@getGroupSessions')

    // User tag is removed
    cy.get('[data-test="user-completion-input"]').within(() => {
      cy.get('[data-test="tag-item"]').should('not.exist')
    })

    // Group schedule is displayed
    cy.get('.fc-timegrid-event').should('have.length', this.scheduleData.selectedGroup.nbWeekSlots)
    checkScheduleSlot(this.scheduleData.selectedGroup.slotExample)
  })

  it('Schedule_Filters_SelectChildForMultiParent', function () {
    cy.login(MULTI_PARENT, scheduleURL)
    const firstChild = MULTI_PARENT.students[0]
    const secondChild = MULTI_PARENT.students[1]

    waitScheduleToBeLoaded()

    // The first Student's schedule is loaded
    checkScheduleSlot(this.scheduleData[firstChild.firstName].slotExample)

    // Select the other child
    cy.contains('[data-test="dropdown"]', firstChild.firstName).click()
    cy.contains('.suggestion-list > li', secondChild.firstName).click()
    cy.wait('@getUserSessions')

    // The other child schedule is displayed
    cy.get('.fc-timegrid-event').should('have.length', this.scheduleData[secondChild.firstName].nbWeekSlots)
    checkScheduleSlot(this.scheduleData[secondChild.firstName].slotExample)
  })

  it('Schedule_Filters_DisplayedUsersInDropdown', function () {
    cy.login(HEADMASTER, scheduleURL)
    cy.intercept('GET', '**/user.usersearch/get-school-student-teacher-list**').as('getFilterResults')

    waitScheduleToBeLoaded()

    cy.get('[data-test="user-completion-input"]').within(() => {
      scheduleUsers.forEach(user => {
        cy.get('input').clear()
        cy.get('input').type(user.firstName)
        cy.tick(500)
        cy.wait('@getFilterResults')

        if (isInList(UsersInFilterSuggestion, user)) {
          cy.contains('.suggestion-list > li', user.lastName + ' ' + user.firstName).should('exist')
        } else {
          cy.contains('.suggestion-list > li', user.lastName + ' ' + user.firstName).should('not.exist')
        }
      })
    })
  })

  it('Schedule_Filters_ToggleGroupSelectorOnMobile', () => {
    cy.login(haveFiltersUsers[0], scheduleURL)

    waitScheduleToBeLoaded()

    // No toggle button on desktop
    cy.get('button.toggle-group-filter-button').should('not.exist')

    cy.viewport('iphone-5')

    // User input is visible by default
    cy.contains('[data-test="dropdown"]', 'Groupe').should('not.exist')
    cy.get('[data-test="user-completion-input"]').should('be.visible')

    // Toggle to group selection
    cy.get('button.toggle-group-filter-button').should('be.visible').click()
    cy.contains('[data-test="dropdown"]', 'Groupe').should('be.visible')
    cy.get('[data-test="user-completion-input"]').should('not.exist')

    // Re-toggle to user selection
    cy.get('button.toggle-group-filter-button').should('be.visible').click()
    cy.contains('[data-test="dropdown"]', 'Groupe').should('not.exist')
    cy.get('[data-test="user-completion-input"]').should('be.visible')
  })
})
