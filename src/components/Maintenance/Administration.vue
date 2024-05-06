<template>
  <div class="param-header">
    <WeprodeButton
      class="round"
      @click="runSynchro"
    >
      <span>{{ $t('Maintenance.Administration.synchro') }}</span>
    </WeprodeButton>
    <WeprodeButton
      class="round"
      @click="runParentSynchro"
    >
      <span>{{ $t('Maintenance.Administration.parentSynchro') }}</span>
    </WeprodeButton>
    <WeprodeButton
      class="round"
      @click="startFsAnalysis"
    >
      <span>{{ $t('Maintenance.Administration.startFsAnalysis') }}</span>
    </WeprodeButton>
    <WeprodeButton
      class="round"
      @click="startFsAnalysisV2"
    >
      <span>{{ $t('Maintenance.Administration.startFsAnalysisV2') }}</span>
    </WeprodeButton>
    <WeprodeButton
      class="round"
      @click="runAbsenceNotifications"
    >
      <span>{{ $t('Maintenance.Administration.runAbsenceNotifications') }}</span>
    </WeprodeButton>
  </div>
</template>

<script>

import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'

import { runAbsenceNotifications, startFsAnalysis, startFsAnalysisV2, startParentSynchro, startSynchro } from '@/api/maintenance.service'

export default {
  name: 'Administration',
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
    runSynchro () {
      startSynchro().then(
        (data) => {
          if (data.success) {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Maintenance.Administration.success'), type: 'success' })
          } else {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Maintenance.Administration.error'), type: 'error' })
          }
        }
      )
    },
    runParentSynchro () {
      startParentSynchro().then(
        (data) => {
          if (data.success) {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Maintenance.Administration.success'), type: 'success' })
          } else {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Maintenance.Administration.error'), type: 'error' })
          }
        }
      )
    },
    startFsAnalysis () {
      startFsAnalysis().then(
        (data) => {
          if (data.success) {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Maintenance.Administration.success'), type: 'success' })
          } else {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Maintenance.Administration.error'), type: 'error' })
          }
        }
      )
    },
    startFsAnalysisV2 () {
      startFsAnalysisV2().then(
        (data) => {
          if (data.success) {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Maintenance.Administration.success'), type: 'success' })
          } else {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Maintenance.Administration.error'), type: 'error' })
          }
        }
      )
    },
    runAbsenceNotifications () {
      runAbsenceNotifications().then(
        (data) => {
          if (data.success) {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Maintenance.Administration.success'), type: 'success' })
          } else {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Maintenance.Administration.error'), type: 'error' })
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
