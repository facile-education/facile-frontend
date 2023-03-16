<template>
  <Layout>
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
        <form
          :action="formUrl + p_auth"
          method="POST"
        >
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
          >
          <input
            v-model="password"
            type="password"
            :placeholder="$t('password')"
            name="_com_liferay_login_web_portlet_LoginPortlet_password"
            class="input"
          >
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
            @click="loggin"
          />
        </form>
      </div>
      <img
        src="https://rec-ent.eduge.ch/GVEFrontPage-theme/images/geneve-logo.png"
        :alt="$t('gvaImg')"
        class="gva-img"
      >
    </div>
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/PublicLayout'

export default {
  name: 'Authentication',
  components: {
    Layout
  },
  data () {
    return {
      formUrl: '/home?p_p_id=com_liferay_login_web_portlet_LoginPortlet&p_p_lifecycle=1&p_p_state=exclusive&p_p_mode=view&_com_liferay_login_web_portlet_LoginPortlet_javax.portlet.action=%2Flogin%2Flogin&_com_liferay_login_web_portlet_LoginPortlet_mvcRenderCommandName=%2Flogin%2Flogin&p_auth=',
      login: '',
      password: '',
      p_auth: '',
      ssoUrl: 'https://rec-ent.eduge.ch/Shibboleth.sso/Login?entityID=https://ssoeel.geneveid.ch/ginasso/gina/fed/ent&amp;target='
    }
  },
  computed: {
  },
  created () {
    // Using fetch instead of axios to avoid intercept loop
    fetch('/p_auth_token.jsp').then(response => response.text()).then(response => { this.p_auth = response })
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  background-color: #fff;
  padding: 1rem 3rem;
  width: 400px;
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
  "studentTeacher": "Élève / Enseignant"
}
</i18n>
