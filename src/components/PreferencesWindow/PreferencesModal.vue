<template>
  <NeroWindow
    :modal="true"
    @close="onClose"
  >
    <span
      slot="header"
      v-t="'PreferencesWindow.PreferencesModal.modalHeaderLabel'"
    />

    <div slot="body">
      <NeroTabList>
        <NeroTabItem :title="$t('PreferencesWindow.PreferencesModal.accountTabLabel')">
          <PersonalDetails />
        </NeroTabItem>
        <NeroTabItem :title="$t('PreferencesWindow.PreferencesModal.interfaceTabLabel')">
          <InterfaceDetails />
        </NeroTabItem>
        <NeroTabItem :title="$t('PreferencesWindow.PreferencesModal.notificationsTabLabel')">
          <NotificationDetails />
        </NeroTabItem>
        <NeroTabItem :title="$t('PreferencesWindow.PreferencesModal.backupTabLabel')">
          <BackupDetails />
        </NeroTabItem>
        <NeroTabItem :title="$t('PreferencesWindow.PreferencesModal.webdavTabLabel')">
          <WebdavDetails />
        </NeroTabItem>
      </NeroTabList>
    </div>
  </NeroWindow>
</template>

<script>
import NeroTabList from '@/components/Nero/NeroTabList'
import NeroTabItem from '@/components/Nero/NeroTabItem'
import NeroWindow from '@/components/Nero/NeroWindow'
import BackupDetails from '@/components/PreferencesWindow/BackupDetails'
import InterfaceDetails from '@/components/PreferencesWindow/InterfaceDetails'
import NotificationDetails from '@/components/PreferencesWindow/NotificationDetails'
import PersonalDetails from '@/components/PreferencesWindow/PersonalDetails'
import WebdavDetails from '@/components/PreferencesWindow/WebdavDetails'

export default {
  name: 'PreferencesModal',
  components: {
    NeroTabList,
    NeroTabItem,
    NeroWindow,
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
