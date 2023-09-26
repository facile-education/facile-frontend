<template>
  <PentilaWindow
    :modal="true"
    :full-screen="mq.phone || mq.tablet"
    :width="600"
    @close="close"
  >
    <template #header>
      <span v-t="'modalHeaderLabel'" />
    </template>

    <template #body>
      <PentilaTabList ref="tabList">
        <PentilaTabItem :title="$t('accountTabLabel')">
          <AccountTab @save="updateInfoLabel" />
        </PentilaTabItem>
        <PentilaTabItem :title="$t('messagingTabLabel')">
          <MessagingTab @save="updateInfoLabel" />
        </PentilaTabItem>
      </PentilaTabList>
    </template>

    <template #footer>
      <i>{{ infoLabel }}</i>
    </template>
  </PentilaWindow>
</template>

<script>
import dayjs from 'dayjs'
import { defineAsyncComponent } from 'vue'
const AccountTab = defineAsyncComponent(() => import('@/components/Preferences/AccountTab'))
const MessagingTab = defineAsyncComponent(() => import('@/components/Preferences/MessagingTab'))

export default {
  name: 'PreferencesModal',
  components: {
    MessagingTab,
    AccountTab
  },
  inject: ['mq'],
  props: {
    tab: {
      type: String,
      default: 'account'
    }
  },
  data () {
    return {
      infoLabel: undefined
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
    },
    updateInfoLabel () {
      this.infoLabel = this.$t('infoLabel') + dayjs().format('HH:mm')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

<i18n locale="fr">
{
  "accountTabLabel": "Mon compte",
  "infoLabel": "Paramètres enregistrés - ",
  "messagingTabLabel": "Messagerie",
  "modalHeaderLabel": "Préférences"
}
</i18n>
