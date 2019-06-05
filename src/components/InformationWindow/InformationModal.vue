<template>
  <div data-test="informationModal">
    <NeroWindow
      :modal="true"
      @close="onClose"
    >
      <span
        slot="header"
        v-t="'InformationWindow.InformationModal.modalHeaderLabel'"
      />

      <div slot="body">
        <NeroTabList>
          <NeroTabItem :title="$t('InformationWindow.InformationModal.versionsTabLabel')">
            <VersionsDetails />
          </NeroTabItem>
          <NeroTabItem :title="$t('InformationWindow.InformationModal.termsOfUseTabLabel')">
            <TermsOfUse />
          </NeroTabItem>
        </NeroTabList>
      </div>
    </NeroWindow>
  </div>
</template>

<script>
import NeroWindow from '@/components/Nero/NeroWindow'
import NeroTabList from '@/components/Nero/NeroTabList'
import NeroTabItem from '@/components/Nero/NeroTabItem'
import VersionsDetails from '@/components/InformationWindow/VersionsDetails'
import TermsOfUse from '@/components/InformationWindow/TermsOfUse'

export default {
  name: 'InformationModal',
  components: {
    NeroTabList,
    NeroTabItem,
    NeroWindow,
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
