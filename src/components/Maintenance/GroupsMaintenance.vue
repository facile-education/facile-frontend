<template>
  <div class="tab">
    <PentilaButton
      class="round"
      @click="runArchiving"
    >
      <span>{{ $t('archive') }}</span>
    </PentilaButton>

    <p>{{ $t('group-deletion') }}</p>

    <div class="group-deletion">
      <PentilaInput
        v-model="groupId"
        class="groupid"
        placeholder="group id"
        :maxlength="75"
      />
      <PentilaButton
        class="round"
        @click="deleteGroup"
      >
        <span>{{ $t('delete-group') }}</span>
      </PentilaButton>
    </div>

    <div>
      <input
        type="file"
        name="file"
        @change="fileChange($event.target.files)"
      >
      <PentilaButton
        class="round"
        @click="deleteGroups"
      >
        <span>{{ $t('delete-groups') }}</span>
      </PentilaButton>
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
      this.files = fileList
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
.group-deletion {
  display: flex;
  margin-bottom: 10px;
  .groupid {
    margin-right: 72px;
  }
}
</style>

<i18n locale="fr">
{
  "archive": "Archivage",
  "group-deletion": "Suppression de groupe(s)",
  "delete-group": "Supprimer le groupe",
  "delete-groups": "Supprimer les groupes",
  "success": "Opération terminée en succès",
  "error": "Opération terminée en erreur"
}
</i18n>
