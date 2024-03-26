import WeprodeUtils from '@utils/weprode.utils'
import axios from 'axios'
import { computed, onBeforeMount, ref } from 'vue'
import { useCookies } from 'vue3-cookies'

import authenticationService from '@/api/authentication.service'
import constants from '@/api/constants'
import mobileService from '@/api/mobile.service'
import { GET_USER_INFOS_WS, USER_PATH } from '@/api/user.service'
import { DASHBOARD } from '@/constants/appConstants'
import router from '@/router'
import store from '@/store'

export default () => {
  // Data
  const isLoading = ref(false)
  const isGuestFormDisplayed = ref(false)
  const login = ref('')
  const password = ref('')
  const passwordInputType = ref('password')
  const pAuth = ref('')
  const isError = ref(false)
  const isLocked = ref(false)
  const lockoutDuration = ref(0)
  const nbRemainingTries = ref(0)
  const showPasswordRecoveryForm = ref(false)
  const recoveryLogin = ref('')
  const passwordRecoveryUrl = ref(constants.BASE_API_URL + '/home?p_p_id=com_liferay_login_web_portlet_LoginPortlet&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&_com_liferay_login_web_portlet_LoginPortlet_javax.portlet.action=/login/forgot_password&_com_liferay_login_web_portlet_LoginPortlet_mvcRenderCommandName=/login/forgot_password')
  const checkEmail = ref(false)
  const isIdpAuthenticated = ref(false)

  // Computed properties
  const isMobileApp = computed(() => {
    // We are in mobile app mode if the cookie is found or the parameter is in the url (first time)
    const { cookies } = useCookies()
    return cookies.get('isMobileApp') === 'true' || isMobileAppLoading.value
  })

  const isMobileAppLoading = computed(() => {
    // Mobile app startup
    return window.location.href.includes('mobile_app') || window.location.href.includes('mobile_token')
  })

  const authenticateButtonLabel = computed(() => {
    return isLoading.value ? 'Authentication.authenticationOnGoing' : 'Authentication.authenticate'
  })

  const areEmptyFields = computed(() => {
    return login.value === '' || password.value === ''
  })

  // methods
  function doLogin () {
    // Do not call if empty login or password
    if (areEmptyFields.value) {
      return
    }

    isLoading.value = true
    authenticationService.login(login.value, password.value, isMobileApp.value).then(response => {
      isLoading.value = false
      if (!response.success) {
        isError.value = true
        if (response.isLocked) {
          isLocked.value = true
          lockoutDuration.value = response.lockoutDuration / 60
        } else {
          isLocked.value = false
          nbRemainingTries.value = response.nbRemainingTries
        }
      } else {
        isLocked.value = false
        // Reset p_auth_token
        store.commit('user/setPAuth', undefined)

        // Reset Matomo userId
        window._paq.push(['setUserId', Math.random().toString(36)])
        window._paq.push(['trackPageView'])

        // Fetch p_auth because login changed it
        fetch(constants.P_AUTH_URL).then(response => { if (response.status === 200) { return response.text() } }).then(response => {
          if (response !== undefined) {
            pAuth.value = response.trim()

            // Fetch logged user
            fetch(constants.JSON_WS_URL + USER_PATH + GET_USER_INFOS_WS + '?p_auth=' + pAuth.value).then(response => {
              if (response.status === 200) {
                store.commit('user/setPAuth', pAuth.value)
                response.json().then(data => {
                  const redirectUrl = DASHBOARD
                  if (isMobileApp.value) {
                    // Manage mobile token
                    addMobileToken(data.userId, redirectUrl)
                  } else {
                    // Route to landing page
                    router.push(redirectUrl)
                  }
                })
              } else if (response.status === 403) {
                isError.value = true
              }
            })
          }
        })
      }
    }, (err) => {
      isLoading.value = false
      console.error('error when logging', err)
    })
  }

  function togglePasswordType () {
    if (passwordInputType.value === 'password') {
      passwordInputType.value = 'text'
    } else {
      passwordInputType.value = 'password'
    }
  }

  function addMobileToken (userId, redirectUrl) {
    // Remove first slash in redirectUrl
    if (redirectUrl.startsWith('/')) {
      redirectUrl = redirectUrl.substring(1)
    }
    let refreshToken = ''

    // Adding new token
    mobileService.addMobileToken().then((response) => {
      if (response.success) {
        refreshToken = response.refreshToken
        const mobileUrl = encodeURI(window.location.origin + '/' + redirectUrl)
        const serviceUrl = window.location.origin + '/appmobile.html?refresh_token=' + refreshToken + '&user_id=' + userId + '&home_url=' + mobileUrl
        window.location.replace(serviceUrl)
      }
    })
  }

  function refreshMobileToken (userId, redirectUrl) {
    // Remove first slash in redirectUrl
    if (redirectUrl.startsWith('/')) {
      redirectUrl = redirectUrl.substring(1)
    }
    let refreshToken = ''

    // Refreshing with new token
    // First extract token from url
    const mobileTokenStr = window.location.search.substring(window.location.search.indexOf('mobile_token=') + 13)
    const idx1 = mobileTokenStr.indexOf('%')
    const idx2 = mobileTokenStr.indexOf('&')
    let endIdx = mobileTokenStr.length
    if (idx1 > 0) {
      endIdx = idx1
    }
    if (idx2 > 0 && idx2 < endIdx) {
      endIdx = idx2
    }
    const mobileToken = mobileTokenStr.substring(0, endIdx)

    mobileService.refreshMobileToken(mobileToken).then((response) => {
      if (response.success) {
        refreshToken = response.refreshToken
        const mobileUrl = encodeURI(window.location.origin + '/' + redirectUrl)
        const serviceUrl = window.location.origin + '/appmobile.html?refresh_token=' + refreshToken + '&user_id=' + userId + '&home_url=' + mobileUrl
        window.location.replace(serviceUrl)
      }
    })
  }

  function handleKeyPressed () {
    isError.value = false
  }

  function sendRecoveryEmail () {
    const formData = new FormData()
    formData.append('_com_liferay_login_web_portlet_LoginPortlet_login', recoveryLogin.value)

    axios.post(passwordRecoveryUrl.value,
      formData,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    ).then(() => {
      checkEmail.value = true
    })
  }

  function setCookie (name, value, days) {
    let expires = ''

    if (days) {
      const date = new Date()
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
      expires = '; expires=' + date.toUTCString()
    }

    document.cookie = name + '=' + (value || '') + expires + '; path=/'
  }

  function toggleGuestForm () {
    isGuestFormDisplayed.value = !isGuestFormDisplayed.value
  }

  onBeforeMount(() => {
    const { cookies } = useCookies()
    if (isMobileApp.value) {
      cookies.set('isMobileApp', isMobileApp.value)
    }

    // Add LFR cookie needed for authentication
    if (WeprodeUtils.getCookie('COOKIE_SUPPORT') === '') {
      setCookie('COOKIE_SUPPORT', true, 365)
    }

    // Check if already authenticated
    // This authenticates through Shibboleth and MobileApplication too
    fetch(constants.BASE_API_URL + '/c/common/authentication-check').then(response => {
      response.json().then(data => {
        if (response.status === 200 && data.isAuthenticated === true) {

          if (isMobileAppLoading.value) {
            // Manage mobile token
            let service = DASHBOARD
            if (window.location.href.includes('service')) {
              service = new URLSearchParams(window.location.search).get('service')
            }

            if (window.location.href.includes('mobile_token')) {
              refreshMobileToken(data.userId, service)
            } else {
              addMobileToken(data.userId, service)
            }
          } else {
            router.push(DASHBOARD)
          }
        } else if (data.hasIdpSession) {
          isIdpAuthenticated.value = true
        }
      })
      // Else replace token with mobileApp=true if existing
    })
  })

  return {
    isLoading,
    isGuestFormDisplayed,
    login,
    password,
    passwordInputType,
    pAuth,
    isError,
    isLocked,
    isIdpAuthenticated,
    lockoutDuration,
    nbRemainingTries,
    showPasswordRecoveryForm,
    recoveryLogin,
    passwordRecoveryUrl,
    checkEmail,
    isMobileApp,
    authenticateButtonLabel,
    areEmptyFields,
    doLogin,
    togglePasswordType,
    handleKeyPressed,
    sendRecoveryEmail,
    setCookie,
    toggleGuestForm
  }
}
