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

import PentilaUtils from 'pentila-utils'

import { GLOBAL_ADMIN } from './constants/users'

Cypress.Commands.add('login', (user, visitUrl = undefined) => {
  cy.log('===== LOG IN (' + user.login + ') =====')

  cy.session(user, () => {
    // UI method, TODO: api method
    cy.visit('/login')
    cy.contains('Parents / Autres profils').click()

    cy.get('input[placeholder="Identifiant"]').type(user.login)
    cy.get('input[type="password"]').type(user.password)
    cy.get('button[type="submit"]').click()
    // cy.url().should('contain', '/tableau-de-bord')
  },
  {
    // TODO: Review validation method (check status of get-user-info by example / check if cookie sessionId is not null...)
    validate () {
      const IDCookie = PentilaUtils.Cookies.getCookie('ID')
      assert(IDCookie !== undefined)

      // cy.request(Cypress.config().baseUrl + '/lfr/p_auth_token.jsp').then(response => {
      //   console.log(response)
      //   const pAuth = response.body.replace(/(\r\n|\n|\r|\s)/gm, '')
      //   cy.request(Cypress.config().baseUrl + '/lfr/api/jsonws/user.userutils/get-user-infos?p_auth=' + pAuth).its('status').should('eq', 200)
      // })
    },
    cacheAcrossSpecs: true
  })

  if (visitUrl) {
    cy.visit(visitUrl)
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

Cypress.Commands.add('loadTables', (dumpName) => {
  cy.log('===== Load tables =====')
  cy.exec('npm run db:loadTables ' + dumpName).then((result) => {
    const { code, stderr } = result
    cy.wrap(code).should('eq', 0)
    cy.wrap(stderr).should('be.empty')
  })

  cy.log('===== clearDBCache =====')
  cy.login(GLOBAL_ADMIN)

  // Request method
  cy.request({ // get pauth
    method: 'GET',
    url: Cypress.config().baseUrl + '/lfr/p_auth_token.jsp',
    headers: {
      Referer: Cypress.config().baseUrl + '/lfr/'
    }
  }).then((response) => {
    // expect(response.status).to.eq(200) // to test here or not?
    const pAuth = response.body.replace(/(\r\n|\n|\r|\s)/gm, '')

    const url = Cypress.config().baseUrl + '/lfr/group/control_panel/manage?' +
    'p_p_id=com_liferay_server_admin_web_portlet_ServerAdminPortlet&' +
    'p_p_lifecycle=1&' +
    'p_p_state=maximized&' +
    'p_p_mode=view&' +
    '_com_liferay_server_admin_web_portlet_ServerAdminPortlet_javax.portlet.action=%2Fserver_admin%2Fedit_server'

    const params = {
      _com_liferay_server_admin_web_portlet_ServerAdminPortlet_formDate: Date.now(),
      _com_liferay_server_admin_web_portlet_ServerAdminPortlet_cmd: 'cacheDb',
      _com_liferay_server_admin_web_portlet_ServerAdminPortlet_tabs1: 'resources',
      _com_liferay_server_admin_web_portlet_ServerAdminPortlet_redirect: '',
      p_auth: pAuth
    }

    cy.request({
      method: 'POST',
      url,
      form: true,
      body: params
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 304])
      console.log(response)
    })
  })
})

Cypress.Commands.add('globalKeyPress', (keyName) => {
  cy.get('body').type(keyName)
})

Cypress.Commands.add('type_ckeditor', (content) => {
  cy.window()
    .then(win => {
      win.ckeditor.setData(content) // Assume the window.ckeditor is set and correspond to the wanted ckEditor (only one ck by page)
    })
})
