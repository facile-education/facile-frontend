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

import { exactString } from '../support/utils/testUtils'
import { GLOBAL_ADMIN } from './constants/users'

Cypress.Commands.add('login', (user, visitUrl = undefined) => {
  cy.log('===== LOG IN (' + user.login + ') =====')

  cy.session(user, () => {
    cy.setCookie('COOKIE_SUPPORT', 'true')
    cy.setCookie('cookiesAgreement', 'true')

    cy.request({ // get pauth
      method: 'GET',
      url: Cypress.config().baseUrl + '/lfr/p_auth_token.jsp',
      headers: {
        Referer: Cypress.config().baseUrl + '/lfr/'
      }
    }).then((response) => {
      // expect(response.status).to.eq(200) // to test here or not?
      const pAuth = response.body.replace(/(\r\n|\n|\r|\s)/gm, '')
      const loginUrl = Cypress.config().baseUrl + '/lfr/c/common/login'

      const params = {
        login: user.login,
        password: user.password,
        rememberMe: false,
        p_auth: pAuth
      }

      cy.request({
        method: 'POST',
        url: loginUrl,
        form: true,
        body: params
      }).then((response) => {
        console.log(response)
        expect(response.status).to.be.oneOf([200, 304])
        expect(response.body.success).to.be.eq(true)
      })
    })
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

  if (visitUrl && window.location.href !== Cypress.config().baseUrl + visitUrl) {
    cy.visit(visitUrl)
  }
})

Cypress.Commands.add('loadTables', (dumpName) => {
  cy.log('===== Load tables ' + dumpName + ' =====')
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
    })
  })
})

Cypress.Commands.add('globalKeyPress', (keyName) => {
  cy.get('body').type(keyName)
})

Cypress.Commands.add('type_ckeditor', (content) => {
  cy.window()
    .then(win => {
      win.textContent.ckeditor.setData(content) // Assume the window.ckeditor is set and correspond to the wanted ckEditor (only one ck by page)
      win.textContent.updateContent(content)
    })
})

Cypress.Commands.add('selectDateRangeInVCalendar', (startDate, endDate) => {
  // SelectFirstDate
  cy.get('.vc-popover-content').within(() => {
    // More generic but commented because v-calendar month doesn't collapse if current month
    // cy.get('button.vc-title').click()
    // cy.get('button.vc-nav-title').click()
    // cy.contains(dayJsStartDate.format('YYYY')).click()
    // cy.contains(dayJsStartDate.format('MMM')).click()
    cy.contains('.vc-day', exactString(startDate.format('D'))).click()
    cy.contains('.vc-day', exactString(endDate.format('D'))).click()
  })
// TODO: Find a way to close popover before continuing the tests
})
