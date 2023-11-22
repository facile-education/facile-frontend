<template>
  <div class="version-note-selector">
    <WeprodeSpinner
      v-if="isLoading"
      style="z-index: 1"
    />

    <div
      v-if="error === true"
      v-t="'errorPlaceholder'"
      class="placeholder"
    />

    <WeprodeDropdown
      v-if="notesList && notesList.length > 0"
      v-model="selectedNote"
      data-test="versionListDropDown"
      :list="notesList"
      :sort="false"
      :filtered="false"
      display-field="versionNoteLabel"
    />

    <div
      v-else-if="notesList"
      v-t="'emptyPlaceholder'"
      class="placeholder"
    />

    <button
      v-if="selectedNote && isAdministrator"
      data-test="buttonToggleOptions"
      :aria-label="$t('options')"
      :title="$t('options')"
      @click="toggleContextMenu"
    >
      <img
        height="16"
        width="16"
        :src="require('@/assets/icons/vertical_dots.svg')"
        alt="options"
      >
    </button>

    <teleport
      v-if="displayMenu"
      to="body"
    >
      <ContextMenu
        @choose-option="performChosenOption"
        @close="displayMenu=false"
      />
    </teleport>
  </div>
</template>

<script>
import ContextMenu from '@components/ContextMenu/ContextMenu.vue'

import { deleteVersionNote } from '@/api/versionNotes.service'
import WeprodeDropdown from '@/components/Base/Weprode/WeprodeDropdown.vue'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import { icons } from '@/constants/icons'

export default {
  name: 'VersionNoteSelector',
  components: { ContextMenu, WeprodeDropdown, WeprodeSpinner },
  emits: ['selectNote', 'update'],
  data () {
    return {
      displayMenu: false
    }
  },
  computed: {
    isAdministrator () {
      return this.$store.state.user.isAdministrator
    },
    notesList () {
      return this.$store.state.versionNotes.versionNotesList
    },
    selectedNote: {
      get () {
        return this.$store.state.versionNotes.selectedNote
      },
      set (value) {
        this.$store.dispatch('versionNotes/setSelectedNote', value)
      }
    },
    isLoading () {
      return this.$store.state.versionNotes.isLoadingVersionNotesList
    },
    error () {
      return this.$store.state.versionNotes.versionNotesListError
    }
  },
  created () {
    this.$store.dispatch('versionNotes/getVersionNotesList')
  },
  methods: {
    toggleContextMenu (event) {
      this.displayMenu = true
      this.$store.dispatch('contextMenu/openContextMenu', {
        event,
        options: [
          {
            name: 'update',
            title: this.$t('update'),
            icon: icons.options.rename,
            position: 1,
            hasSeparator: false
          },
          {
            name: 'delete',
            title: this.$t('delete'),
            icon: icons.options.delete,
            position: 2,
            hasSeparator: false
          }]
      })
    },
    performChosenOption (option) {
      switch (option.name) {
        case 'update':
          this.$emit('update')
          break
        case 'delete':
          this.confirmDeleteVersionNote()
          break
        default:
          console.error('no option with name ' + option.name + ' exists')
      }
      this.displayMenu = false
      this.$store.dispatch('contextMenu/closeMenus')
    },
    confirmDeleteVersionNote () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('deleteVersionNoteWarning'),
        lastAction: { fct: this.deleteVersionNote }
      })
    },
    deleteVersionNote () {
      // this.isLoading = true
      deleteVersionNote(this.selectedNote.versionNoteId).then((data) => {
        // this.isLoading = false
        if (data.success) {
          this.$store.dispatch('versionNotes/getVersionNotesList')
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
@import "@design";

.placeholder {
  @extend %content-placeholder;
}

.version-note-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

button {
  margin: 0;
  padding: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

</style>

<i18n locale="fr">
{
  "delete": "Supprimer",
  "deleteVersionNoteWarning": "Vous êtes sur le point de supprimer une note de version, cette action sera irréversible",
  "emptyPlaceholder": "Aucune note de version disponible",
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "options": "Options",
  "update": "Modifier"
}
</i18n>
