import { HHCURL } from '../../support/constants/urls'
import {
  CLASSTEACHER,
  DEPANNAGE_SUPERVISOR,
  DOYEN,
  HEADMASTER,
  SCHOOL_ADMIN,
  SECRETARY,
  STUDENT,
  TEACHER
} from '../../support/constants/users'
import { getSlot, waitCalendarToLoad } from '../../support/utils/horairesHorsCardesUtils'

// const slotToRegisterInside = {
//   day: 'wed',
//   date: now,
//   startHour: '12:00',
//   endHour: '13:00',
//   teacherSearch: 'reg',
//   teacherName: 'Regad Alexandre',
//   teacherLastName: 'Regad',
//   roomNumber: 'tg',
//   capacity: 2
// }

const formatStudentNameLikeInStudentListModal = (student) => {
  return student.firstName + ' ' + student.lastName
}

const REGISTERED_STUDENT = STUDENT // Like this in database
const REGISTERER = (slotType) => {
  return slotType === 'tutoring' ? { ...DEPANNAGE_SUPERVISOR, role: 'Registerer' } : { ...HEADMASTER, role: 'Registerer' }
}
const rolesToTestPermission = (slotType) => { return [REGISTERER(slotType), TEACHER, CLASSTEACHER, SCHOOL_ADMIN, DOYEN, SECRETARY] }

const haveDeregistrationPermissions = {
  tutoring: {
    [REGISTERER.lastName]: true,
    [TEACHER.lastName]: false,
    [CLASSTEACHER.lastName]: false,
    [DOYEN.lastName]: false,
    [SECRETARY.lastName]: false,
    [SCHOOL_ADMIN.lastName]: false
  },
  fired: {
    [REGISTERER.lastName]: false,
    [TEACHER.lastName]: false,
    [CLASSTEACHER.lastName]: false,
    [DOYEN.lastName]: true,
    [SECRETARY.lastName]: true,
    [SCHOOL_ADMIN.lastName]: true
  },
  study: {
    [REGISTERER.lastName]: true,
    [TEACHER.lastName]: true,
    [CLASSTEACHER.lastName]: true,
    [DOYEN.lastName]: true,
    [SECRETARY.lastName]: true,
    [SCHOOL_ADMIN.lastName]: true
  },
  replayTest: {
    [REGISTERER.lastName]: true,
    [TEACHER.lastName]: false,
    [CLASSTEACHER.lastName]: false,
    [DOYEN.lastName]: true,
    [SECRETARY.lastName]: true,
    [SCHOOL_ADMIN.lastName]: true
  },
  detention: {
    [REGISTERER.lastName]: true,
    [TEACHER.lastName]: false,
    [CLASSTEACHER.lastName]: false,
    [DOYEN.lastName]: true,
    [SECRETARY.lastName]: true,
    [SCHOOL_ADMIN.lastName]: true
  }
}

// const rolesToHaveDeregistrationMessage = {
//   [slotTypes.tutoring.label]: [CLASSTEACHER, DOYEN],
//   [slotTypes.fired.label]: [FIRING_SOURCE_TEACHER, CLASSTEACHER, DOYEN],
//   [slotTypes.study.label]: [STUDENT, CLASSTEACHER, DOYEN],
//   [slotTypes.replayTest.label]: [STUDENT, CLASSTEACHER, DOYEN],
//   [slotTypes.detention.label]: [STUDENT, CLASSTEACHER, DOYEN]
// }

// function getRandomInt (max) {
//   return Math.floor(Math.random() * max)
// }
// const getSlotToNotNotifyParent = (slotTypes) => {
//   const eligibleSlots = [1, 2, 3] // Study, ReplayTest and Detention
//   const randIndex = eligibleSlots[getRandomInt(3)]
//   const randomSlotKey = Object.keys(slotTypes)[eligibleSlots[randIndex]]
//   return slotTypes[randomSlotKey]
// }

// const registerStudent = (haveToSelectCourse, slot, notifyParents = true) => { // Just fill registration modal and submit
//   if (haveToSelectCourse) {
//     cy.get('.base-dropdown').click().within(() => {
//       cy.get('li').first().click()
//     })
//   }
//   if (!notifyParents && slot.label !== 'Renvoi') {
//     cy.get('.notify-parents [type="checkbox"]').uncheck()
//   }
//   cy.get('[data-test=student-registration-modal]').within(() => {
//     cy.contains('button', 'Inscrire').click()
//   })
//   waitCalendarToLoad()
//   cy.get('[data-test=student-registration-modal]').should('not.exist')
// }

// const checkMessage = (unregisterer, slotType) => {
//   cy.get('#nav_entry_messagerie').click()
//   cy.get('.message-container').first().within(() => { // have to be the last notification
//     cy.contains(unregisterer.firstName + ' ' + unregisterer.lastName)
//     cy.contains(slotType.label === 'Cercle d\'étude' ? 'Fin du cercle d\'étude' : 'Annulation ')
//   })
// }

describe('deregistration option', () => {
  beforeEach(() => {
    cy.fixture('hhc.json').as('hhcData').then(data => {
      cy.clock(Cypress.dayjs(data.now, 'YYYY/MM/DD HH:mm').toDate().getTime())
    })
    cy.loadTables('schoollife/schoollife_tables.sql')
  })

  it.only('is present for good roles ', function () {
    const slotTypes = this.hhcData.slotsTypes
    for (const attr in slotTypes) {
      const slotType = slotTypes[attr]
      cy.log('select ' + slotType.label)

      rolesToTestPermission(slotType).forEach(role => {
        // Log with the role to test permission
        cy.log('=============== TEST PERMISSION FOR ROLE ' + role.role + ' =============')
        cy.login(role, HHCURL)

        // Select slot
        cy.get('[data-test=slot-type-item-' + slotType.type + ']').click()
        waitCalendarToLoad()

        cy.get('[data-test=slot-type-item-' + slotType.type + ']', { timeout: 6000 }).click()
        getSlot(slotType.slotExample).click()
        cy.get('[data-test=showStudentList-option]').click({ force: true }) // Because sometimes calendars is slow to render and element can pop everywhere

        // Open the list and unregister student
        cy.get('[data-test=student-list-modal]').within(() => {
          cy.log(attr + ' ' + role.lastName + ' ' + REGISTERER(slotType).lastName)
          if (haveDeregistrationPermissions[attr][role.lastName]) {
            cy.contains('[data-test=student-list-item]', formatStudentNameLikeInStudentListModal(REGISTERED_STUDENT))
              .find('[data-test=unregister]').should('be.visible')
          } else {
            cy.contains('[data-test=student-list-item]', formatStudentNameLikeInStudentListModal(REGISTERED_STUDENT))
              .find('[data-test=unregister]').should('not.exist')
          }

          cy.get('[data-test=closeModal]').click()
        })
      })
    }
  })

  it('Deregister student ', function () {
    const slotTypes = this.hhcData.slotsTypes
    for (const attr in slotTypes) {
      const slotType = slotTypes[attr]
      const unregisterRole = getRoleThatCanUnregisterSlot(slotType)
      const slotToUnregister = slotType.slotExample

      // Unregister student
      cy.log('Unregiter student from slottype ' + slotType)
      cy.log(unregisterRole, HHCURL)
      openStudentListModal(slotToUnregister).within(() => {
        cy.contains('[data-test=student-list-item]', formatStudentNameLikeInStudentListModal(REGISTERED_STUDENT))
          .find('[data-test=unregister]').click()
      })
      cy.get('[data-test=student-registration-modal]')
        .contains('button', 'Désinscrire').click()

      // Check deregistration
      cy.log('Check the deregistration have worked')
      cy.get('[data-test=student-registration-modal]').should('not.exist')
      cy.get('[data-test=student-list-modal]').within(() => {
        cy.contains('[data-test=student-list-item]', formatStudentNameLikeInStudentListModal(REGISTERED_STUDENT)).should('not.exist')
      })
      // TODO: Check edt and notif
    }
  })

  // it('check notification for slot ' + slot.label, () => {
  //   // Select slot
  //   cy.get('[data-test=slot-type-item-' + slot.type + ']').click()
  //   utils.waitCalendarToLoad()
  //
  //   // Create slot
  //   utils.createSlot(slotToRegisterInside)
  //
  //   // Compute if the slot deregistration will notify parents
  //   let notifyParents
  //   if (slot.label === 'Dépannage') {
  //     notifyParents = true
  //   } else if (slot.label === 'Renvoi') {
  //     notifyParents = false
  //   } else {
  //     notifyParents = slot.type === slotTypeToUncheckParentNotification
  //   }
  //
  //   // Register Student inside
  //   cy.logout()
  //   cy.login(url, REGISTERER)
  //   cy.get('[data-test=slot-type-item-' + slot.type + ']').click()
  //   utils.selectStudent(studentToRegister)
  //   utils.openSlotPopup(slotToRegisterInside, '2/2')
  //   cy.get('[data-test=openRegistration-option]').click()
  //   registerStudent(slot.label === 'Travaux à refaire' || slot.label === 'Renvoi', slot, notifyParents)
  //
  //   // Deregister student
  //   if (slot.label === 'Renvoi') {
  //     cy.logout()
  //     cy.login(url, SCHOOL_ADMIN) // REGISTERER cannot unregister firings
  //     cy.get('[data-test=slot-type-item-' + slot.type + ']').click()
  //   }
  //   utils.openSlotPopup(slotToRegisterInside, '1/2')
  //   cy.get('[data-test=showStudentList-option]').click()
  //   cy.get('[data-test=student-list-modal]').within(() => {
  //     cy.contains(studentToRegister.formattedName).parent().find('[data-test=unregister]').click()
  //   })
  //   cy.get('[data-test=student-registration-modal]').within(() => {
  //     cy.contains('Désinscrire').click()
  //   })
  //
  //   // Check notification messages
  //   rolesToHaveDeregistrationMessage[slot.label].forEach(role => {
  //     cy.log('=============== TEST NOTIFICATION FOR ROLE ' + role.role + ' =============')
  //     cy.logout()
  //     cy.login('/', role)
  //     checkMessage(slot.label === 'Renvoi' ? SCHOOL_ADMIN : REGISTERER, slot)
  //   })
  //   if (notifyParents) {
  //     cy.log('=============== TEST NOTIFICATION FOR ROLE PARENT =============')
  //     cy.logout()
  //     cy.login('/', PARENT)
  //     checkMessage(slot.label === 'Renvoi' ? SCHOOL_ADMIN : REGISTERER, slot)
  //   }
  //
  //   // Delete created slot
  //   cy.logout()
  //   cy.login(url)
  //   utils.waitCalendarToLoad()
  //   cy.get('[data-test=slot-type-item-' + slot.type + ']').click()
  //   utils.deleteSlot(slotToRegisterInside, '2/2')
  // })
})
