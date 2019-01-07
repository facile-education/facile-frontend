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
          Hidden if no Messaging || (no Dropbox && no News && no Documents & no Forums & no Agenda & no Groups)
          TODO
        </NeroTabItem>
        <NeroTabItem :title="$t('PreferencesWindow.PWPreferencesModal.backupTabLabel')">
          Hidden if no Dropbox && no Documents && no Agenda
          TODO
        </NeroTabItem>
        <NeroTabItem :title="$t('PreferencesWindow.PWPreferencesModal.webdavTabLabel')">
          Hidden if no Documents
          TODO
        </NeroTabItem>
      </NeroTabList>
    </div>
  </NeroWindow>
</template>

<script>
import NeroTabList from '@/components/Nero/NeroTabList'
import NeroTabItem from '@/components/Nero/NeroTabItem'
import NeroWindow from '@/components/Nero/NeroWindow'
import PWInterfaceDetails from '@/components/PreferencesWindow/PWInterfaceDetails'
import PWPersonalDetails from '@/components/PreferencesWindow/PWPersonalDetails'

export default {
  name: 'PWPreferencesModal',
  components: {
    NeroTabList,
    NeroTabItem,
    NeroWindow,
    PWInterfaceDetails,
    PWPersonalDetails
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
