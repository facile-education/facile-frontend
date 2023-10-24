<template>
  <div
    data-test="informationModal"
    class="information-modal"
  >
    <WeprodeWindow
      :modal="true"
      :draggable="true"
      :resizable="true"
      :full-screen="mq.phone || mq.tablet"
      :hidden-footer="true"
      @close="onClose"
    >
      <template #header>
        <span v-t="'modalHeaderLabel'" />
      </template>

      <template #body>
        <WeprodeTabList ref="tabList">
          <WeprodeTabItem
            class="tab-item"
            :title="$t('termsOfUseTabLabel')"
          >
            <TermsOfUse />
          </WeprodeTabItem>
          <WeprodeTabItem
            class="tab-item"
            :title="$t('privacyLabel')"
          >
            <Privacy />
          </WeprodeTabItem>
          <WeprodeTabItem
            class="tab-item"
            :title="$t('accessibilityLabel')"
          >
            <Accessibility />
          </WeprodeTabItem>
        </WeprodeTabList>
      </template>
    </WeprodeWindow>
  </div>
</template>

<script>
import Accessibility from '@components/Informations/Accessibility'
import Privacy from '@components/Informations/Privacy'

import WeprodeTabItem from '@/components/Base/Weprode/WeprodeTabItem.vue'
import WeprodeTabList from '@/components/Base/Weprode/WeprodeTabList.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'
import TermsOfUse from '@/components/Informations/TermsOfUse'
export default {
  name: 'InformationModal',
  components: {
    Accessibility,
    Privacy,
    TermsOfUse,
    WeprodeTabList,
    WeprodeTabItem,
    WeprodeWindow
  },
  inject: ['mq'],
  props: {
    tab: {
      type: String,
      default: 'termOfUse'
    }
  },
  emits: ['close'],
  created () {
    this.$store.dispatch('misc/incrementModalCount')
  },
  mounted () {
    this.selectTab(this.tab)
  },
  methods: {
    selectTab (tabName) {
      switch (tabName) {
        case 'termOfUse':
          this.$refs.tabList.selectTab(0)
          break
        case 'privacy':
          this.$refs.tabList.selectTab(1)
          break
        case 'accessibility':
          this.$refs.tabList.selectTab(2)
          break
        default:
          this.$refs.tabList.selectTab(0)
      }
    },
    onClose () {
      this.$store.dispatch('misc/decreaseModalCount')
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-item {
  height: calc(100% - 43px);
  overflow: auto;
}

//.full-screen {
//  .tab-item {
//    max-height: 100%
//  }
//}

</style>

<i18n locale="fr">
{
  "modalHeaderLabel": "Informations générales relatives à l'ENTA",
  "accessibilityLabel": "Accessibilité",
  "privacyLabel": "Confidentialité",
  "termsOfUseTabLabel": "CGU"
}
</i18n>
