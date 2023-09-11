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
      display-field="versionNoteLabel"
    />

    <button
      v-if="isAdministrator"
      :aria-label="$t('options')"
      :title="$t('options')"
      @click="toggleContextMenu"
    >
      <img
        height="20"
        width="20"
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

import aboutService from '@/api/about.service'
import { icons } from '@/constants/icons'

export default {
  name: 'VersionNoteSelector',
  components: { ContextMenu },
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
      return this.$store.state.about.isLoadingVersionNotesList
    },
    error () {
      return this.$store.state.about.versionNotesListError
    }
  },
  created () {
    this.$store.dispatch('about/getVersionNotesList')
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
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "options": "Options",
  "update": "Modifier"
}
</i18n>
