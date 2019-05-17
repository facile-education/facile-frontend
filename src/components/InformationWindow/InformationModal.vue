<template>
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
        <NeroTabItem :title="$t('InformationWindow.InformationModal.updatesTabLabel')">
          <UpdatesDetails />
        </NeroTabItem>
        <NeroTabItem :title="$t('InformationWindow.InformationModal.termsOfUseTabLabel')">
          <TermsOfUse />
        </NeroTabItem>
      </NeroTabList>
    </div>
  </NeroWindow>
</template>

<script>
import NeroWindow from '@/components/Nero/NeroWindow'
import NeroTabList from '@/components/Nero/NeroTabList'
import NeroTabItem from '@/components/Nero/NeroTabItem'
import UpdatesDetails from '@/components/InformationWindow/UpdatesDetails'
import TermsOfUse from '@/components/InformationWindow/TermsOfUse'

export default {
  name: 'InformationModal',
  components: {
    NeroTabList,
    NeroTabItem,
    NeroWindow,
    UpdatesDetails,
    TermsOfUse
  },
  methods: {
    onClose () {
      this.$store.dispatch('nero/closeInformationModal')
    }
  }
}
</script>
