<template>
  <div data-test="informationModal">
    <PentilaWindow
      :modal="true"
      @close="onClose"
    >
      <span
        slot="header"
        v-t="'InformationWindow.InformationModal.modalHeaderLabel'"
      />

      <div slot="body">
        <PentilaTabList>
          <PentilaTabItem :title="$t('InformationWindow.InformationModal.versionsTabLabel')">
            <VersionsDetails />
          </PentilaTabItem>
          <PentilaTabItem :title="$t('InformationWindow.InformationModal.termsOfUseTabLabel')">
            <TermsOfUse />
          </PentilaTabItem>
        </PentilaTabList>
      </div>
    </PentilaWindow>
  </div>
</template>

<script>
import VersionsDetails from '@/components/InformationWindow/VersionsDetails'
import TermsOfUse from '@/components/InformationWindow/TermsOfUse'

export default {
  name: 'InformationModal',
  components: {
    VersionsDetails,
    TermsOfUse
  },
  methods: {
    onClose () {
      this.$store.dispatch('nero/closeInformationModal')
    }
  }
}
</script>
