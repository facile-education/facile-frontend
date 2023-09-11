<template>
  <PentilaWindow
    :modal="true"
    :draggable="true"
    :full-screen="mq.phone"
    :hidden-footer="true"
    class="version-note-modal"
    :class="{'phone': mq.phone}"
    @close="$emit('close')"
  >
    <template #header>
      <span v-t="'versionNotesHeader'" />
    </template>

    <template #body>
      <PentilaButton
        v-if="isAdministrator"
        class="create-button"
        @click="openCreateVersionNoteModal"
      >
        <NeroIcon
          name="fa-plus"
        />
        <span>{{ $t('new') }}</span>
      </PentilaButton>

      <VersionNoteSelector
        @select-note="selectNote"
        @update="openUpdateVersionNoteModal"
      />

      <PentilaSpinner
        v-if="isLoading"
        style="z-index: 1"
      />

      <div
        v-if="error === true"
        v-t="'errorPlaceholder'"
        class="placeholder"
      />

      <div
        class="version-note-details"
        v-html="versionNoteDetails"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import NeroIcon from '@components/Nero/NeroIcon.vue'
import VersionNoteSelector from '@components/VersionNotes/VersionNoteSelector.vue'

import aboutService from '@/api/about.service'

export default {
  name: 'VersionNotesModal',
  components: { VersionNoteSelector, NeroIcon },
  inject: ['mq'],
  emits: ['close'],
  data () {
    return {
      selectedNote: undefined,
      isLoading: false,
      error: false,
      versionNoteDetails: undefined,
      isCreation: false,
      isSaveNoteVersionModalDisplayed: false
    }
  },
  computed: {
    isAdministrator () {
      return this.$store.state.user.isAdministrator
    }
  },
  methods: {
    selectNote (versionNote) {
      this.selectedNote = versionNote
      this.getVersionNoteDetails()
    },
    getVersionNoteDetails () {
      this.isLoading = true
      aboutService.getVersionDetails(this.selectedNote.versionId).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.error = false
          this.versionNoteDetails = data.versionDetails
        } else {
          this.error = true
          console.error('Cannot get versionNote details for versionNote', this.selectedNote)
        }
      }, (err) => {
        this.isLoading = false
        this.error = err
        console.error(err)
      })
    },
    openCreateVersionNoteModal () {
      this.isCreation = true
      this.isSaveNoteVersionModalDisplayed = true
    },
    openUpdateVersionNoteModal () {
      this.isCreation = false
      this.isSaveNoteVersionModalDisplayed = true
    }
  }
}
</script>

<style lang="scss">
.version-note-modal {
  &:not(.phone) {
    .window-body {
      overflow: visible !important;

      .version-note-details {
        max-height: 55vh;
        overflow-y: auto;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
@import "@design";

.create-button {
  @extend %create-button;
}

</style>

<i18n locale="fr">
{
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "new": "Nouveau",
  "versionNotesHeader": "Nouveautés dans votre ENTA"
}
</i18n>
