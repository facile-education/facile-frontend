<template>
  <div
    data-test="informationModal"
    class="information-modal"
  >
    <PentilaWindow
      :modal="true"
      :draggable="true"
      :resizable="true"
      :full-screen="mq.phone"
      :hidden-footer="true"
      @close="onClose"
    >
      <template #header>
        <span v-t="'modalHeaderLabel'" />
      </template>

      <template #body>
        <PentilaTabList ref="tabList">
          <PentilaTabItem
            class="tab-item"
            :title="$t('versionsTabLabel')"
          >
            <VersionsDetails />
          </PentilaTabItem>
          <PentilaTabItem
            class="tab-item"
            :title="$t('termsOfUseTabLabel')"
          >
            <TermsOfUse />
          </PentilaTabItem>
          <PentilaTabItem
            class="tab-item"
            :title="$t('privacyLabel')"
          >
            <Privacy />
          </PentilaTabItem>
          <PentilaTabItem
            class="tab-item"
            :title="$t('accessibilityLabel')"
          >
            <Accessibility />
          </PentilaTabItem>
        </PentilaTabList>
      </template>
    </PentilaWindow>
  </div>
</template>

<script>
import Accessibility from '@components/Informations/Accessibility'
import Privacy from '@components/Informations/Privacy'

import TermsOfUse from '@/components/Informations/TermsOfUse'
import VersionsDetails from '@/components/Informations/VersionsDetails'

export default {
  name: 'InformationModal',
  components: {
    Accessibility,
    Privacy,
    VersionsDetails,
    TermsOfUse
  },
  inject: ['mq'],
  props: {
    tab: {
      type: String,
      default: 'version'
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
        case 'version':
          this.$refs.tabList.selectTab(0)
          break
        case 'termOfUse':
          this.$refs.tabList.selectTab(1)
          break
        case 'privacy':
          this.$refs.tabList.selectTab(2)
          break
        case 'accessibility':
          this.$refs.tabList.selectTab(3)
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
  "versionsTabLabel": "Mises à jour",
  "accessibilityLabel": "Accessibilité",
  "privacyLabel": "Confidentialité",
  "termsOfUseTabLabel": "CGU"
}
</i18n>
