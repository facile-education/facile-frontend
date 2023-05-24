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
  cy.log('===== clearDBCache =====')

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
  // const url = Cypress.config().baseUrl + 'https://dev-ent-gve.com/group/control_panel/manage?' +
  // 'p_p_id=com_liferay_server_admin_web_portlet_ServerAdminPortlet&' +
  // 'p_p_lifecycle=1&' +
  // 'p_p_state=maximized&' +
  // 'p_p_mode=view&' +
  // '_com_liferay_server_admin_web_portlet_ServerAdminPortlet_javax.portlet.action=%2Fserver_admin%2Fedit_server'
  //
  // const params = {
  //   _com_liferay_server_admin_web_portlet_ServerAdminPortlet_formDate: Date.now(),
  //   _com_liferay_server_admin_web_portlet_ServerAdminPortlet_cmd: 'cacheSingle',
  //   _com_liferay_server_admin_web_portlet_ServerAdminPortlet_tabs1: 'resources',
  //   _com_liferay_server_admin_web_portlet_ServerAdminPortlet_redirect: '',
  //   p_auth: '',
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

  cy.setCookie('COOKIE_SUPPORT', 'true')

  // UI method
  cy.visit('/nero/')
  cy.get('[placeholder="Identifiant"]').type(user.login)
  cy.get('[placeholder="Mot de passe"]').type(user.password)
  cy.get('form > .btn').click()

  cy.visit(visitUrl)
  if (visitUrl === '/') {
    cy.url().should('contain', Cypress.config().baseUrl + visitUrl) // because of the '/tableau-de-board' redirection
  } else {
    cy.url().should('eq', Cypress.config().baseUrl + visitUrl)
  }

  // Request method (works only if there is no redirection on login request that ends in 404)
  // // Get p_auth
  // cy.request({
  //   method: 'GET',
  //   url: Cypress.config().baseUrl + '/p_auth_token.jsp',
  //   headers: {
  //     Referer: 'https://dev-ent-gve.com/nero/'
  //   }
  // }).then((response) => {
  //   // expect(response.status).to.eq(200) // to test here or not?
  //   const pAuth = response.body.replace(/(\r\n|\n|\r|\s)/gm, '')
  //
  //   const params = {
  //     _com_liferay_login_web_portlet_LoginPortlet_formDate: Date.now(),
  //     _com_liferay_login_web_portlet_LoginPortlet_saveLastPath: false,
  //     _com_liferay_login_web_portlet_LoginPortlet_redirect: '',
  //     _com_liferay_login_web_portlet_LoginPortlet_doActionAfterLogin: false,
  //     _com_liferay_login_web_portlet_LoginPortlet_login: user.login,
  //     _com_liferay_login_web_portlet_LoginPortlet_password: user.password,
  //     _com_liferay_login_web_portlet_LoginPortlet_checkboxNames: 'rememberMe',
  //     p_auth: pAuth
  //   }
  //
  //   const loginUrl = Cypress.config().baseUrl + '/home?' +
  //     'p_p_id=com_liferay_login_web_portlet_LoginPortlet' +
  //     '&p_p_lifecycle=1&' +
  //     'p_p_state=exclusive&' +
  //     'p_p_mode=view&' +
  //     '_com_liferay_login_web_portlet_LoginPortlet_javax.portlet.action=%2Flogin%2Flogin&' +
  //     '_com_liferay_login_web_portlet_LoginPortlet_mvcRenderCommandName=%2Flogin%2Flogin'
  //
  //   cy.request({
  //     method: 'POST',
  //     url: loginUrl,
  //     form: true,
  //     body: params,
  //     headers: {
  //       Origin: 'https://dev-ent-gve.com'
  //     }
  //   }).then((authResponse) => {
  //     expect(authResponse.status).to.eq(200) // to test here or not?
  //
  //     console.log(authResponse.body)
  //
  //     // "GUEST_LANGUAGE_ID=fr_FR; COOKIE_SUPPORT=true; JSESSIONID=DACF51174FD494C169047630C1A1A34D"
  //     // "COOKIE_SUPPORT=true; LFR_SESSION_STATE_11105=1684919766820; JSESSIONID=5C92E79BDDF250CAC7038A0C6BBEB906; GUEST_LANGUAGE_ID=fr_FR; LFR_SESSION_STATE_10205=1684919857948"
  //
  //     cy.wait(1000) // to be sure
  //
  //     cy.visit(visitUrl)
  //     if (visitUrl === '/') {
  //       cy.url().should('contain', Cypress.config().baseUrl + visitUrl) // because of the '/tableau-de-board' redirection
  //     } else {
  //       cy.url().should('eq', Cypress.config().baseUrl + visitUrl)
  //     }
  //   })
  // })
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

Cypress.Commands.add('type_ckeditor', (content) => {
  cy.window()
    .then(win => {
      cy.log('Type in CKEditor')
      win.ckeditor.setData(content) // Assume the window.ckeditor is set and correspond to the wanted ckEditor
    })
})
