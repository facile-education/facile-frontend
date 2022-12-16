<template>
  <div class="param-header">
    <PentilaButton
      class="round"
      @click="runMessageMigration"
    >
      <span>{{ $t('message-migration') }}</span>
    </PentilaButton>
    <PentilaButton
      class="round"
      @click="runSynchro"
    >
      <span>{{ $t('synchro') }}</span>
    </PentilaButton>
    <PentilaButton
      class="round"
      @click="runParentSynchro"
    >
      <span>{{ $t('parentSynchro') }}</span>
    </PentilaButton>
  </div>
</template>

<script>

import { runMessageMigration, startSynchro, startParentSynchro } from '@/api/maintenance.service'

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
    },
    runSynchro () {
      startSynchro().then(
        (data) => {
          if (data.success) {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('success'), type: 'success' })
          } else {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('error'), type: 'error' })
          }
        }
      )
    },
    runParentSynchro () {
      startParentSynchro().then(
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
.param-header {
  display: flex;
  flex-direction: column;
  width: 150px;
}
</style>

<i18n locale="fr">
{
  "message-migration": "Migration des messages",
  "synchro": "Synchro",
  "parentSynchro": "Synchro Parents",
  "success": "Migration terminée en succès",
  "error": "Migration terminée en erreur"
}
</i18n>
