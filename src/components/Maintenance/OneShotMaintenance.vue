<template>
  <div class="param-header">
    <PentilaButton
      class="round"
      @click="cleanupDropboxes"
    >
      <span>{{ $t('cleanupDropboxes') }}</span>
    </PentilaButton>
    <PentilaButton
      class="round"
      @click="runPAuth"
    >
      <span>{{ $t('pAuth') }}</span>
    </PentilaButton>
    <PentilaButton
      class="round"
      @click="setNewsPermissions"
    >
      <span>{{ $t('setNewsPermissions') }}</span>
    </PentilaButton>
    <div>
      <input
        type="file"
        name="file"
        @change="fileChange($event.target.files)"
      >
      <PentilaButton
        class="round"
        @click="deleteFolders"
      >
        <span>{{ $t('delete-folders') }}</span>
      </PentilaButton>
    </div>
  </div>
</template>

<script>

import { cleanupDropboxes, deleteFolders, setNewsPermissions } from '@/api/maintenance.service'

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
    },
    fileChange (fileList) {
      this.files = fileList
    },
    deleteFolders () {
      deleteFolders(this.files[0]).then(
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
  "pAuth": "pAuth bidon",
  "setNewsPermissions": "Permissions des PJ de news",
  "delete-folders": "Supprimer les dossiers",
}
</i18n>
