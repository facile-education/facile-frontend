import { url } from '../../support/constants/groups'
import { HEADMASTER, CLASSTEACHER, STUDENT, PARENT, SECRETARY } from '../../support/constants'

const rolesList = [
  {
    ...HEADMASTER,
    canCreateGroup: true,
    canUpdateGroup: true,
    canDeleteGroup: true,
    hasCourses: true,
    hasPersonal: true,
    hasSchool: true,
    hasClass: true,
    hasDiscipline: true,
    hasAllClasses: true,
    hasAllDisciplines: false,
    hasAllPersonal: true
  },
  {
    ...CLASSTEACHER,
    canCreateGroup: true,
    canUpdateGroup: undefined, // Note that 'false' can means N/A in the spec
    canDeleteGroup: undefined,
    hasCourses: true,
    hasPersonal: true,
    hasSchool: true,
    hasClass: true,
    hasDiscipline: true,
    hasAllClasses: false,
    hasAllDisciplines: false,
    hasAllPersonal: false
  },
  {
    ...STUDENT,
    canCreateGroup: false,
    canUpdateGroup: false,
    canDeleteGroup: false,
    hasCourses: true,
    hasPersonal: true,
    hasSchool: true,
    hasClass: true,
    hasDiscipline: false,
    hasAllClasses: false,
    hasAllDisciplines: false,
    hasAllPersonal: false
  },
  {
    ...PARENT,
    canCreateGroup: false,
    canUpdateGroup: false,
    canDeleteGroup: false,
    hasCourses: false,
    hasPersonal: true,
    hasSchool: true,
    hasClass: false,
    hasDiscipline: false,
    hasAllClasses: false,
    hasAllDisciplines: false,
    hasAllPersonal: false
  },
  {
    ...SECRETARY,
    canCreateGroup: true,
    canUpdateGroup: undefined,
    canDeleteGroup: undefined,
    hasCourses: false,
    hasPersonal: true,
    hasSchool: true,
    hasClass: true,
    hasDiscipline: true,
    hasAllClasses: true,
    hasAllDisciplines: false,
    hasAllPersonal: false
  }
]

describe('Permission matrix', () => {
  // before(() => {
  //   cy.exec('npm run db:loadTables groups_tables_basic.sql')
  //   cy.clearDBCache()
  // })

  rolesList.forEach((role) => {
    it('Test ' + role.role + ' permissions', () => {
      cy.login(url, role)

      // Group creation
      if (role.canCreateGroup) {
        cy.get('[data-test=createGroupButton]').should('exist')
      } else if (role.canCreateGroup !== undefined) {
        cy.get('[data-test=createGroupButton]').should('not.exist')
      }

      cy.contains('[data-test=group-item]', 'groupTest').within(() => {
        // Group modification
        if (role.canUpdateGroup) {
          cy.get('[data-test=edit-group-icon]').should('exist')
        } else if (role.canUpdateGroup !== undefined) {
          cy.get('[data-test=edit-group-icon]').should('not.exist')
        }

        // Group deletion
        if (role.canDeleteGroup) {
          cy.get('[data-test=delete-group-icon]').should('exist')
        } else if (role.canDeleteGroup !== undefined) {
          cy.get('[data-test=delete-group-icon]').should('not.exist')
        }
      })

      // Group visibility // TODO match with good groups
      if (role.hasCourses) {
        cy.contains('[data-test=group-item]', 'groupTest').should('exist')
      }

      if (role.hasPersonal) {
        cy.contains('[data-test=group-item]', 'groupTest').should('exist')
      }

      if (role.hasSchool) {
        cy.contains('[data-test=group-item]', 'CO de Bude').should('exist')
      }

      if (role.hasClass) {
        cy.contains('[data-test=group-item]', 'groupTest').should('exist')
      }

      if (role.hasDiscipline) {
        cy.contains('[data-test=group-item]', 'groupTest').should('exist')
      }

      if (role.hasAllClasses) {
        cy.contains('[data-test=group-item]', 'groupTest').should('exist')
      }

      if (role.hasAllDisciplines) {
        cy.contains('[data-test=group-item]', 'groupTest').should('exist')
      }

      if (role.hasAllPersonal) {
        cy.contains('[data-test=group-item]', 'groupTest').should('exist')
      }
    })
  })
})
