import { now, url } from '../../../support/constants/progression'
import { GLOBAL_ADMIN } from '../../../support/constants'

describe('Drag & drop', () => { // See D&D tests in MonDrive to see how to trigger D&D event on cypress
  beforeEach(() => {
    cy.logout()
    cy.clock(now.toDate().getTime())
    cy.login('/', GLOBAL_ADMIN)

    cy.exec('npm run db:progressionReset')
    cy.clearDBCache()

    cy.login(url)
  })

  it('Item content on item content', () => {
    cy.log('test')
    // (déplacement de l'objet à l'endroit du marqueur) / drop ne fonctionne pas sur le contenu d'un Autre item
  })

  // Menu D&D
  it('Item on section', () => {
    cy.log('test')
    // (ajout à la fin de la section)
  })

  it('Item on sub-section', () => {
    cy.log('test')
    // (ajout à la fin de la sous- section)
  })

  it('Item on Item', () => {
    cy.log('test')
    // (ajout à l'endroit du marqueur)
  })

  it('subSection on Section', () => {
    cy.log('test')
    // (Ajout à la fin des sous-sections de la section)
  })

  it('subSection on subSection', () => {
    cy.log('test')
    //  (ajout à l'endroit du marqueur)
  })

  it('Section on Section', () => {
    cy.log('test')
    //  (ajout à l'endroit du marqueur)
  })
})
