<template>
  <PentilaWindow
    :modal="true"
    @close="close"
  >
    <template #header>
      <span v-t="'modalHeaderLabel'" />
    </template>

    <template #body>
      <PentilaTabList ref="tabList">
        <PentilaTabItem :title="$t('accountTabLabel')">
          <AccountTab />
        </PentilaTabItem>
        <PentilaTabItem :title="$t('messagingTabLabel')">
          <MessagingTab />
        </PentilaTabItem>
      </PentilaTabList>
    </template>
  </PentilaWindow>
</template>

<script>
import { defineAsyncComponent } from 'vue'
const AccountTab = defineAsyncComponent(() => import('@/components/Preferences/AccountTab'))
const MessagingTab = defineAsyncComponent(() => import('@/components/Preferences/MessagingTab'))

export default {
  name: 'PreferencesModal',
  components: {
    MessagingTab,
    AccountTab
  },
  props: {
    tab: {
      type: String,
      default: 'account'
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')
  },
  mounted () {
    this.selectTab(this.tab)
  },
  methods: {
    selectTab (tabName) {
      if (tabName === 'account') {
        this.$refs.tabList.selectTab(0)
      } else {
        this.$refs.tabList.selectTab(1)
      }
    },
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
