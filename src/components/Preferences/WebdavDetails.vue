<template>
  <div>
    <p><em>TODO : Hidden if no Documents</em></p>
    <div v-if="hasWebdavEnabled">
      <p v-t="'enabledText'" />
      <p v-t="'formText'" />

      <p v-t="'passwordLabel'" />
      <p v-t="'newPasswordLabel'" />
      <p v-t="'confirmNewPasswordLabel'" />

      <p v-t="'lostPasswordText'" />
      <PentilaButton
        :title="$t('confirmButtonTitle')"
        :label="$t('confirmButtonLabel')"
        @click="onPasswordUpdate"
      />
    </div>
    <div v-else>
      <p v-t="'disabledText'" />
      <PentilaButton
        :title="$t('enableButtonTitle')"
        :label="$t('enableButtonLabel')"
        @click="onActivateWebdav"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'WebdavDetails',
  computed: {
    hasWebdavEnabled () {
      return this.$store.state.user.hasWebdavEnabled
    }
  },
  methods: {
    onActivateWebdav () {
      console.log('activate webDAV')
    },
    onPasswordUpdate () {
      console.log('update password')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

<i18n locale="fr">
{
  "confirmButtonLabel": "Valider",
  "confirmButtonTitle": "@:PreferencesWindow.WebdavDetails.enableButtonLabel",
  "confirmNewPasswordLabel": "Confirmer votre nouveau mot de passe",
  "disabledText": "WebDAV n'est pas activé pour votre compte.",
  "enableButtonLabel": "Activer WebDAV",
  "enableButtonTitle": "@:PreferencesWindow.WebdavDetails.enableButtonLabel",
  "enabledText": "WebDAV est activé pour votre compte.",
  "formText": "Le formulaire suivant permet de réinitialiser votre mot de passe WebDAV.",
  "lostPasswordText": "Mot de passe perdu ? Ouvrez un ticket de support utilisateur.",
  "newPasswordLabel": "Nouveau mot de passe",
  "passwordLabel": "Mot de passe actuel"
}
</i18n>
