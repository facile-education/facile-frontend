import { now, url } from '../../../support/constants/progression'

describe('Session affectation', () => {
  beforeEach(() => {
    cy.clock(now.toDate().getTime())

    cy.exec('npm run db:loadTables progression_tables.sql')
    cy.clearDBCache()
    cy.login(url + '/15401321')
  })

  it('Test to affect a session in a course', () => {
    // Affect many session in a course (and check in cours et devoirs)

    // Try to do affect a session in an already affected course (expected to fail because of previous session)

    // Modify the affectation (and check in cours et devoirs)

    // Delete the affectation (and check in cours et devoirs)
  })

  it('Once the affectation is done, the progression modification doesn\'t affect the affectation', () => {
    // Affect a session to a course

    // Modify the session

    // the course content should not have been modified

    // Delete session/section

    // the course content should not have been modified

    // delete an attached file
  })

  it('Specific content for affectation', () => {

  })
})
