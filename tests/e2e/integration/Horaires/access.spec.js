import { scheduleURL } from '../../support/constants/urls'
import { DOYEN, HEADMASTER, PARENT, SCHOOL_ADMIN, SECRETARY, STUDENT, TEACHER } from '../../support/constants/users'
import { getSlot } from '../../support/utils/horairesHorsCardesUtils'
import { waitScheduleToBeLoaded } from '../../support/utils/scheduleUtils'

const scheduleUsers = [HEADMASTER, SCHOOL_ADMIN, DOYEN, SECRETARY, TEACHER, STUDENT, PARENT]

const canCreateSlotUsers = [HEADMASTER, SCHOOL_ADMIN]
const canSubstituteTeachers = [HEADMASTER, SCHOOL_ADMIN]
const haveSearchToolbarUsers = [HEADMASTER, SCHOOL_ADMIN, DOYEN, SECRETARY, TEACHER]

const isInList = (list, user) => {
  return list.indexOf(user) !== -1
}

describe('Schedule_Access', () => {
  beforeEach(() => {
    cy.fixture('schedule.json').as('scheduleData').then(data => {
      cy.clock(Cypress.dayjs(data.now, 'YYYY/MM/DD HH:mm').toDate().getTime())
    })
  })

  scheduleUsers.forEach(user => {
    it('Schedule_Access_' + user.role + '_CanAccess', () => {
      cy.get('@scheduleData').then((scheduleData) => {
        cy.login(user, scheduleURL)

        waitScheduleToBeLoaded()

        cy.get('[data-test="body"]').within(() => {
          // Commons elements
          cy.get('[data-test="weekList"]').should('be.visible')
          cy.get('.fc').should('be.visible')

          // CanCreateSlotUsers
          if (isInList(canCreateSlotUsers, user)) {
            cy.contains('button', 'NOUVEAU').should('be.visible')
          } else {
            cy.contains('button', 'NOUVEAU').should('not.exist')
          }

          // HaveSearchToolbarUsers
          if (isInList(haveSearchToolbarUsers, user)) {
            cy.get('.toolbar .base-dropdown').should('be.visible')
            cy.get('.toolbar .search').should('be.visible')
          } else {
            cy.get('.toolbar .base-dropdown').should('not.exist')
            cy.get('.toolbar .search').should('not.exist')
          }

          // CanSubstituteTeachers
          if (isInList(haveSearchToolbarUsers, user)) {
            // Select group in the list
            cy.get('.toolbar .base-dropdown').click()
            cy.get('.base-dropdown > .base-autocomplete').should('be.visible')
            cy.contains(scheduleData.selectedGroup.name).click()

            cy.get('.fc-timegrid-event').should('have.length', scheduleData.selectedGroup.nbSlots)
            getSlot(scheduleData.selectedGroup.slotExample).click()

            if (isInList(canSubstituteTeachers, user)) {
              cy.get('[data-test=event-popup]').get('[data-test=saveTeacherSubstitute-option]').should('be.visible')
            } else {
              cy.get('[data-test=event-popup]').get('[data-test=saveTeacherSubstitute-option]').should('not.exist')
            }
          }
        })
      })
    })
  })

  it('Schedule_Access_Unauthenticated_CanNotAccess', () => {
    cy.visit(scheduleURL)

    cy.get('.toolbar .base-dropdown').should('not.exist')
    cy.get('.toolbar .search').should('not.exist')
    cy.get('.weekly-horizontal-timeline').should('not.exist')
    cy.get('.fc').should('not.exist')
    cy.contains('Une authentification est requise pour accéder au service.').should('exist')
  })
})
