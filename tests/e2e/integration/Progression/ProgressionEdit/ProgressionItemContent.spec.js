import { now, url } from '../../../support/constants/progression'

describe('Progression item contents', () => {
  beforeEach(() => {
    cy.clock(now.toDate().getTime())

    cy.exec('npm run db:loadTables progression_tables.sql')
    cy.clearDBCache()
    cy.login(url)
  })

  it('Text', () => {
    // Add text bloc

    // Update text bloc

    // Delete text bloc

  })

  it('Audio', () => {
    // Add Audio bloc

    // Update Audio bloc

    // Delete Audio bloc

  })

  it('Link', () => {
    // Add Link bloc (test form validation if we have time)

    // Update Link bloc

    // Delete Link bloc

  })

  it('Video', () => {
    // Add Video bloc (test form validation if we have time)

    // Update Video bloc

    // Delete Video bloc

  })

  it('File', () => {
    // Add File bloc  => call ws uploadFile() with js file In parameters (and get the file from fixture, see upload tests in monDrive...), then, select the uploaded file from the modal from "Personnels"

    // Update File bloc -> not available atm, test download file instead

    // Delete File bloc

  })

  it('H5p', () => {
    // Add Audio bloc (test form validation if we have time)

    // Update Audio bloc

    // Delete Audio bloc

  })
})

describe('Progression item contents computed view', () => {
  beforeEach(() => {
    cy.clock(now.toDate().getTime())

    cy.exec('npm run db:loadTables progression_tables.sql')
    cy.clearDBCache()
    cy.login(url)
  })

  it('display correctly', () => {
    // Test if all elements are presents
  })
})
