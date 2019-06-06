<template>
  <div>
    <p><em>TODO : Hidden if no Documents</em></p>
    <div v-if="hasWebdavEnabled">
      <p v-t="'PreferencesWindow.WebdavDetails.enabledText'" />
      <p v-t="'PreferencesWindow.WebdavDetails.formText'" />

      <p v-t="'PreferencesWindow.WebdavDetails.passwordLabel'" />
      <p v-t="'PreferencesWindow.WebdavDetails.newPasswordLabel'" />
      <p v-t="'PreferencesWindow.WebdavDetails.confirmNewPasswordLabel'" />

      <p v-t="'PreferencesWindow.WebdavDetails.lostPasswordText'" />
      <PentilaButton
        :title="$t('PreferencesWindow.WebdavDetails.confirmButtonTitle')"
        :label="$t('PreferencesWindow.WebdavDetails.confirmButtonLabel')"
        @click="onPasswordUpdate"
      />
    </div>
    <div v-else>
      <p v-t="'PreferencesWindow.WebdavDetails.disabledText'" />
      <PentilaButton
        :title="$t('PreferencesWindow.WebdavDetails.enableButtonTitle')"
        :label="$t('PreferencesWindow.WebdavDetails.enableButtonLabel')"
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
