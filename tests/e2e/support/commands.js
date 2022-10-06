// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import { GLOBAL_ADMIN, HEADMASTER as defaultUser } from '../support/constants'
import constants from '../../../src/constants/appConstants'

Cypress.Commands.add('clearDBCache', () => {
  // Login as global admin to execute request to clear DB cache
  cy.clearCookies()

  cy.visit('/') // mandatory to access control panel by UI

  // Login
  const loginParams = {
    _58_login: GLOBAL_ADMIN.login,
    _58_password: GLOBAL_ADMIN.password,
    p_auth: ''
  }

  const loginUrl = Cypress.config().baseUrl + '/web/guest/home?' +
    'p_p_id=58' +
    '&p_p_lifecycle=1&' +
    'p_p_state=normal&' +
    'p_p_mode=view&' +
    'saveLastPath=0&' +
    '_58_struts_action=/login/login'

  cy.request({
    method: 'POST',
    url: loginUrl,
    form: true,
    body: loginParams
  }).then((response) => {
    expect(response.status).to.eq(200) // to test here or not?
  })

  // Manual UI method => TODO: To remove in favor of request method (see above)
  cy.visit('/group/control_panel/manage/')
  cy.contains('Administration du serveur').click()
  cy.get(':nth-child(4) > :nth-child(2) > input').click()

  // // Do request
  // const url = Cypress.config().baseUrl + '/group/control_panel/manage/-/server/resources?' +
  //   'doAsGroupId=11107' +
  //   '&refererPlid=315105&_137_cur=0' +
  //   '&_137_delta=0'
  //
  // const params = {
  //   _137_formDate: Date.now(),
  //   _137_cmd: 'cacheDb',
  //   _137_tabs1: 'server',
  //   _137_tabs2: 'resources',
  //   _137_tabs3: '',
  //   _137_redirect: '',
  //   _137_portletId: '',
  //   _137_tabs2TabsScroll: ''
  // }
  //
  // cy.request({
  //   method: 'POST',
  //   url: url,
  //   form: true,
  //   body: params
  // }).then((response) => {
  //   expect(response.status).to.be.oneOf([200, 304])
  //   console.log(response)
  // })
  //
  // // // Test the 2nd call
  // // cy.request({
  // //   method: 'GET',
  // //   url: Cypress.config().baseUrl + '/group/control_panel/manage/-/server/resources?doAsGroupId=11107&refererPlid=315105&_137_cur=0&_137_delta=0'
  // // }).then((response) => {
  // //   expect(response.status).to.be.oneOf([200, 304])
  // //   console.log(response)
  // // })
})

Cypress.Commands.add('login', (visitUrl = '/', user = defaultUser) => {
  cy.log('===== LOG IN (' + user.login + ') =====')

  // To always have the same setup
  cy.clearCookies()

  cy.visit('/')

  const params = {
    _58_login: user.login,
    _58_password: user.password,
    p_auth: ''
  }

  const loginUrl = Cypress.config().baseUrl + '/web/guest/home?' +
    'p_p_id=58' +
    '&p_p_lifecycle=1&' +
    'p_p_state=normal&' +
    'p_p_mode=view&' +
    'saveLastPath=0&' +
    '_58_struts_action=/login/login'

  cy.request({
    method: 'POST',
    url: loginUrl,
    form: true,
    body: params
  }).then((response) => {
    expect(response.status).to.eq(200) // to test here or not?
  })

  cy.visit(visitUrl)
  if (visitUrl === '/') {
    cy.url().should('contain', Cypress.config().baseUrl + visitUrl) // because of the '/tableau-de-board' redirection
  } else {
    cy.url().should('eq', Cypress.config().baseUrl + visitUrl)
  }
  cy.wait(1000) // to be sure
})

Cypress.Commands.add('logout', () => {
  cy.log('===== LOG OUT =====')

  // cy.visit(Cypress.config().baseUrl + '/c/portal/logout')
  cy.clearCookies()
})

Cypress.Commands.add('globalKeyPress', (keyName) => {
  cy.get('body').type(keyName)
})

Cypress.Commands.add('doAuthWSRequest', (method, url, params) => {
  // cy.getCookie('pauth').then((pauth) => {
  cy.request({
    method: method,
    url: constants.JSON_WS_URL + url/* + '?p_auth=' + pauth.value */,
    form: method === 'POST',
    body: params
  }).then((response) => {
    expect(response.status).to.be.oneOf([200, 304]) // to test here or not?
    return response
  })
  // })
})
