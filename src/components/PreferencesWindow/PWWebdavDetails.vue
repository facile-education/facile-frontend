<template>
  <div>
    <p><em>TODO : Hidden if no Documents</em></p>
    <div v-if="hasWebdavEnabled">
      <p v-t="'PreferencesWindow.PWWebdavDetails.enabledText'" />
      <p v-t="'PreferencesWindow.PWWebdavDetails.formText'" />

      <p v-t="'PreferencesWindow.PWWebdavDetails.passwordLabel'" />
      <p v-t="'PreferencesWindow.PWWebdavDetails.newPasswordLabel'" />
      <p v-t="'PreferencesWindow.PWWebdavDetails.confirmNewPasswordLabel'" />

      <p v-t="'PreferencesWindow.PWWebdavDetails.lostPasswordText'" />
      <NeroButton
        :title="$t('PreferencesWindow.PWWebdavDetails.confirmButtonTitle')"
        :label="$t('PreferencesWindow.PWWebdavDetails.confirmButtonLabel')"
        @click="onPasswordUpdate"
      />
    </div>
    <div v-else>
      <p v-t="'PreferencesWindow.PWWebdavDetails.disabledText'" />
      <NeroButton
        :title="$t('PreferencesWindow.PWWebdavDetails.enableButtonTitle')"
        :label="$t('PreferencesWindow.PWWebdavDetails.enableButtonLabel')"
        @click="onActivateWebdav"
      />
    </div>
  </div>
</template>

<script>
import NeroButton from '@/components/Nero/NeroButton'

export default {
  name: 'PWWebdavDetails',
  components: {
    NeroButton
  },
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
