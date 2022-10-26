<template>
  <div data-test="informationModal">
    <PentilaWindow
      :modal="true"
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
        </PentilaTabList>
      </template>
    </PentilaWindow>
  </div>
</template>

<script>
import VersionsDetails from '@/components/Informations/VersionsDetails'
import TermsOfUse from '@/components/Informations/TermsOfUse'

export default {
  name: 'InformationModal',
  components: {
    VersionsDetails,
    TermsOfUse
  },
  emits: ['close'],
  methods: {
    onClose () {
      this.$emit('close')
    }
  }
}
</script>

<i18n locale="fr">
{
  "modalHeaderLabel": "Informations générales relatives à l'ENT",
  "versionsTabLabel": "Mises à jour",
  "termsOfUseTabLabel": "Charte d'utilisation"
}
</i18n>
