<template>
  <div class="param-header">
    <WeprodeButton
      class="round"
      @click="cleanupObsoleteFolders"
    >
      <span>{{ $t('Maintenance.OneShotMaintenance.cleanupObsoleteFolders') }}</span>
    </WeprodeButton>
    <WeprodeButton
      class="round"
      @click="runDataFeed"
    >
      <span>{{ $t('Maintenance.OneShotMaintenance.runDataFeed') }}</span>
    </WeprodeButton>
    <WeprodeButton
      class="round"
      @click="runPAuth"
    >
      <span>{{ $t('Maintenance.OneShotMaintenance.pAuth') }}</span>
    </WeprodeButton>
    <WeprodeButton
      class="round"
      @click="setNewsPermissions"
    >
      <span>{{ $t('Maintenance.OneShotMaintenance.setNewsPermissions') }}</span>
    </WeprodeButton>
    <div>
      <input
        type="file"
        name="file"
        @change="fileChange($event.target.files)"
      >
      <WeprodeButton
        class="round"
        @click="deleteFolders"
      >
        <span>{{ $t('Maintenance.OneShotMaintenance.delete-folders') }}</span>
      </WeprodeButton>
    </div>
    <WeprodeButton
      class="round"
      @click="setCoursePermissions"
    >
      <span>{{ $t('Maintenance.OneShotMaintenance.setCoursePermissions') }}</span>
    </WeprodeButton>
  </div>
</template>

<script>
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'

import { cleanupObsoleteFolders, deleteFolders, setCoursePermissions, setNewsPermissions } from '@/api/maintenance.service'

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
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Maintenance.OneShotMaintenance.success'), type: 'success' })
          } else {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Maintenance.OneShotMaintenance.error'), type: 'error' })
          }
        }
      )
    },
    setNewsPermissions () {
      setNewsPermissions().then(
        (data) => {
          if (data.success) {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Maintenance.OneShotMaintenance.success'), type: 'success' })
          } else {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Maintenance.OneShotMaintenance.error'), type: 'error' })
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
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Maintenance.OneShotMaintenance.success'), type: 'success' })
          } else {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Maintenance.OneShotMaintenance.error'), type: 'error' })
          }
        }
      )
    },
    setCoursePermissions () {
      setCoursePermissions().then(
        (data) => {
          if (data.success) {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Maintenance.OneShotMaintenance.success'), type: 'success' })
          } else {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Maintenance.OneShotMaintenance.error'), type: 'error' })
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
