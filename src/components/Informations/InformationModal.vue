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
      @close="onClose"
    >
      <template #header>
        <span v-t="'modalHeaderLabel'" />
      </template>

      <template #body>
        <PentilaTabList>
          <PentilaTabItem :title="$t('versionsTabLabel')">
            <VersionsDetails />
          </PentilaTabItem>
          <PentilaTabItem :title="$t('termsOfUseTabLabel')">
            <TermsOfUse />
          </PentilaTabItem>
          <PentilaTabItem :title="$t('privacyLabel')">
            <Privacy />
          </PentilaTabItem>
          <PentilaTabItem :title="$t('accessibilityLabel')">
            <Accessibility />
          </PentilaTabItem>
        </PentilaTabList>
      </template>
    </PentilaWindow>
  </div>
</template>

<script>
import VersionsDetails from '@/components/Informations/VersionsDetails'
import TermsOfUse from '@/components/Informations/TermsOfUse'
import Privacy from '@components/Informations/Privacy'
import Accessibility from '@components/Informations/Accessibility'

export default {
  name: 'InformationModal',
  components: {
    Accessibility,
    Privacy,
    VersionsDetails,
    TermsOfUse
  },
  inject: ['mq'],
  emits: ['close'],
  methods: {
    onClose () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" >
.information-modal {
  .window-body {
    .tab-content {
      height: calc(100% - 55px);
    }
  }
}

</style>

<i18n locale="fr">
{
  "modalHeaderLabel": "Informations générales relatives à l'ENT",
  "versionsTabLabel": "Mises à jour",
  "accessibilityLabel": "Accessibilité",
  "privacyLabel": "Confidentialité",
  "termsOfUseTabLabel": "Charte d'utilisation"
}
</i18n>
