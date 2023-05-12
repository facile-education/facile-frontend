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
        <span v-t="'parentOther'" />
        <form @submit.prevent="doLogin">
          <input
            name="_com_liferay_login_web_portlet_LoginPortlet_formDate"
            type="hidden"
            :value="new Date().getTime()"
          >
          <input
            name="_com_liferay_login_web_portlet_LoginPortlet_saveLastPath"
            type="hidden"
            value="false"
          >
          <input
            name="_com_liferay_login_web_portlet_LoginPortlet_redirect"
            type="hidden"
            value=""
          >
          <input
            name="_com_liferay_login_web_portlet_LoginPortlet_doActionAfterLogin"
            type="hidden"
            value="false"
          >
          <input
            v-model="login"
            :placeholder="$t('login')"
            name="_com_liferay_login_web_portlet_LoginPortlet_login"
            class="input"
            @keypress="handleKeyPressed"
          >
          <input
            v-model="password"
            type="password"
            :placeholder="$t('password')"
            name="_com_liferay_login_web_portlet_LoginPortlet_password"
            class="input"
            @keypress="handleKeyPressed"
          >
          <div>
            <span
              v-show="isError"
              v-t="'loginError'"
              class="errorMessage"
            />
          </div>
          <div>
            <span
              v-show="!isActive"
              v-t="'inactiveAccount'"
              class="errorMessage"
            />
          </div>
          <!-- <input
            name="_com_liferay_login_web_portlet_LoginPortlet_rememberMe"
            type="checkbox"
          > -->
          <input
            name="_com_liferay_login_web_portlet_LoginPortlet_checkboxNames"
            type="hidden"
            value="rememberMe"
          >
          <button
            v-t="'authenticate'"
            class="btn"
            :title="$t('entLogin')"
            type="submit"
          />
        </form>
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
import PublicLayout from '@/router/layouts/PublicLayout'
import axios from 'axios'
import authenticationService from '@/api/authentication.service'
import userService from '@/api/user.service'
import store from '@/store'

export default {
  name: 'Authentication',
  components: {
    PublicLayout
  },
  data () {
    return {
      formUrl: '/home?p_p_id=com_liferay_login_web_portlet_LoginPortlet&p_p_lifecycle=1&p_p_state=exclusive&p_p_mode=view&_com_liferay_login_web_portlet_LoginPortlet_javax.portlet.action=/login/login&_com_liferay_login_web_portlet_LoginPortlet_mvcRenderCommandName=/login/login',
      login: '',
      password: '',
      p_auth: '',
      ssoUrl: 'https://rec-ent.eduge.ch/Shibboleth.sso/Login?entityID=https://ssoeel.geneveid.ch/ginasso/gina/fed/ent&amp;target=',
      isError: false,
      isActive: true
    }
  },
  computed: {
  },
  created () {
    // Using fetch instead of axios to avoid intercept loop
    fetch('/p_auth_token.jsp').then(response => response.text()).then(response => { this.p_auth = response })
  },
  methods: {
    doLogin () {
      // First check credentials
      authenticationService.checkCredentials(this.login, this.password).then((data) => {
        if (!data.isValid) {
          this.isError = true
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

          axios.post('http://dev-ent-gve.com' + this.formUrl,
            formData,
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }
          ).then(() => {
            // Reset p_auth_token
            store.commit('user/setPAuth', undefined)
            if (this.userId === undefined) {
              userService.getUserInformations().then(
                (data) => {
                  if (data.success) {
                    this.$store.dispatch('user/initUserInformations', data)
                    // If terms of use have not been accepted yet
                    if (!data.agreedTermsOfUse) {
                      this.$router.push({ path: 'agree-terms-of-use' })
                    } else if (data.passwordChange) {
                      this.$router.push({ path: 'password-change' })
                    } else {
                      setTimeout(() => this.$router.push({ path: 'espaces' }), 500)
                    }
                  }
                }
              )
            } else {
              // Redirect to dashboard if already logged in
              this.$router.push({ path: 'dashboard' })
            }
          })
        }
      })
    },
    handleKeyPressed () {
      this.isError = false
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  background-color: #fff;
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
  color: #2c7bb8;
  border: 2px solid #2c7bb8;
  background: #fff;
  width: 100%;
}

.btn {
  border-color: #2c7bb8;
  background: #2c7bb8;
  color: #fff;
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
  white-space: nowrap;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  padding: .5rem .75rem;
  font-size: 1rem;
  line-height: 1.25;
  transition: all .15s ease-in-out;
}

.input {
  height: 46px;
  padding: 10px 16px;
  font-size: 18px;
  line-height: 1.3333333;
  display: block;
  width: 100%;
  color: #555;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 0;
  margin: .3rem 0;
}

.errorMessage {
  color: red;
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
  "inactiveAccount": "Votre compte est inactif."
}
</i18n>
