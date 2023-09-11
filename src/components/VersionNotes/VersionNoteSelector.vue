<template>
  <div class="version-note-selector">
    <PentilaSpinner
      v-if="isLoading"
      style="z-index: 1"
    />

    <div
      v-if="error === true"
      v-t="'errorPlaceholder'"
      class="placeholder"
    />

    <PentilaDropdown
      v-if="notesList"
      v-model="selectedNote"
      data-test="versionListDropDown"
      :list="notesList"
      :sort="false"
      :filtered="false"
      display-field="versionNumber"
    />

    <div v-if="isAdministrator">
      <button
        v-t="'update'"
        @click="$emit('update')"
      />
      <button
        v-t="'delete'"
        @click="confirmDeleteVersionNote"
      />
    </div>
  </div>
</template>

<script>
import aboutService from '@/api/about.service'

export default {
  name: 'VersionNoteSelector',
  emits: ['selectNote', 'update'],
  computed: {
    isAdministrator () {
      return this.$store.state.user.isAdministrator
    },
    notesList () {
      return this.$store.state.about.versionNotesList
    },
    selectedNote: {
      get () {
        return this.$store.state.about.selectedNote
      },
      set (value) {
        this.$store.dispatch('about/setSelectedNote', value)
      }
    },
    isLoading () {
      return this.$store.state.about.isLoadingVersionList
    },
    error () {
      return this.$store.state.about.versionListError
    }
  },
  created () {
    this.$store.dispatch('about/getVersionNotesList')
  },
  methods: {
    confirmDeleteVersionNote () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('deleteVersionNoteWarning'),
        lastAction: { fct: this.deleteVersionNote }
      })
    },
    deleteVersionNote () {
      // this.isLoading = true
      aboutService.deleteVersionNote(this.selectedNote.versionId).then((data) => {
        // this.isLoading = false
        if (data.success) {
          this.$store.dispatch('about/getVersionNotesList')
          // this.error = false
        } else {
          console.error('Cannot delete version note ', this.selectedNote)
          // this.error = true
        }
      }, (err) => {
        // this.error = err
        console.error(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.version-note-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

</style>

<i18n locale="fr">
{
  "delete": "Supprimer",
  "deleteVersionNoteWarning": "Vous êtes sur le point de supprimer une note de version, cette action sera irréversible",
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "update": "Modifier"
}
</i18n>
