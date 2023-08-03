<template>
  <GVELayout>
    <h1 :aria-label="$t('title')" />
    <div class="wrapper">
      <img
        src="@assets/images/gva/logo_eel.png"
        :alt="$t('eelImg')"
        class="eel-img"
      >
      <a
        id="academic"
        v-t="'studentTeacher'"
        :href="ssoUrl"
        :title="$t('entLogin')"
        class="btn"
      />
      <div
        class="guest"
      >
        <span
          v-t="'parentOther'"
          @click="toggleGuestForm"
        />

        <Transition name="expand">
          <div v-if="isGuestFormDisplayed">
            <!-- Password recovery -->
            <form
              v-if="showPasswordRecoveryForm"
              @submit.prevent="sendRecoveryEmail"
            >
              <div class="login-label">
                <p
                  v-t="'login-label'"
                />
              </div>
              <input
                v-model="recoveryLogin"
                :placeholder="$t('loginPlaceholder')"
                class="input"
                @keypress="handleKeyPressed"
              >
              <button
                v-t="'send-recovery'"
                class="btn"
                :title="$t('send-recovery')"
                type="submit"
              />
              <div
                v-if="checkEmail"
                class="check-email"
              >
                <span
                  v-t="'check-email'"
                />
              </div>
              <div>
                <a
                  v-if="showForgotPassword"
                  v-t="'main-form'"
                  href="#"
                  @click="showPasswordRecoveryForm = false"
                />
              </div>
            </form>
            <form
              v-else
              @submit.prevent="doLogin"
            >
              <input
                v-model="login"
                :placeholder="$t('login')"
                class="input"
                name="unsername"
                @keypress="handleKeyPressed"
              >
              <input
                v-model="password"
                type="password"
                :placeholder="$t('password')"
                class="input"
                name="password"
                @keypress="handleKeyPressed"
              >
              <div>
                <span
                  v-show="isError"
                  v-t="'loginError'"
                  class="errorMessage"
                />
                <span
                  v-show="!isActive"
                  v-t="'inactiveAccount'"
                  class="errorMessage"
                />
              </div>
              <button
                v-t="authenticateButtonLabel"
                class="btn"
                :class="{'disabled': isLoading}"
                :disabled="isLoading"
                :title="$t('authenticate')"
                type="submit"
              />
              <div>
                <a
                  v-if="showForgotPassword"
                  v-t="'forgot-password'"
                  href="#"
                  @click="showPasswordRecoveryForm = true"
                />
              </div>
            </form>
          </div>
        </Transition>
      </div>
      <img
        src="@assets/images/gva/geneve-logo.png"
        :alt="$t('gvaImg')"
        width="140"
        height="108"
        class="gva-img"
      >
    </div>
  </GVELayout>
</template>

<script>
import GVELayout from '@layouts/GVELayout.vue'
import axios from 'axios'
import PentilaUtils from 'pentila-utils'

import authenticationService from '@/api/authentication.service'
import constants from '@/api/constants'
import mobileService from '@/api/mobile.service'
import { GET_USER_INFOS_WS, USER_PATH } from '@/api/user.service'
import { DASHBOARD } from '@/constants/appConstants'
import store from '@/store'

export default {
  name: 'Authentication',
  components: {
    GVELayout
  },
  props: {
    redirect: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isLoading: false,
      formUrl: constants.BASE_API_URL + '/home?p_p_id=com_liferay_login_web_portlet_LoginPortlet&p_p_lifecycle=1&p_p_state=maximized&p_p_mode=view&_com_liferay_login_web_portlet_LoginPortlet_javax.portlet.action=%2Flogin%2Flogin&_com_liferay_login_web_portlet_LoginPortlet_mvcRenderCommandName=%2Flogin%2Flogin',
      login: '',
      password: '',
      p_auth: '',
      isActive: true,
      isError: false,
      isGuestFormDisplayed: false,
      showForgotPassword: false,
      showPasswordRecoveryForm: false,
      recoveryLogin: '',
      passwordRecoveryUrl: constants.BASE_API_URL + '/home?p_p_id=com_liferay_login_web_portlet_LoginPortlet&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&_com_liferay_login_web_portlet_LoginPortlet_javax.portlet.action=/login/forgot_password&_com_liferay_login_web_portlet_LoginPortlet_mvcRenderCommandName=/login/forgot_password',
      checkEmail: false
    }
  },
  computed: {
    isMobileApp () {
      return window.location.href.includes('mobile_app') || window.location.href.includes('mobile_token')
    },
    fullUrl () {
      return window.location.href
    },
    ssoUrl () {
      return '/Shibboleth.sso/Login?entityID=https://ssoeel.geneveid.ch/ginasso/gina/fed/ent&target=' + encodeURIComponent(window.location.origin + '/login' + (this.isMobileApp ? '?mobile_app=true' : ''))
    },
    authenticateButtonLabel () {
      return this.isLoading ? 'authenticationOnGoing' : 'authenticate'
    }
  },
  created () {
    // Add LFR cookie needed for authentication
    if (PentilaUtils.Cookies.getCookie('COOKIE_SUPPORT') === '') {
      this.setCookie('COOKIE_SUPPORT', true, 365)
    }

    // Using fetch instead of axios to avoid intercept loop
    // This authenticates through Shibboleth and MobileApplication
    fetch(constants.P_AUTH_URL).then(response => { if (response.status === 200) { return response.text() } }).then(response => {
      if (response !== undefined) {
        this.p_auth = response.trim()

        // Check if already authenticated
        fetch(constants.JSON_WS_URL + USER_PATH + GET_USER_INFOS_WS + '?p_auth=' + this.p_auth).then(response => {
          if (response.status === 200) {
            if (this.isMobileApp) {
              // Manage mobile token
              let service = ''
              if (window.location.href.includes('service')) {
                service = new URLSearchParams(window.location.search).get('service')
              }
              response.json().then(data => this.manageMobileApp(data.userId, service))
            } else if (this.redirect) {
              this.$router.push(this.redirect)
            } else {
              this.$router.push(DASHBOARD)
            }
          }
        })
      }
    })
  },
  methods: {
    doLogin () {
      // First check credentials
      this.isLoading = true
      authenticationService.checkCredentials(this.login, this.password).then((data) => {
        this.isLoading = false
        if (!data.isValid) {
          this.isError = true
          this.showForgotPassword = true
        } else if (data.isValid && !data.isActive) {
          this.isInactive = true
        } else {
          // Call Login form
          const formData = new FormData()
          formData.append('_com_liferay_login_web_portlet_LoginPortlet_formDate', new Date().getTime())
          formData.append('_com_liferay_login_web_portlet_LoginPortlet_saveLastPath', false)
          formData.append('_com_liferay_login_web_portlet_LoginPortlet_redirect', '')
          formData.append('_com_liferay_login_web_portlet_LoginPortlet_doActionAfterLogin', false)
          formData.append('_com_liferay_login_web_portlet_LoginPortlet_login', this.login)
          formData.append('_com_liferay_login_web_portlet_LoginPortlet_password', this.password)
          formData.append('_com_liferay_login_web_portlet_LoginPortlet_checkboxNames', 'rememberMe')
          if (this.isMobileApp) {
            formData.append('_com_liferay_login_web_portlet_LoginPortlet_rememberMe', 'on')
          }
          this.isLoading = true
          axios.post(this.formUrl,
            formData,
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
          ).then(() => {
            this.isLoading = false
            // Reset p_auth_token
            store.commit('user/setPAuth', undefined)

            // Reset Matomo userId
            window._paq.push(['setUserId', Math.random().toString(36)])
            window._paq.push(['trackPageView'])

            const redirectUrl = this.redirect ? this.redirect : DASHBOARD
            if (this.isMobileApp) {
              // Manage mobile token
              this.manageMobileApp(data.userId, redirectUrl)
            } else {
              // Route to landing page
              this.$router.push(redirectUrl)
            }
          }, (err) => {
            this.isLoading = false
            console.error('error when logging', err)
          })
        }
      }, (err) => {
        this.isLoading = false
        console.error('error when logging', err)
      })
    },
    manageMobileApp (userId, redirectUrl) {
      // Remove first slash in redirectUrl
      if (redirectUrl.startsWith('/')) {
        redirectUrl = redirectUrl.substring(1)
      }
      let refreshToken = ''
      if (window.location.href.includes('mobile_token')) {
        // Refreshing with new token
        const mobileToken = new URLSearchParams(window.location.search).get('mobile_token')
        mobileService.refreshMobileToken(mobileToken).then((response) => {
          if (response.success) {
            refreshToken = response.refreshToken
            const mobileUrl = encodeURI(window.location.origin + '/' + redirectUrl, 'UTF-8')
            const serviceUrl = 'pentila://authorized?refresh_token=' + refreshToken + '&user_id=' + userId + '&home_url=' + mobileUrl
            window.location = serviceUrl
          }
        })
      } else {
        // Adding new token
        mobileService.addMobileToken().then((response) => {
          if (response.success) {
            refreshToken = response.refreshToken
            const mobileUrl = encodeURI(window.location.origin + '/' + redirectUrl, 'UTF-8')
            const serviceUrl = 'pentila://authorized?refresh_token=' + refreshToken + '&user_id=' + userId + '&home_url=' + mobileUrl
            window.location = serviceUrl
          }
        })
      }
    },
    handleKeyPressed () {
      this.isError = false
    },
    sendRecoveryEmail () {
      const formData = new FormData()
      formData.append('_com_liferay_login_web_portlet_LoginPortlet_login', this.recoveryLogin)

      axios.post(this.passwordRecoveryUrl,
        formData,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      ).then(() => {
        this.checkEmail = true
      })
    },
    setCookie (name, value, days) {
      let expires = ''

      if (days) {
        const date = new Date()
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
        expires = '; expires=' + date.toUTCString()
      }

      document.cookie = name + '=' + (value || '') + expires + '; path=/'
    },
    toggleGuestForm () {
      this.isGuestFormDisplayed = !this.isGuestFormDisplayed
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

$eel-blue: #2c7bb8;

.wrapper {
  position: relative;
  background-color: $color-body-bg;
  padding: 1rem 3rem;
  width: 450px;
  max-width: 90vw;
  margin: auto;
  display: flex;
  flex-direction: column;
}

.eel-img {
  margin-bottom: 1.5rem;
  width: 100%;
}

.gva-img {
  margin: 1.5rem auto 0 auto;
}

.guest {
  color: $eel-blue;
  border: 2px solid $eel-blue;
  background: $color-body-bg;
  width: 100%;

  span {
    cursor: pointer;
    display: inline-block;
    width: 100%;
    margin: -10px;
    padding: 10px;
  }
}

.btn {
  border-color: $eel-blue;
  background: $eel-blue;
  color: $color-body-bg;
  width: 300px;
  border-radius: 0;
  width: 100%;
  margin: 10px 0;
  border: 1px solid transparent;
  text-decoration: none;
  cursor: pointer;
  &.disabled {
    opacity: 50;
    background-color: grey;
    cursor: wait;
  }
}

.guest, .btn {
  display: inline-block;
  font-weight: normal;
  text-align: center;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  padding: .5rem .75rem;
  font-size: 1rem;
  line-height: 1.25;
  overflow: hidden;
}

.input {
  height: 46px;
  padding: 10px 16px;
  font-size: 18px;
  line-height: 1.3333333;
  display: block;
  width: 100%;
  color: #555;
  background-color: $color-body-bg;
  border: 1px solid $color-border;
  border-radius: 0;
  margin: .3rem 0;
}

.errorMessage {
  color: $error-color;
}

.expand-enter-active, .expand-leave-active {
  transition: max-height .4s ease;
}

.expand-enter-from, .expand-leave-to {
  max-height: 0;
}

.expand-enter-to, .expand-leave-from {
  max-height: 200px;
}
</style>

<i18n locale="fr">
{
  "title": "Authentification",
  "authenticate": "Se connecter",
  "authenticationOnGoing": "Connexion en cours ...",
  "eelImg": "Logo d'école en ligne",
  "entLogin": "Se connecter à l'ENT",
  "gvaImg": "Logo du Canton de Genève",
  "login": "Identifiant",
  "parentOther": "Parents / Autres profils",
  "password": "Mot de passe",
  "studentTeacher": "Élève / Enseignant",
  "loginError": "Identifiant ou mot de passe incorrect",
  "inactiveAccount": "Votre compte est inactif.",
  "forgot-password": "Mot de passe oublié",
  "login-label": "Saisissez votre identifiant. Vous recevrez un lien de réinitialisation de votre mot de passe ENTA sur le courriel associé à votre compte.",
  "loginPlaceholder": "Identifiant",
  "send-recovery": "Envoyer",
  "main-form": "Retour au formulaire",
  "check-email": "Vérifier votre courriel"
}
</i18n>
