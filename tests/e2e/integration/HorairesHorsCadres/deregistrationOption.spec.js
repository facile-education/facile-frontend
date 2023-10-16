import { HHCURL, messagingURL } from '../../support/constants/urls'
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
import {
  getSlot, getUserSlot,
  openStudentListModal, selectSlotType,
  selectStudent,
  waitCalendarToLoad
} from '../../support/utils/horairesHorsCardesUtils'
import { getThread, waitMessagingToBeLoaded } from '../../support/utils/messagingUtils'

const expectedDeregistrationThread = (slotType, slot, student, deregisterer) => {
  const prefix = slotType.type === 5 ? 'Fin du ' : 'Annulation ' + (slotType.type === 1 ? 'de ' : '')
  const slotLabel = slotType.type === 3 ? 'travail à refaire en Allemand' : slotType.label.toLowerCase()

  return [{
    sender: deregisterer.firstName + ' ' + deregisterer.lastName,
    recipients: [student.firstName + ' ' + student.lastName],
    date: '',
    subject: prefix + slotLabel + (slotType.type === 1 ? ' : ' + formatStudentName(student) : '') + (slotType.type === 2 ? ' du ' : ' le ') + Cypress.dayjs(slot.startDate, 'YYYY/MM/DD HH:mm').format('dddd [à] H[h]mm'),
    content: 'TODO', // TODO test all contents
    messageIndexInThread: 0
  }]
}

const formatStudentName = (student) => {
  return student.firstName + ' ' + student.lastName
}

const REGISTERED_STUDENT = STUDENT // Like this in database
const REGISTERER = (slotType) => {
  return slotType === 'tutoring' ? { ...DEPANNAGE_SUPERVISOR, role: 'Registerer' } : { ...HEADMASTER, role: 'Registerer' }
}
const rolesToTestPermission = (slotType) => { return [REGISTERER(slotType), TEACHER, CLASSTEACHER, SCHOOL_ADMIN, DOYEN, SECRETARY] }

const rolesToBeNotifiedOfDeregistration = { // if differents than the unregisterer + add parents if option is checked
  tutoring: [
    CLASSTEACHER,
    DOYEN
  ],
  fired: [
    // TODO: maitres et co-enseignants du cours qui as renvoyé
    CLASSTEACHER,
    DOYEN
  ],
  study: [
    STUDENT,
    CLASSTEACHER,
    DOYEN
  ],
  replayTest: [
    STUDENT,
    CLASSTEACHER,
    DOYEN
  ],
  detention: [
    STUDENT,
    CLASSTEACHER,
    DOYEN
  ]
}

const haveDeregistrationPermissions = {
  tutoring: {
    [REGISTERER('tutoring').lastName]: true,
    [TEACHER.lastName]: false,
    [CLASSTEACHER.lastName]: false,
    [DOYEN.lastName]: false,
    [SECRETARY.lastName]: false,
    [SCHOOL_ADMIN.lastName]: false
  },
  fired: {
    [REGISTERER('fired').lastName]: false,
    [TEACHER.lastName]: false,
    [CLASSTEACHER.lastName]: false,
    [DOYEN.lastName]: true,
    [SECRETARY.lastName]: true,
    [SCHOOL_ADMIN.lastName]: true
  },
  study: {
    [REGISTERER('study').lastName]: true,
    [TEACHER.lastName]: true,
    [CLASSTEACHER.lastName]: true,
    [DOYEN.lastName]: true,
    [SECRETARY.lastName]: true,
    [SCHOOL_ADMIN.lastName]: true
  },
  replayTest: {
    [REGISTERER('replayTest').lastName]: true,
    [TEACHER.lastName]: false,
    [CLASSTEACHER.lastName]: false,
    [DOYEN.lastName]: true,
    [SECRETARY.lastName]: true,
    [SCHOOL_ADMIN.lastName]: true
  },
  detention: {
    [REGISTERER('detention').lastName]: true,
    [TEACHER.lastName]: false,
    [CLASSTEACHER.lastName]: false,
    [DOYEN.lastName]: true,
    [SECRETARY.lastName]: true,
    [SCHOOL_ADMIN.lastName]: true
  }
}

describe('deregistration option', () => {
  beforeEach(() => {
    cy.fixture('hhc.json').as('hhcData').then(data => {
      cy.clock(Cypress.dayjs(data.now, 'YYYY/MM/DD HH:mm').toDate().getTime())
    })
    cy.loadTables('schoollife/schoollife_tables.sql')
  })

  it('is present for good roles ', function () {
    const slotTypes = this.hhcData.slotsTypes
    let hasSetFiringReason = false
    for (const attr in slotTypes) {
      const slotType = slotTypes[attr]
      cy.log('select ' + slotType.label)

      rolesToTestPermission(slotType).forEach(role => {
        // Log with the role to test permission
        cy.log('=============== TEST PERMISSION FOR ROLE ' + role.role + ' =============')
        cy.login(role, HHCURL)

        // Select slot
        selectSlotType(slotType)
        waitCalendarToLoad()

        if (!hasSetFiringReason && role === TEACHER) { // close pending firing modal
          cy.get('[data-test=pending-firing-modal]').within(() => {
            cy.get('textarea').type('j\'ai mes raisons')
            cy.contains('Envoyer').click()
          })
          hasSetFiringReason = true
        }

        selectSlotType(slotType)
        getSlot(slotType.slotExample).click()
        cy.get('[data-test=showStudentList-option]').click({ force: true }) // Because sometimes calendars is slow to render and element can pop everywhere

        // Open the list and unregister student
        cy.get('[data-test=student-list-modal]').within(() => {
          cy.log(attr + ' ' + role.lastName + ' ' + REGISTERER(attr).lastName)
          if (haveDeregistrationPermissions[attr][role.lastName]) {
            cy.contains('[data-test=student-list-item]', formatStudentName(REGISTERED_STUDENT))
              .find('[data-test=unregister]').should('be.visible')
          } else {
            cy.contains('[data-test=student-list-item]', formatStudentName(REGISTERED_STUDENT))
              .find('[data-test=unregister]').should('not.exist')
          }

          cy.get('[data-test=closeModal]').click()
        })
      })
    }
  })

  it('Deregister student ', function () {
    cy.loadTables('messaging/messaging_tables_empty.sql') // to empty

    const slotTypes = this.hhcData.slotsTypes
    for (const attr in slotTypes) {
      const slotType = slotTypes[attr]
      const unregisterRole = REGISTERER(attr) // Generally, (registerer can deregister)
      const slotToUnregister = slotType.slotExample

      cy.log('test derigistration on ' + slotType + ' with deregiterer ' + unregisterRole.lastName)
      cy.login(unregisterRole, HHCURL)

      // Select slot
      selectSlotType(slotType)
      waitCalendarToLoad()

      // Unregister student
      cy.log('Unregiter student from slottype ' + slotType)
      cy.log(unregisterRole, HHCURL)
      openStudentListModal(slotToUnregister).within(() => {
        cy.contains('[data-test=student-list-item]', formatStudentName(REGISTERED_STUDENT))
          .find('[data-test=unregister]').click()
      })
      cy.get('[data-test=student-registration-modal]')
        .contains('button', 'Désinscrire').click()

      // Check deregistration
      cy.log('Check the deregistration have worked')
      cy.get('[data-test=student-registration-modal]').should('not.exist')
      cy.get('[data-test=student-list-modal]').within(() => {
        cy.contains('[data-test=student-list-item]', formatStudentName(REGISTERED_STUDENT)).should('not.exist')
        cy.get('[data-test="closeModal"]').click()
      })
      selectStudent(REGISTERED_STUDENT)
      getUserSlot(slotToUnregister).should('not.exist')

      // Check deregistration notification
      rolesToBeNotifiedOfDeregistration[attr].forEach((role) => {
        if (role !== unregisterRole) { // registerer do not have notification
          cy.login(role, messagingURL)
          const expectedThread = expectedDeregistrationThread(slotType, slotToUnregister, REGISTERED_STUDENT, unregisterRole)
          waitMessagingToBeLoaded()
          getThread(expectedThread).click()
          // getMessage(expectedThred[0]).should('exist') // TODO: Check message content
        }
      })
    }
  })
})
