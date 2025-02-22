<template>
  <WeprodeWindow
    :modal="true"
    :draggable="true"
    :full-screen="mq.phone || mq.tablet"
    :hidden-footer="true"
    class="version-note-modal"
    data-test="versionNoteModal"
    :class="{'phone': mq.phone || mq.tablet}"
    @close="$emit('close')"
  >
    <template #header>
      <span v-t="'VersionNotes.VersionNotesModal.versionNotesHeader'" />
    </template>

    <template #body>
      <WeprodeButton
        v-if="isAdministrator"
        class="create-button"
        @click="openCreateVersionNoteModal"
      >
        <CustomIcon icon-name="icon-plus" />
        <span>{{ $t('VersionNotes.VersionNotesModal.new') }}</span>
      </WeprodeButton>

      <VersionNoteSelector
        class="note-selector"
        @update="openUpdateVersionNoteModal"
      />

      <WeprodeSpinner
        v-if="isLoading"
        style="z-index: 1"
      />

      <div
        v-if="error === true"
        v-t="'VersionNotes.VersionNotesModal.errorPlaceholder'"
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
  </WeprodeWindow>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'
import VersionNoteSelector from '@components/VersionNotes/VersionNoteSelector.vue'
import { defineAsyncComponent } from 'vue'

import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'
const SaveVersionNoteModal = defineAsyncComponent(() => import('@components/VersionNotes/SaveVersionNoteModal.vue'))

export default {
  name: 'VersionNotesModal',
  components: { CustomIcon, WeprodeButton, SaveVersionNoteModal, VersionNoteSelector, WeprodeSpinner, WeprodeWindow },
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

  img {
    max-width: 100%;
    vertical-align: middle;
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
