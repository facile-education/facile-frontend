<template>
  <div class="tab">
    <PentilaButton
      class="round"
      @click="runArchiving"
    >
      <span>{{ $t('archive') }}</span>
    </PentilaButton>

    <div>
      <PentilaInput
        v-model="groupId"
        placeholder="group id"
        :maxlength="75"
      />
      <button
        type="button"
        @click="deleteGroup"
      >
        Supprimer le groupe
      </button>
    </div>

    <div>
      <input
        type="file"
        name="file"
        @change="fileChange($event.target.files)"
      >
      <button
        type="button"
        @click="deleteGroups"
      >
        delete groups
      </button>
    </div>
  </div>
</template>

<script>

import { runArchiving, deleteGroup, deleteGroups } from '@/api/maintenance.service'

export default {
  name: 'GroupsMaintenance',
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
      this.files = new FormData()
      this.files.append('file', fileList[0], fileList[0].name)
    },
    runArchiving () {
      runArchiving().then(
        (data) => {
          if (data.success) {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('success'), type: 'success' })
          } else {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('error'), type: 'error' })
          }
        }
      )
    },
    deleteGroup () {
      deleteGroup(this.groupId).then(
        (data) => {
          if (data.success) {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('success'), type: 'success' })
          } else {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('error'), type: 'error' })
          }
        }
      )
    },
    deleteGroups () {
      deleteGroups(this.files[0]).then(
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
  "archive": "Archivage",
  "success": "Archivage terminé en succès",
  "error": "Archivage terminé en erreur"
}
</i18n>
