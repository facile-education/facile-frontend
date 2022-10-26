<template>
  <PentilaWindow
    :modal="true"
  >
    <template #header>
      <span v-t="'modalHeaderLabel'" />
    </template>

    <template #body>
      <PentilaTabList>
        <PentilaTabItem :title="$t('accountTabLabel')">
          <PersonalDetails />
        </PentilaTabItem>
        <PentilaTabItem :title="$t('interfaceTabLabel')">
          <InterfaceDetails />
        </PentilaTabItem>
        <PentilaTabItem :title="$t('notificationsTabLabel')">
          <NotificationDetails />
        </PentilaTabItem>
        <PentilaTabItem :title="$t('backupTabLabel')">
          <BackupDetails />
        </PentilaTabItem>
        <PentilaTabItem :title="$t('webdavTabLabel')">
          <WebdavDetails />
        </PentilaTabItem>
      </PentilaTabList>
    </template>
  </PentilaWindow>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import PersonalDetails from '@/components/Preferences/PersonalDetails'

const BackupDetails = defineAsyncComponent(() => import('@/components/Preferences/BackupDetails'))
const InterfaceDetails = defineAsyncComponent(() => import('@/components/Preferences/InterfaceDetails'))
const NotificationDetails = defineAsyncComponent(() => import('@/components/Preferences/NotificationDetails'))
const WebdavDetails = defineAsyncComponent(() => import('@/components/Preferences/WebdavDetails'))

export default {
  name: 'PreferencesModal',
  components: {
    BackupDetails,
    InterfaceDetails,
    NotificationDetails,
    PersonalDetails,
    WebdavDetails
  }
}
</script>

<style lang="scss" scoped>

</style>

<i18n locale="fr">
{
  "accountTabLabel": "Mon Compte",
  "backupTabLabel": "Sauvegarde",
  "interfaceTabLabel": "Interface",
  "modalHeaderLabel": "Préférences",
  "notificationsTabLabel": "Notifications",
  "webdavTabLabel": "WebDAV"
}
</i18n>
