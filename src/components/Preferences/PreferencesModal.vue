<template>
  <WeprodeWindow
    class="preferences-modal"
    :modal="true"
    :full-screen="mq.phone || mq.tablet"
    :width="600"
    @close="close"
  >
    <template #header>
      <span v-t="'modalHeaderLabel'" />
    </template>

    <template #body>
      <WeprodeTabList ref="tabList">
        <WeprodeTabItem :title="$t('accountTabLabel')">
          <AccountTab @save="updateInfoLabel" />
        </WeprodeTabItem>
        <WeprodeTabItem :title="$t('messagingTabLabel')">
          <MessagingTab @save="updateInfoLabel" />
        </WeprodeTabItem>
      </WeprodeTabList>
    </template>

    <template #footer>
      <i>{{ infoLabel }}</i>
    </template>
  </WeprodeWindow>
</template>

<script>
import dayjs from 'dayjs'
import { defineAsyncComponent } from 'vue'

import WeprodeTabItem from '@/components/Base/Weprode/WeprodeTabItem.vue'
import WeprodeTabList from '@/components/Base/Weprode/WeprodeTabList.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'
const AccountTab = defineAsyncComponent(() => import('@/components/Preferences/AccountTab'))
const MessagingTab = defineAsyncComponent(() => import('@/components/Preferences/MessagingTab'))
export default {
  name: 'PreferencesModal',
  components: {
    MessagingTab,
    AccountTab,
    WeprodeTabList,
    WeprodeTabItem,
    WeprodeWindow
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

<style lang="scss">
.preferences-modal {
  .window-body {
    overflow: visible !important;
  }
}
</style>

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
