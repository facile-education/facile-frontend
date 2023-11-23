<template>
  <TextContent
    v-if="typeLabel === 'text'"
    :content="modelValue"
    :placeholder="content.placeholder"
    class="text-content"
    :disabled="!isEdition"
    :class="{'placeholder': content.placeholder}"
    :focus-on-creation="focusOnCreation"
    @update:model-value="update"
    @blur="blur"
  />

  <AttachedFile
    v-else-if="typeLabel === 'file'"
    :read-only="!isEdition"
    :attached-file="{...content, name: content.contentName, type: 'File', id: content.fileId, url: content.downloadUrl}"
  />

  <div
    v-else
    class="wrapper"
    tabindex="0"
    @click="clickOnContent"
    @keyup.enter="clickOnContent"
  >
    <div class="thumbnail">
      <img
        :src="thumbnail"
        alt="type thumbnail"
      >
    </div>
    <div class="infos">
      <label class="type">
        {{ $t(typeLabel) }}
      </label>
      <h3 class="title">
        {{ content.contentName }}
        <label
          v-if="content.duration"
          class="duration"
        >
          {{ content.duration }}
        </label>
      </h3>
      <p
        v-if="content.contentValue"
        class="description"
      >
        {{ content.contentValue }}
      </p>
    </div>

    <button
      v-if="isEdition && typeLabel !== 'file'"
      class="actions"
      @click.stop="$emit('delete')"
    >
      <img
        :src="require('@/assets/icons/trash.svg')"
        alt="options"
      >
    </button>

    <teleport to="body">
      <VideoModal
        v-if="videoModalDisplayed"
        :edited-content="content"
        :read-only="true"
        @close="videoModalDisplayed=false"
      />
      <H5PModal
        v-if="h5pModalDisplayed"
        :edited-content="content"
        :read-only="true"
        @close="h5pModalDisplayed=false"
      />
      <!-- Deposit destination -->
      <FilePickerModal
        v-if="isDepositModalDisplayed"
        :folder-selection="true"
        :init-in-current-folder="false"
        @chosen-folder="saveInFolder"
        @close="isDepositModalDisplayed = false"
      />
    </teleport>

    <teleport
      v-if="displayMenu"
      to="body"
    >
      <ContextMenu
        class="context-menu-with-padding"
        @choose-option="performChosenOption"
        @close="displayMenu=false"
      />
    </teleport>
  </div>
</template>

<script>
import AttachedFile from '@components/AttachedFiles/AttachedFile.vue'
import TextContent from '@components/Base/TextContent.vue'
import { downloadDocument } from '@utils/documents.util'
import { defineAsyncComponent } from 'vue'

import contentTypeConstants from '@/constants/contentTypeConstants'
import { icons } from '@/constants/icons'
import { getExtensionFromName } from '@/utils/commons.util'
const ContextMenu = defineAsyncComponent(() => import('@components/ContextMenu/ContextMenu.vue'))

const H5PModal = defineAsyncComponent(() => import('@components/Base/ContentEdtitionModals/H5PModal'))
const VideoModal = defineAsyncComponent(() => import('@components/Base/ContentEdtitionModals/VideoModal'))
const FilePickerModal = defineAsyncComponent(() => import('@components/FilePicker/FilePickerModal.vue'))

export default {
  name: 'CourseContentItem',
  components: {
    AttachedFile,
    FilePickerModal,
    H5PModal,
    VideoModal,
    TextContent,
    ContextMenu
  },
  inject: ['mq'],
  props: {
    content: {
      type: Object,
      required: true
    },
    modelValue: {
      type: String,
      default: ''
    },
    isEdition: {
      type: Boolean,
      default: false
    },
    focusOnCreation: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'delete'],
  data () {
    return {
      videoModalDisplayed: false,
      h5pModalDisplayed: false,
      isDepositModalDisplayed: false,
      displayMenu: false
    }
  },
  computed: {
    saveIcon () {
      return icons.options.save
    },
    icon () {
      return new URL(`../../assets/icons/contents/${this.typeLabel}.svg`, import.meta.url).href
    },
    fileExtension () {
      return getExtensionFromName(this.content.contentName)
    },
    thumbnail () {
      if (this.typeLabel === 'file') {
        if (icons.extensions[this.fileExtension] === undefined) {
          return icons.file
        } else {
          return icons.extensions[this.fileExtension]
        }
      } else {
        return new URL(`../../assets/icons/documents/${this.typeLabel}.svg`, import.meta.url).href
      }
    },
    typeLabel () {
      switch (this.content.contentType) {
        case contentTypeConstants.TYPE_TEXT_CONTENT:
          return 'text'
        case contentTypeConstants.TYPE_AUDIO_CONTENT:
          return 'audio'
        case contentTypeConstants.TYPE_LINK_CONTENT:
          return 'link'
        case contentTypeConstants.TYPE_VIDEO_CONTENT:
          return 'video'
        case contentTypeConstants.TYPE_FILE_CONTENT:
          return 'file'
        case contentTypeConstants.TYPE_H5P_CONTENT:
          return 'h5p'
        default:
          return ''
      }
    }
  },
  methods: {
    clickOnContent () {
      switch (this.content.contentType) {
        case contentTypeConstants.TYPE_AUDIO_CONTENT:
          // TODO: Test audioFile opening
          this.$store.dispatch('documents/openFile', { id: this.content.fileId, name: this.content.fileName })
          break
        case contentTypeConstants.TYPE_LINK_CONTENT:
          window.open(this.content.contentValue, '_blank')
          break
        case contentTypeConstants.TYPE_VIDEO_CONTENT:
          this.videoModalDisplayed = true
          break
        case contentTypeConstants.TYPE_FILE_CONTENT:
          this.$store.dispatch('documents/openFile', { id: this.content.fileId, name: this.content.fileName, readOnly: true })
          break
        case contentTypeConstants.TYPE_H5P_CONTENT:
          // TODO: Test with real whitelisted h5p content
          this.h5pModalDisplayed = true
          break
        default:
          return ''
      }
    },
    blur () {
      if (!this.content.placeholder && this.modelValue === '') {
        this.$emit('delete')
      }
    },
    update (value) {
      this.$emit('update:modelValue', value)
    },
    toggleContextMenu (event) {
      this.displayMenu = true
      this.$store.dispatch('contextMenu/openContextMenu', {
        event,
        options: [
          {
            name: 'save',
            title: this.$t('save'),
            icon: icons.options.save,
            position: 1,
            hasSeparator: false
          },
          {
            name: 'download',
            title: this.$t('download'),
            icon: icons.options.download,
            position: 2,
            hasSeparator: false
          }]
      })
    },
    performChosenOption (option) {
      switch (option.name) {
        case 'save':
          this.isDepositModalDisplayed = true
          break
        case 'download':
          this.downloadFile()
          break
        default:
          console.error('no option with name ' + option.name + ' exists')
      }
      this.displayMenu = false
      this.$store.dispatch('contextMenu/closeMenus')
    },
    downloadFile () {
      const fileToDownload = { ...this.content, type: 'File', name: this.content.contentName, url: this.content.downloadUrl }
      downloadDocument(fileToDownload)
    },
    saveInFolder (targetFolder) {
      const fileToSave = { ...this.content, id: this.content.fileId }
      this.$store.dispatch('clipboard/duplicate', { targetFolder, entities: [fileToSave], successMessage: this.$t('addToFolderSuccess') })
    }
  }
}
</script>

<style lang="scss">
.text-content {
  &.ck-editor {
    p {
      margin: 5px 0;
      line-height: 1.25rem;
    }
  }

  &.ck-editor__editable.placeholder {
    min-height: 8rem;
  }
}

</style>

<style lang="scss" scoped>
@import '@design';

.text-content {
  background: $neutral-20;
  border-bottom: 1px solid black;

  &.disabled {
    padding: 10px 0;
    background-color: transparent;
    border: none;
    color: black;
    cursor: auto;
    @extend %font-regular-m;
  }
}

.wrapper {
  display: flex;
  // width: 49.8125rem;
  align-items: center;

  border-radius: 0.375rem;
  border: 1px solid $neutral-40;
  background: $neutral-10;
  cursor: pointer;
  position: relative;

  &:hover, &:focus-within {
    .file-actions {
      opacity: 100%;

      button {
        width: 40px;
      }
    }
  }
}

.thumbnail {
  display: flex;
  padding: 0.5rem;
  justify-content: center;
  align-items: center;

  border-radius: 0.375rem;
  //background: $neutral-20;

  img {
    width: 2.5rem;
    height: 2.5rem;
  }
}

.infos {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.context-menu-with-padding {
  padding: 10px 0;
}

.options-button {
  height: 100%;
  padding: 0 0.5rem;
}

.type {
  display: flex;
  align-content: center;
  width: 100%;
  @extend %font-regular-xs;
}

.title {
  margin: 1px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  @extend %font-bold-l;
}

.duration {
  color: $neutral-80;

  @extend %font-regular-s;
}

.description {
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  @extend %font-regular-s;
}

button {
  margin: 0;
  padding: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.actions img {
  margin-right : 1rem;
  width: 1.25rem;
  height: 1.25rem;
}

.file-actions {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  display: flex;
  border-radius: 0 5px 5px 0;
  overflow: hidden;
  transition: all .3s ease;
  opacity: 0;

  button {
    width: 0;
    transition: all .3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    background-color: $neutral-20;

    img {
      height: 1rem;
    }

    &:hover {
      background-color: $color-hover-bg;
    }
  }
}
</style>

<i18n locale="fr">
{
  "audio": "Audio",
  "file": "Fichier",
  "h5p": "Contenu riche",
  "link": "Lien externe",
  "video": "Vidéo",
  "addToFolderSuccess": "Fichier déposé",
  "save": "Enregistrer",
  "download": "Télécharger"
}
</i18n>
