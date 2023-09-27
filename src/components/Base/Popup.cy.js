import Popup from './Popup.vue'

describe('<Popup />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(Popup, {
      propsData: {
        message: 'Mon titre personnalisé',
        timeout: 2000,
        type: 'success'
      }
    })

    cy.contains('Mon titre personnalisé').should('exist')
    cy.get('.popup')
      .should('have.css', 'background-color')
      .and('equal', 'rgb(144, 200, 100)')
    cy.wait(2500)
  })
})
