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
      data-test="versionListDropDown"
      :model-value="selectedNote"
      :list="notesList"
      :sort="false"
      :filtered="false"
      display-field="versionNumber"
      @update:model-value="selectNote"
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
  data () {
    return {
      isLoading: false,
      error: false,
      notesList: undefined,
      selectedNote: undefined
    }
  },
  computed: {
    isAdministrator () {
      return this.$store.state.user.isAdministrator
    }
  },
  created () {
    this.getNotesList()
  },
  methods: {
    getNotesList () {
      this.isLoading = true
      aboutService.getVersionList().then((data) => {
        this.isLoading = false
        if (data.success) {
          this.notesList = data.versions
          this.selectedNote(data.versions[0]) // Assume notes are sorted by date
          this.error = false
        } else {
          console.error('Cannot get notes versions list')
          this.error = true
        }
      }, (err) => {
        this.error = err
        console.error(err)
      })
    },
    confirmDeleteVersionNote () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('deleteVersionNoteWarning'),
        lastAction: { fct: this.deleteVersionNote }
      })
    },
    selectNote (note) {
      this.selectedNote = note
      this.$emit('selectNote', note)
    },
    deleteVersionNote () {
      this.isLoading = true
      aboutService.deleteVersionNote(this.selectedNote.versionId).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.getNotesList()
          this.error = false
        } else {
          console.error('Cannot delete version note ', this.selectedNote)
          this.error = true
        }
      }, (err) => {
        this.error = err
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
