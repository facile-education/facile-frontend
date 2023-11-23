<template>
  <div class="param-header">
    <WeprodeButton
      class="round"
      @click="cleanupObsoleteFolders"
    >
      <span>{{ $t('cleanupObsoleteFolders') }}</span>
    </WeprodeButton>
    <WeprodeButton
      class="round"
      @click="runDataFeed"
    >
      <span>{{ $t('runDataFeed') }}</span>
    </WeprodeButton>
    <WeprodeButton
      class="round"
      @click="runPAuth"
    >
      <span>{{ $t('pAuth') }}</span>
    </WeprodeButton>
    <WeprodeButton
      class="round"
      @click="setNewsPermissions"
    >
      <span>{{ $t('setNewsPermissions') }}</span>
    </WeprodeButton>
  </div>
</template>

<script>
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'

import { cleanupObsoleteFolders, runDataFeed, setNewsPermissions } from '@/api/maintenance.service'

export default {
  name: 'OneShotMaintenance',
  components: { WeprodeButton },
  data () {
    return {
    }
  },
  computed: {
  },
  created () {
  },
  methods: {
    cleanupObsoleteFolders () {
      cleanupObsoleteFolders().then(
        (data) => {
          if (data.success) {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('success'), type: 'success' })
          } else {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('error'), type: 'error' })
          }
        }
      )
    },
    runDataFeed () {
      runDataFeed().then(
        (data) => {
          if (data.success) {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('success'), type: 'success' })
          } else {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('error'), type: 'error' })
          }
        }
      )
    },
    setNewsPermissions () {
      setNewsPermissions().then(
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
  "cleanupObsoleteFolders": "Nettoyage des dossiers obsoletes (tmp images et sending boxes)",
  "success": "Opération terminée en succès",
  "error": "Opération terminée en erreur",
  "pAuth": "pAuth bidon",
  "runDataFeed": "Alimentation des données (intégration uniquement)",
  "setNewsPermissions": "Permissions des PJ de news"
}
</i18n>
