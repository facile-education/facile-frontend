<template>
  <div class="param-header">
    <PentilaButton
      class="round"
      @click="runPermissions"
    >
      <span>{{ $t('permissions') }}</span>
    </PentilaButton>
    <PentilaButton
      class="round"
      @click="runPAuth"
    >
      <span>{{ $t('pAuth') }}</span>
    </PentilaButton>
  </div>
</template>

<script>

import { runPermissions } from '@/api/maintenance.service'

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
    runPermissions () {
      runPermissions().then(
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
  "permissions": "Mise à jour des permissions",
  "success": "Opération terminée en succès",
  "error": "Opération terminée en erreur",
  "pAuth": "pAuth bidon"
}
</i18n>
