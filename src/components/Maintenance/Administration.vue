<template>
  <div class="param-header">
    <PentilaButton
      class="round"
      @click="runMessageMigration"
    >
      <span>{{ $t('message-migration') }}</span>
    </PentilaButton>
  </div>
</template>

<script>

import { runMessageMigration } from '@/api/maintenance.service'

export default {
  name: 'Administration',
  data () {
    return {
    }
  },
  computed: {
  },
  created () {
  },
  methods: {
    runMessageMigration () {
      runMessageMigration().then(
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
  "message-migration": "Migration des messages",
  "success": "Migration terminée en succès",
  "error": "Migration terminée en erreur"
}
</i18n>
