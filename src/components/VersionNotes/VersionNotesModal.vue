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
        class="note-selector"
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
        v-if="versionNoteDetails"
        class="version-note-details"
        v-html="versionNoteDetails"
      />

      <teleport
        v-if="isAdministrator && isSaveNoteVersionModalDisplayed"
        to="body"
      >
        <SaveVersionNoteModal
          :is-creation="isCreation"
          @close="isSaveNoteVersionModalDisplayed = false"
        />
      </teleport>
    </template>
  </PentilaWindow>
</template>

<script>
import NeroIcon from '@components/Nero/NeroIcon.vue'
import VersionNoteSelector from '@components/VersionNotes/VersionNoteSelector.vue'
import { defineAsyncComponent } from 'vue'
const SaveVersionNoteModal = defineAsyncComponent(() => import('@components/VersionNotes/SaveVersionNoteModal.vue'))

export default {
  name: 'VersionNotesModal',
  components: { SaveVersionNoteModal, VersionNoteSelector, NeroIcon },
  inject: ['mq'],
  emits: ['close'],
  data () {
    return {
      isCreation: false,
      isSaveNoteVersionModalDisplayed: false
    }
  },
  computed: {
    isAdministrator () {
      return this.$store.state.user.isAdministrator
    },
    versionNoteDetails () {
      return this.$store.state.versionNotes.versionNoteDetails
    },
    isLoading () {
      return this.$store.state.versionNotes.isLoadingVersionNoteDetails
    },
    error () {
      return this.$store.state.versionNotes.versionNoteDetailsError
    }
  },
  methods: {
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

.create-button, .note-selector {
  margin-bottom: 1rem;
}

</style>

<i18n locale="fr">
{
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "new": "Nouveau",
  "versionNotesHeader": "Nouveautés dans votre ENTA"
}
</i18n>
