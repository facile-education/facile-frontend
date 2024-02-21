<template>
  <TextContent
    v-if="typeLabel === 'text'"
    :content="modelValue"
    :placeholder="content.placeholder"
    class="text-content"
    :disabled="!isEdition"
    :class="{'placeholder': content.placeholder}"
    :focus-on-creation="focusOnCreation"
    :data-test="dataTest"
    @update:content="update"
    @blur="blur"
  />

  <AttachedFile
    v-else-if="typeLabel === 'file'"
    :read-only="!isEdition"
    :attached-file="{...content, name: content.contentName, type: 'File', id: content.fileId, url: content.downloadUrl}"
    @remove-attached-file="$emit('delete')"
  />

  <div
    v-else
    class="course-content theme-hover-border-color"
    :class="{'has-remove-button': hasRemoveButton}"
    tabindex="0"
    :title="content.contentValue"
    @click="clickOnContent"
    @keyup.enter="clickOnContent"
  >
    <div class="icon">
      <img
        :src="thumbnail"
        alt="type thumbnail"
      >
    </div>
    <div class="data">
      <div class="type">
        {{ $t('Course.CourseContentItem.' + typeLabel) }}
      </div>
      <strong class="name">
        {{ content.contentName }}
      </strong>
      <a
        v-if="content.contentValue"
        class="description"
        target="_blank"
        :href="content.contentValue"
        @click.stop
      >
        {{ content.contentValue }}
      </a>
      <br
        v-else
        class="description"
      >
    </div>

    <button
      v-if="hasRemoveButton"
      class="remove-button"
      @click.stop="$emit('delete')"
    >
      <img
        :src="require('@/assets/icons/trash.svg')"
        alt="options"
      >
    </button>

    <teleport to="body">
      <EmbedContentModal
        v-if="videoModalDisplayed"
        :edited-content="content"
        :read-only="true"
        @close="videoModalDisplayed=false"
      />

      <EmbedContentModal
        v-if="h5pModalDisplayed"
        :edited-content="content"
        :is-h5p="true"
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
import { downloadDocuments } from '@utils/documents.util'
import { defineAsyncComponent } from 'vue'

import contentTypeConstants from '@/constants/contentTypeConstants'
import { icons } from '@/constants/icons'
import { getExtensionFromName } from '@/utils/commons.util'
const ContextMenu = defineAsyncComponent(() => import('@components/ContextMenu/ContextMenu.vue'))
const FilePickerModal = defineAsyncComponent(() => import('@components/FilePicker/FilePickerModal.vue'))
const EmbedContentModal = defineAsyncComponent(() => import('@components/Base/ContentEdtitionModals/EmbedContentModal'))

export default {
  name: 'CourseContentItem',
  components: {
    AttachedFile,
    FilePickerModal,
    EmbedContentModal,
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
    },
    dataTest: {
      type: String,
      default: ''
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
    hasRemoveButton () {
      return this.isEdition && this.typeLabel !== 'file'
    },
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
            title: this.$t('Course.CourseContentItem.save'),
            icon: icons.options.save,
            position: 1,
            hasSeparator: false
          },
          {
            name: 'download',
            title: this.$t('Course.CourseContentItem.download'),
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
      downloadDocuments([fileToDownload])
    },
    saveInFolder (targetFolder) {
      const fileToSave = { ...this.content, id: this.content.fileId }
      this.$store.dispatch('clipboard/duplicate', { targetFolder, entities: [fileToSave], successMessage: this.$t('Course.CourseContentItem.addToFolderSuccess') })
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

.course-content {
  height: 70px;
  width: 100%;
  padding: 0 0.5rem;
  border-radius: $content-boarder-radius;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid $color-border;
  background-color: $neutral-10;
  cursor: pointer;
  position: relative;

  &.has-remove-button {
    .data {
      width: calc(100% - (50px + 0.5rem + 2rem));
    }
  }
}

.icon {
  height: 50px;
  width: 50px;
  min-width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;

  img {
    width: 34px;
    height: 34px;
  }
}

.data {
  width: calc(100% - (50px + 0.5rem));
}

.type {
  width: 100%;
  @extend %font-regular-xs;
}

.name {
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  @extend %font-bold-s;
}

.description {
  display: block;
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  @extend %font-regular-xs;
}

button {
  margin: 0;
  padding: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.remove-button {
  padding: 6px !important;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 20px;
    height: 20px;
  }
}
</style>
