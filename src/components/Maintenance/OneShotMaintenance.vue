<template>
  <div class="param-header">
    <WeprodeButton
      class="round"
      @click="cleanupDropboxes"
    >
      <span>{{ $t('cleanupDropboxes') }}</span>
    </WeprodeButton>
    <WeprodeButton
      class="round"
      @click="runPAuth"
    >
      <span>{{ $t('pAuth') }}</span>
    </WeprodeButton>
  </div>
</template>

<script>

import { cleanupDropboxes } from '@/api/maintenance.service'

export default {
  name: 'OneShotMaintenance',
  data () {
    return {
    }
  },
  computed: {
  },
  created () {
  },
  methods: {
    cleanupDropboxes () {
      cleanupDropboxes().then(
        (data) => {
          if (data.success) {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('success'), type: 'success' })
          } else {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('error'), type: 'error' })
          }
        }
      )
    },
    runPAuth () {
      this.$store.commit('user/setPAuth', 123456)
    }
  }
}
</script>

<style lang="scss" scoped>
.param-header {
  display: flex;
  flex-direction: column;
  .button {
    margin-left: 10px;
    margin-top: 10px;
    width: 280px;
  }
}
</style>

<i18n locale="fr">
{
  "cleanupDropboxes": "Nettoyage des casiers",
  "success": "Opération terminée en succès",
  "error": "Opération terminée en erreur",
  "pAuth": "pAuth bidon"
}
</i18n>
