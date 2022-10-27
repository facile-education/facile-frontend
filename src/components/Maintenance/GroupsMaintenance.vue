<template>
  <div class="tab">
    <PentilaButton
      class="round"
      @click="runArchiving"
    >
      <span>{{ $t('archive') }}</span>
    </PentilaButton>
  </div>
</template>

<script>

import runArchiving from '@/api/maintenance.service'

export default {
  name: 'GroupsMaintenance',
  data () {
    return {
    }
  },
  computed: {
  },
  created () {
  },
  methods: {
    runArchiving () {
      runArchiving().then(
        (data) => {
          if (data.success) {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('success'), type: 'success' })
          } else {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('error'), type: 'error' })
          }
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

<i18n locale="fr">
{
  "archive": "Archivage",
  "success": "Archivage terminé en succès",
  "error": "Archivage terminé en erreur"
}
</i18n>
