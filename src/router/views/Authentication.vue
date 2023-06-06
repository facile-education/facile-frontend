<template>
  <PublicLayout>
    <div class="wrapper">
      <img
        src="https://rec-ent.eduge.ch/GVEFrontPage-theme/images/logo_eel.png"
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
      <div class="guest">
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
                v-t="'authenticate'"
                class="btn"
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
        src="https://rec-ent.eduge.ch/GVEFrontPage-theme/images/geneve-logo.png"
        :alt="$t('gvaImg')"
        class="gva-img"
      >
    </div>
  </PublicLayout>
</template>

<script>
import { DASHBOARD } from '@/constants/appConstants'
import PublicLayout from '@/router/layouts/PublicLayout'
import axios from 'axios'
import authenticationService from '@/api/authentication.service'
import store from '@/store'
import constants from '@/api/constants'
import { GET_USER_INFOS_WS, USER_PATH } from '@/api/user.service'

export default {
  name: 'Authentication',
  components: {
    PublicLayout
  },
  props: {
    redirect: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      formUrl: '/home?p_p_id=com_liferay_login_web_portlet_LoginPortlet&p_p_lifecycle=1&p_p_state=exclusive&p_p_mode=view&_com_liferay_login_web_portlet_LoginPortlet_javax.portlet.action=/login/login&_com_liferay_login_web_portlet_LoginPortlet_mvcRenderCommandName=/login/login',
      login: '',
      password: '',
      p_auth: '',
      ssoUrl: 'https://rec-ent.eduge.ch/Shibboleth.sso/Login?entityID=https://ssoeel.geneveid.ch/ginasso/gina/fed/ent&amp;target=',
      isActive: true,
      isError: false,
      isGuestFormDisplayed: false,
      showForgotPassword: false,
      showPasswordRecoveryForm: false,
      recoveryLogin: '',
      passwordRecoveryUrl: '/home?p_p_id=com_liferay_login_web_portlet_LoginPortlet&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&_com_liferay_login_web_portlet_LoginPortlet_javax.portlet.action=/login/forgot_password&_com_liferay_login_web_portlet_LoginPortlet_mvcRenderCommandName=/login/forgot_password',
      checkEmail: false
    }
  },
  computed: {
  },
  created () {
    // Using fetch instead of axios to avoid intercept loop
    fetch('/p_auth_token.jsp').then(response => response.text()).then(response => {
      this.p_auth = response

      // Check if already authenticated
      fetch(constants.JSON_WS_URL + USER_PATH + GET_USER_INFOS_WS + '?p_auth=' + this.p_auth).then(response => {
        if (response.status === 200) {
          if (this.redirect) {
            this.$router.push(this.redirect)
          } else {
            this.$router.push(DASHBOARD)
          }
        }
      })
    })
  },
  methods: {
    doLogin () {
      // First check credentials
      authenticationService.checkCredentials(this.login, this.password).then((data) => {
        if (!data.isValid) {
          this.isError = true
          this.showForgotPassword = true
        } else if (data.isValid && !data.isActive) {
          this.isInactive = true
        } else {
          const formData = new FormData()
          formData.append('_com_liferay_login_web_portlet_LoginPortlet_formDate', new Date().getTime())
          formData.append('_com_liferay_login_web_portlet_LoginPortlet_saveLastPath', false)
          formData.append('_com_liferay_login_web_portlet_LoginPortlet_redirect', '')
          formData.append('_com_liferay_login_web_portlet_LoginPortlet_doActionAfterLogin', false)
          formData.append('_com_liferay_login_web_portlet_LoginPortlet_login', this.login)
          formData.append('_com_liferay_login_web_portlet_LoginPortlet_password', this.password)
          formData.append('_com_liferay_login_web_portlet_LoginPortlet_checkboxNames', 'rememberMe')

          axios.post(this.formUrl,
            formData,
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
          ).then(() => {
            // Reset p_auth_token
            store.commit('user/setPAuth', undefined)

            // Reset Matomo userId
            window._paq.push(['setUserId', Math.random().toString(36)])
            window._paq.push(['trackPageView'])

            // Route to landing page
            if (this.redirect) {
              this.$router.push(this.redirect)
            } else {
              this.$router.push(DASHBOARD)
            }
          })
        }
      })
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
  "authenticate": "Se connecter",
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
