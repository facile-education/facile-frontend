<template>
  <PentilaWindow
    :modal="true"
    @close="onClose"
  >
    <span
      slot="header"
      v-t="'PreferencesWindow.PreferencesModal.modalHeaderLabel'"
    />

    <div slot="body">
      <PentilaTabList>
        <PentilaTabItem :title="$t('PreferencesWindow.PreferencesModal.accountTabLabel')">
          <PersonalDetails />
        </PentilaTabItem>
        <PentilaTabItem :title="$t('PreferencesWindow.PreferencesModal.interfaceTabLabel')">
          <InterfaceDetails />
        </PentilaTabItem>
        <PentilaTabItem :title="$t('PreferencesWindow.PreferencesModal.notificationsTabLabel')">
          <NotificationDetails />
        </PentilaTabItem>
        <PentilaTabItem :title="$t('PreferencesWindow.PreferencesModal.backupTabLabel')">
          <BackupDetails />
        </PentilaTabItem>
        <PentilaTabItem :title="$t('PreferencesWindow.PreferencesModal.webdavTabLabel')">
          <WebdavDetails />
        </PentilaTabItem>
      </PentilaTabList>
    </div>
  </PentilaWindow>
</template>

<script>
import BackupDetails from '@/components/PreferencesWindow/BackupDetails'
import InterfaceDetails from '@/components/PreferencesWindow/InterfaceDetails'
import NotificationDetails from '@/components/PreferencesWindow/NotificationDetails'
import PersonalDetails from '@/components/PreferencesWindow/PersonalDetails'
import WebdavDetails from '@/components/PreferencesWindow/WebdavDetails'

export default {
  name: 'PreferencesModal',
  components: {
    BackupDetails,
    InterfaceDetails,
    NotificationDetails,
    PersonalDetails,
    WebdavDetails
  },
  methods: {
    onClose () {
      this.$store.dispatch('nero/closePreferencesModal')
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

</style>
