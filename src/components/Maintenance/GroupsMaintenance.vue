<template>
  <div class="tab">
    <WeprodeButton
      class="round"
      @click="runArchiving"
    >
      <span>{{ $t('Maintenance.GroupsMaintenance.archive') }}</span>
    </WeprodeButton>

    <p>{{ $t('Maintenance.GroupsMaintenance.groupDeletion') }}</p>

    <div class="group-deletion">
      <WeprodeInput
        v-model="groupId"
        class="groupid"
        placeholder="group id"
        :maxlength="75"
      />
      <WeprodeButton
        class="round"
        @click="deleteGroup"
      >
        <span>{{ $t('Maintenance.GroupsMaintenance.deleteGroup') }}</span>
      </WeprodeButton>
    </div>

    <div>
      <input
        type="file"
        name="file"
        @change="fileChange($event.target.files)"
      >
      <WeprodeButton
        class="round"
        @click="deleteGroups"
      >
        <span>{{ $t('Maintenance.GroupsMaintenance.deleteGroups') }}</span>
      </WeprodeButton>
    </div>
  </div>
</template>

<script>

import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'

import { deleteGroup, deleteGroups, runArchiving } from '@/api/maintenance.service'
import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'

export default {
  name: 'GroupsMaintenance',
  components: { WeprodeButton, WeprodeInput },
  data () {
    return {
      groupId: undefined,
      files: []
    }
  },
  computed: {
  },
  created () {
  },
  methods: {
    fileChange (fileList) {
      this.files = fileList
    },
    runArchiving () {
      runArchiving().then(
        (data) => {
          if (data.success) {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Maintenance.GroupsMaintenance.success'), type: 'success' })
          } else {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Maintenance.GroupsMaintenance.error'), type: 'error' })
          }
        }
      )
    },
    deleteGroup () {
      deleteGroup(this.groupId).then(
        (data) => {
          if (data.success) {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Maintenance.GroupsMaintenance.success'), type: 'success' })
          } else {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Maintenance.GroupsMaintenance.error'), type: 'error' })
          }
        }
      )
    },
    deleteGroups () {
      deleteGroups(this.files[0]).then(
        (data) => {
          if (data.success) {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Maintenance.GroupsMaintenance.success'), type: 'success' })
          } else {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Maintenance.GroupsMaintenance.error'), type: 'error' })
          }
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.group-deletion {
  display: flex;
  margin-bottom: 10px;
  .groupid {
    margin-right: 72px;
  }
}
</style>
