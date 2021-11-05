import { now, slotTypes, url } from '../../support/constants/horairesHorsCadres'
import utils from '../../support/utils/horairesHorsCardesUtils'
import {
  TEACHER,
  TEACHER2,
  CLASSTEACHER,
  SCHOOL_ADMIN,
  DOYEN,
  SECRETARY,
  STUDENT,
  PARENT
} from '../../support/constants'

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
const FIRING_SOURCE_TEACHER = { ...TEACHER2, role: 'Firing source teacher' }

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
    [SECRETARY.lastName]: true,
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

const rolesToHaveDeregistrationMessage = {
  [slotTypes.tutoring.label]: [CLASSTEACHER, DOYEN],
  [slotTypes.fired.label]: [FIRING_SOURCE_TEACHER, CLASSTEACHER, DOYEN],
  [slotTypes.study.label]: [STUDENT, CLASSTEACHER, DOYEN],
  [slotTypes.replayTest.label]: [STUDENT, CLASSTEACHER, DOYEN],
  [slotTypes.detention.label]: [STUDENT, CLASSTEACHER, DOYEN]
}

function getRandomInt (max) {
  return Math.floor(Math.random() * max)
}
const getSlotToNotNotifyParent = () => {
  const eligibleSlots = [2, 3, 4] // Study, ReplayTest and Detention
  const randIndex = getRandomInt(3)
  return eligibleSlots[randIndex]
}

const registerStudent = (haveToSelectCourse, slot, notifyParents = true) => { // Just fill registration modal and submit
  if (haveToSelectCourse) {
    cy.get('.base-dropdown').click().within(() => {
      cy.get('li').first().click()
    })
  }
  if (!notifyParents && slot.label !== 'Renvoi') {
    cy.get('.notify-parents [type="checkbox"]').uncheck()
  }
  cy.get('[data-test=student-registration-modal]').within(() => {
    cy.contains('button', 'Inscrire').click()
  })
  utils.waitCalendarToLoad()
  cy.get('[data-test=student-registration-modal]').should('not.exist')
}

const checkMessage = (unregisterer, slotType) => {
  cy.get('#nav_entry_messagerie').click()
  cy.get('.message-container').first().within(() => { // have to be the last notification
    cy.contains(unregisterer.firstName + ' ' + unregisterer.lastName)
    cy.contains(slotType.label === 'Cercle d\'étude' ? 'Fin du cercle d\'étude' : 'Annulation ')
  })
}

describe('deregistration option', () => {
  beforeEach(() => {
    cy.logout()
    cy.clock(now.toDate().getTime())
    cy.login(url)
  })

  const slotTypeToUncheckParentNotification = getSlotToNotNotifyParent() // For slots that allow us to do that: choose one to uncheck the parent notification on deregistration
  for (const attr in slotTypes) {
    const slot = slotTypes[attr]

    it('is present for good roles in ' + slot.label, () => {
      // Select slot
      cy.get('[data-test=slot-type-item-' + slot.type + ']').click()
      utils.waitCalendarToLoad()

      // Create slot
      utils.createSlot(slotToRegisterInside)

      // Register Student inside
      cy.logout()
      cy.login(url, REGISTERER)
      cy.get('[data-test=slot-type-item-' + slot.type + ']').click()
      utils.selectStudent(studentToRegister)
      utils.openSlotPopup(slotToRegisterInside, '2/2')
      cy.get('[data-test=openRegistration-option]').click()
      const notifyParents = true
      registerStudent(slot.label === 'Travaux à refaire' || slot.label === 'Renvoi', slot, notifyParents)

      rolesToTestPermission.forEach(role => {
        // Log with the role to test permission
        cy.log('=============== TEST PERMISSION FOR ROLE ' + role.role + ' =============')
        cy.logout()
        cy.login(url, role)

        // Justify firing to pass the blocking modal)
        if (slot.label === 'Renvoi' && role.firstName === FIRING_SOURCE_TEACHER.firstName) {
          cy.get('textarea').type('blablabla')
          cy.contains('button', 'Envoyer').click()
        }

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

    it('check notification for slot ' + slot.label, () => {
      // Select slot
      cy.get('[data-test=slot-type-item-' + slot.type + ']').click()
      utils.waitCalendarToLoad()

      // Create slot
      utils.createSlot(slotToRegisterInside)

      // Compute if the slot deregistration will notify parents
      let notifyParents
      if (slot.label === 'Dépannage') {
        notifyParents = true
      } else if (slot.label === 'Renvoi') {
        notifyParents = false
      } else {
        notifyParents = slot.type === slotTypeToUncheckParentNotification
      }

      // Register Student inside
      cy.logout()
      cy.login(url, REGISTERER)
      cy.get('[data-test=slot-type-item-' + slot.type + ']').click()
      utils.selectStudent(studentToRegister)
      utils.openSlotPopup(slotToRegisterInside, '2/2')
      cy.get('[data-test=openRegistration-option]').click()
      registerStudent(slot.label === 'Travaux à refaire' || slot.label === 'Renvoi', slot, notifyParents)

      // Deregister student
      if (slot.label === 'Renvoi') {
        cy.logout()
        cy.login(url, SCHOOL_ADMIN) // REGISTERER cannot unregister firings
        cy.get('[data-test=slot-type-item-' + slot.type + ']').click()
      }
      utils.openSlotPopup(slotToRegisterInside, '1/2')
      cy.get('[data-test=showStudentList-option]').click()
      cy.get('[data-test=student-list-modal]').within(() => {
        cy.contains(studentToRegister.formattedName).parent().find('[data-test=unregister]').click()
      })
      cy.get('[data-test=student-registration-modal]').within(() => {
        cy.contains('Désinscrire').click()
      })

      // Check notification messages
      rolesToHaveDeregistrationMessage[slot.label].forEach(role => {
        cy.log('=============== TEST NOTIFICATION FOR ROLE ' + role.role + ' =============')
        cy.logout()
        cy.login('/', role)
        checkMessage(slot.label === 'Renvoi' ? SCHOOL_ADMIN : REGISTERER, slot)
      })
      if (notifyParents) {
        cy.log('=============== TEST NOTIFICATION FOR ROLE PARENT =============')
        cy.logout()
        cy.login('/', PARENT)
        checkMessage(slot.label === 'Renvoi' ? SCHOOL_ADMIN : REGISTERER, slot)
      }

      // Delete created slot
      cy.logout()
      cy.login(url)
      utils.waitCalendarToLoad()
      cy.get('[data-test=slot-type-item-' + slot.type + ']').click()
      utils.deleteSlot(slotToRegisterInside, '2/2')
    })
  }
})
