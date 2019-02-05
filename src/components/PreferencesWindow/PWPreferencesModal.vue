<template>
  <NeroWindow
    :modal="true"
    @close="onClose"
  >
    <span
      slot="header"
      v-t="'PreferencesWindow.PWPreferencesModal.modalHeaderLabel'"
    />

    <div slot="body">
      <NeroTabList>
        <NeroTabItem :title="$t('PreferencesWindow.PWPreferencesModal.accountTabLabel')">
          <PWPersonalDetails />
        </NeroTabItem>
        <NeroTabItem :title="$t('PreferencesWindow.PWPreferencesModal.interfaceTabLabel')">
          <PWInterfaceDetails />
        </NeroTabItem>
        <NeroTabItem :title="$t('PreferencesWindow.PWPreferencesModal.notificationsTabLabel')">
          <PWNotificationDetails />
        </NeroTabItem>
        <NeroTabItem :title="$t('PreferencesWindow.PWPreferencesModal.backupTabLabel')">
          <PWBackupDetails />
        </NeroTabItem>
        <NeroTabItem :title="$t('PreferencesWindow.PWPreferencesModal.webdavTabLabel')">
          <PWWebdavDetails />
        </NeroTabItem>
      </NeroTabList>
    </div>
  </NeroWindow>
</template>

<script>
import NeroTabList from '@/components/Nero/NeroTabList'
import NeroTabItem from '@/components/Nero/NeroTabItem'
import NeroWindow from '@/components/Nero/NeroWindow'
import PWBackupDetails from '@/components/PreferencesWindow/PWBackupDetails'
import PWInterfaceDetails from '@/components/PreferencesWindow/PWInterfaceDetails'
import PWNotificationDetails from '@/components/PreferencesWindow/PWNotificationDetails'
import PWPersonalDetails from '@/components/PreferencesWindow/PWPersonalDetails'
import PWWebdavDetails from '@/components/PreferencesWindow/PWWebdavDetails'

export default {
  name: 'PWPreferencesModal',
  components: {
    NeroTabList,
    NeroTabItem,
    NeroWindow,
    PWBackupDetails,
    PWInterfaceDetails,
    PWNotificationDetails,
    PWPersonalDetails,
    PWWebdavDetails
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
