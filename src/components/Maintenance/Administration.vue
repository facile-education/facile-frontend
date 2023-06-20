<template>
  <div class="param-header">
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
    <PentilaButton
      class="round"
      @click="startFsAnalysis"
    >
      <span>{{ $t('startFsAnalysis') }}</span>
    </PentilaButton>
    <PentilaButton
      class="round"
      @click="startFsAnalysisV2"
    >
      <span>{{ $t('startFsAnalysisV2') }}</span>
    </PentilaButton>
    <PentilaButton
      class="round"
      @click="confirmAnonymisation"
    >
      <span>{{ $t('runAnonymisation') }}</span>
    </PentilaButton>
  </div>
</template>

<script>

import { runAnonymisation, startFsAnalysis, startFsAnalysisV2, startParentSynchro, startSynchro } from '@/api/maintenance.service'

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
    },
    startFsAnalysis () {
      startFsAnalysis().then(
        (data) => {
          if (data.success) {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('success'), type: 'success' })
          } else {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('error'), type: 'error' })
          }
        }
      )
    },
    startFsAnalysisV2 () {
      startFsAnalysisV2().then(
        (data) => {
          if (data.success) {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('success'), type: 'success' })
          } else {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('error'), type: 'error' })
          }
        }
      )
    },
    confirmAnonymisation () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('warning'),
        lastAction: { fct: this.runAnonymisation }
      })
    },
    runAnonymisation () {
      runAnonymisation().then(
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
  .button {
    margin-left: 10px;
    margin-top: 10px;
    width: 220px;
  }
}
</style>

<i18n locale="fr">
{
  "synchro": "Synchro",
  "parentSynchro": "Synchro Parents",
  "success": "Opération terminée en succès",
  "error": "Opération terminée en erreur",
  "startFsAnalysis": "Explorer le Fs",
  "startFsAnalysisV2": "Explorer les fichiers en DB",
  "runAnonymisation": "Anonymisation",
  "warning": "Sûr sûr de lancer l'anonymisation ?"
}
</i18n>
