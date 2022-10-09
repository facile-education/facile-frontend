import { url } from '../../support/constants/documents'
import { HEADMASTER } from '../../support/constants'

describe('Deletion', () => {
  beforeEach(() => {
    cy.login(url, HEADMASTER)
  })

  it('Delete folder', () => {
    cy.reload()
  })
})
