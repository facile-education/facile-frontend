<template>
  <PentilaWindow
    :modal="true"
    @close="close()"
  >
    <template #header>
      <span v-t="'modalHeaderLabel'" />
    </template>

    <template #body>
      <PentilaTabList>
        <PentilaTabItem :title="$t('accountTabLabel')">
          <AccountTab />
        </PentilaTabItem>
        <PentilaTabItem :title="$t('messagingTabLabel')">
          <MessagingTab />
        </PentilaTabItem>
        <!--        <PentilaTabItem :title="$t('accountTabLabel')">-->
        <!--          <PersonalDetails />-->
        <!--        </PentilaTabItem>-->
        <!--        <PentilaTabItem :title="$t('interfaceTabLabel')">-->
        <!--          <InterfaceDetails />-->
        <!--        </PentilaTabItem>-->
        <!--        <PentilaTabItem :title="$t('notificationsTabLabel')">-->
        <!--          <NotificationDetails />-->
        <!--        </PentilaTabItem>-->
        <!--        <PentilaTabItem :title="$t('backupTabLabel')">-->
        <!--          <BackupDetails />-->
        <!--        </PentilaTabItem>-->
        <!--        <PentilaTabItem :title="$t('webdavTabLabel')">-->
        <!--          <WebdavDetails />-->
        <!--        </PentilaTabItem>-->
      </PentilaTabList>
    </template>
  </PentilaWindow>
</template>

<script>
import { defineAsyncComponent } from 'vue'
const AccountTab = defineAsyncComponent(() => import('@/components/Preferences/AccountTab'))
const MessagingTab = defineAsyncComponent(() => import('@/components/Preferences/MessagingTab'))
// import PersonalDetails from '@/components/Preferences/PersonalDetails'
// const BackupDetails = defineAsyncComponent(() => import('@/components/Preferences/BackupDetails'))
// const InterfaceDetails = defineAsyncComponent(() => import('@/components/Preferences/InterfaceDetails'))
// const NotificationDetails = defineAsyncComponent(() => import('@/components/Preferences/NotificationDetails'))
// const WebdavDetails = defineAsyncComponent(() => import('@/components/Preferences/WebdavDetails'))

export default {
  name: 'PreferencesModal',
  components: {
    MessagingTab,
    AccountTab
    // BackupDetails,
    // InterfaceDetails,
    // NotificationDetails,
    // PersonalDetails,
    // WebdavDetails
  },
  props: {
    tab: {
      type: String,
      default: 'parameters'
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')
  },
  methods: {
    close () {
      this.$store.dispatch('misc/decreaseModalCount')
      this.$store.dispatch('messaging/closeParametersModal')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

<i18n locale="fr">
{
  "accountTabLabel": "Mon compte",
  "backupTabLabel": "Sauvegarde",
  "interfaceTabLabel": "Interface",
  "messagingTabLabel": "Messagerie",
  "modalHeaderLabel": "Préférences",
  "notificationsTabLabel": "Notifications",
  "webdavTabLabel": "WebDAV"
}
</i18n>
