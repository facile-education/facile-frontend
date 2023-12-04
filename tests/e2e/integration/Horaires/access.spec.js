// https://docs.cypress.io/api/introduction/api.html

const toolbarManagerUsers = [HEADMASTER, DOYEN, SECRETARY]
const toolbarUsers = [TEACHER]
const noToolbarUsers = [STUDENT, PARENT]

const waitForRefresh = () => {
  cy.wait(500)
}

describe.skip('Schedule_Access', () => {
  beforeEach(() => {
    cy.clock(now.toDate().getTime())
    cy.exec('npm run db:loadTables cdt_tables.sql')
    cy.clearDBCache()
    cy.logout()
  })

  toolbarManagerUsers.forEach(user => {
    it('Schedule_Access_' + user.role + '_CanAccess', () => {
      cy.login(url, user)

      cy.get('.toolbar .base-dropdown').should('be.visible')
      cy.get('.toolbar .search').should('be.visible')
      cy.get('.weekly-horizontal-timeline').should('be.visible')
      cy.get('.fc').should('be.visible')

      // Select group in the list
      cy.get('.toolbar .base-dropdown').click()
      cy.get('.base-dropdown > .base-autocomplete').should('be.visible')

      cy.contains(groupName).click()
      waitForRefresh()

      // Edit button should be visible
      cy.get('[data-cy="05-03_08:45"]').should('exist')
      cy.get('[data-cy="05-03_08:45"]').trigger('mouseover')
      cy.get('[data-cy="05-03_08:45"] .fa-pencil-alt').should('exist')
    })
  })

  toolbarUsers.forEach(user => {
    it('Schedule_Access_' + user.role + '_CanAccess', () => {
      cy.login(url, user)

      cy.get('.toolbar .base-dropdown').should('be.visible')
      cy.get('.toolbar .search').should('be.visible')
      cy.get('.weekly-horizontal-timeline').should('be.visible')
      cy.get('.fc').should('be.visible')

      // Select group in the list
      cy.get('.toolbar .base-dropdown').click()
      cy.get('.base-dropdown > .base-autocomplete').should('be.visible')

      cy.contains(groupName).click()
      waitForRefresh()

      // Edit button should not be visible
      cy.get('[data-cy="05-03_08:45"]').should('exist')
      cy.get('[data-cy="05-03_08:45"]').trigger('mouseover')
      cy.get('[data-cy="05-03_08:45"] .fa-pencil-alt').should('not.exist')
    })
  })

  noToolbarUsers.forEach(user => {
    it('Schedule_Access_' + user.role + '_CanNotAccess', () => {
      cy.login(url, user)

      cy.get('.toolbar .base-dropdown').should('not.exist')
      cy.get('.toolbar .search').should('not.exist')
      cy.get('.weekly-horizontal-timeline').should('be.visible')
      cy.get('.fc').should('be.visible')

      // Edit button should not be visible
      cy.get('[data-cy="05-03_08:45"]').should('exist')
      cy.get('[data-cy="05-03_08:45"]').trigger('mouseover')
      cy.get('[data-cy="05-03_08:45"] .fa-pencil-alt').should('not.exist')
    })
  })

  it('Schedule_Access_Unauthenticated_CanNotAccess', () => {
    cy.visit(url)

    cy.get('.toolbar .base-dropdown').should('not.exist')
    cy.get('.toolbar .search').should('not.exist')
    cy.get('.weekly-horizontal-timeline').should('not.exist')
    cy.get('.fc').should('not.exist')
    cy.contains('Une authentification est requise pour accéder au service.').should('exist')
  })
})
