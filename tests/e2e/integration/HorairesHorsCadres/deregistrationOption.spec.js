import { now, slotTypes, url } from '../../support/constants/horairesHorsCadres'
import utils from '../../support/utils/horairesHorsCardesUtils'
import { TEACHER, TEACHER2, CLASSTEACHER, SCHOOL_ADMIN, DOYEN, SECRETARY } from '../../support/constants'

const slotToRegisterInside = {
  day: 'wed',
  date: now,
  startHour: '12:00',
  endHour: '13:00',
  teacherSearch: 'reg',
  teacherName: 'Regad Alexandre',
  teacherLastName: 'Regad',
  roomNumber: 'tg',
  capacity: 2
}

const studentToRegister = {
  name: 'ALOSTA ANYA (1051AC)',
  formattedName: 'Anya Alosta - 1051AC',
  search: 'alo'
}

const REGISTERER = { ...TEACHER, role: 'Registerer' }

const rolesToTestPermission = [REGISTERER, TEACHER2, CLASSTEACHER, SCHOOL_ADMIN, DOYEN, SECRETARY]

const haveDeregistrationPermissions = {
  [slotTypes.tutoring.label]: {
    [REGISTERER.lastName]: true,
    [TEACHER2.lastName]: false,
    [CLASSTEACHER.lastName]: false,
    [DOYEN.lastName]: false,
    [SECRETARY.lastName]: false,
    [SCHOOL_ADMIN.lastName]: false
  },
  [slotTypes.fired.label]: {
    [REGISTERER.lastName]: false,
    [TEACHER2.lastName]: false,
    [CLASSTEACHER.lastName]: false,
    [DOYEN.lastName]: true,
    [SECRETARY.lastName]: false,
    [SCHOOL_ADMIN.lastName]: true
  },
  [slotTypes.study.label]: {
    [REGISTERER.lastName]: true,
    [TEACHER2.lastName]: true,
    [CLASSTEACHER.lastName]: true,
    [DOYEN.lastName]: true,
    [SECRETARY.lastName]: true,
    [SCHOOL_ADMIN.lastName]: true
  },
  [slotTypes.replayTest.label]: {
    [REGISTERER.lastName]: true,
    [TEACHER2.lastName]: false,
    [CLASSTEACHER.lastName]: false,
    [DOYEN.lastName]: true,
    [SECRETARY.lastName]: true,
    [SCHOOL_ADMIN.lastName]: true
  },
  [slotTypes.detention.label]: {
    [REGISTERER.lastName]: true,
    [TEACHER2.lastName]: false,
    [CLASSTEACHER.lastName]: false,
    [DOYEN.lastName]: true,
    [SECRETARY.lastName]: true,
    [SCHOOL_ADMIN.lastName]: true
  }
}

const registerStudent = (haveToSelectCourse) => { // Just fill registration modal and submit
  console.log(haveToSelectCourse)
  if (haveToSelectCourse) {
    cy.get('.base-dropdown').click().within(() => {
      cy.get('li').first().click()
    })
  }
  cy.get('[data-test=student-registration-modal]').within(() => {
    cy.contains('button', 'Inscrire').click()
  })
  utils.waitCalendarToLoad()
  cy.get('[data-test=student-registration-modal]').should('not.exist')
}

describe('deregistration option', () => {
  beforeEach(() => {
    cy.logout()
    cy.clock(now.toDate().getTime())
    cy.login(url)
  })

  for (const attr in slotTypes) {
    const slot = slotTypes[attr]
    // if (slot.label === 'Travaux à refaire') {
    it('is present for good roles in ' + slot.label, () => {
      // Select slot
      cy.get('[data-test=slot-type-item-' + slot.type + ']').click()

      // Create slot
      utils.createSlot(slotToRegisterInside)

      // Register Student inside
      cy.logout()
      cy.login(url, REGISTERER)
      cy.get('[data-test=slot-type-item-' + slot.type + ']').click()
      utils.selectStudent(studentToRegister)
      utils.openSlotPopup(slotToRegisterInside, '2/2')
      cy.get('[data-test=openRegistration-option]').click()
      registerStudent(slot.label === 'Travaux à refaire' || slot.label === 'Renvoi')

      rolesToTestPermission.forEach(role => {
        // console.log(window)
        // console.log(window.store.state.user.details.lastName)
        // Log with the role to test permission
        cy.log('=============== TEST PERMISSION FOR ROLE ' + role.role + ' =============')
        cy.logout()
        cy.login(url, role)
        cy.get('[data-test=slot-type-item-' + slot.type + ']').click()

        // Open the slot's student list
        utils.openSlotPopup(slotToRegisterInside, '1/2')
        cy.get('[data-test=showStudentList-option]').click()

        // Open the list and unregister student
        cy.get('[data-test=student-list-modal]').within(() => {
          if (haveDeregistrationPermissions[slot.label][role.lastName]) {
            cy.contains(studentToRegister.formattedName).parent().find('[data-test=unregister]').should('be.visible')
          } else {
            cy.contains(studentToRegister.formattedName).parent().find('[data-test=unregister]').should('not.exist')
          }
        })
      })

      // Delete created slot
      cy.logout()
      cy.login(url)
      utils.waitCalendarToLoad()
      cy.get('[data-test=slot-type-item-' + slot.type + ']').click()
      utils.deleteSlot(slotToRegisterInside, '1/2')
    })
  }
  // }
})
