<template>
  <div
    class="item-content"
    :class="{'droppable': draggedContent}"
    :draggable="draggable"
    @mouseover="isHovering = true"
    @mouseleave="isHovering = false"
    @dragstart="dragStart"
    @dragend="dragEnd"
    @dragover.prevent="dragOver"
    @dragleave="dragLeave"
    @drop="drop"
  >
    <hr class="drag-placeholder theme-border-color">

    <!-- Drag and drop handler -->
    <div
      v-if="draggable && !readOnly"
      class="content-move"
      @mousedown="enableDrag"
    >
      <NeroIcon
        name="grip-lines"
        class="icon"
      />
    </div>
    <!-- Text -->
    <div
      v-if="content.contentType === 1"
      class="content-text"
    >
      <CKEditor
        :model-value="content.contentValue"
        :editor-id="editorId"
        :editor="editor"
        :config="editorOptions"
        :disabled="readOnly"
        @input="updateContent"
      />
    </div>

    <!-- Audio -->
    <div
      v-if="content.contentType === 2"
      class="content-audio"
    >
      <div class="preview">
        <img
          class="content-icon"
          src="@assets/icon_record.svg"
          alt=""
        >
      </div>
      <div class="column">
        <span>{{ $t('audio') }}</span>
        <audio
          controls=""
          name="media"
        >
          <source
            :src="content.link"
            type="audio/mp3"
          >
        </audio>
      </div>
    </div>

    <!-- Link -->
    <div
      v-if="content.contentType === 3"
      class="content-link"
    >
      <div class="preview">
        <img
          class="content-icon"
          src="@assets/icon_link.svg"
          alt=""
        >
      </div>
      <div class="column">
        <span>{{ content.contentName }}</span>
        <a
          :href="content.contentValue"
          target="_blank"
        >{{ content.contentValue }}</a>
      </div>
    </div>

    <!-- Video -->
    <div
      v-if="content.contentType === 4"
      class="content-video"
    >
      <div class="preview">
        <img
          class="content-icon"
          src="@assets/play.svg"
          alt=""
        >
      </div>
      <div class="column">
        <span>{{ content.contentName }}</span>
        <a
          :href="content.contentValue"
          target="_blank"
        >{{ content.contentValue }}</a>
      </div>
    </div>

    <!-- File -->
    <FileContent
      v-if="content.contentType === 5"
      :file-id="content.fileEntryId"
      :file-name="content.contentName"
      :download-url="content.downloadUrl"
    />

    <!-- H5P -->
    <div
      v-if="content.contentType === 6"
      class="content-h5p"
    >
      <div class="preview">
        <img
          class="content-icon"
          src="@assets/icon_h5p.svg"
          alt=""
        >
      </div>
      <div class="column">
        <span>{{ content.contentName }}</span>
        <a
          :href="content.contentValue"
          target="_blank"
        >{{ content.contentValue }}</a>
      </div>
    </div>

    <!-- Delete content button -->
    <div class="buttons-panel">
      <div
        v-if="content.contentType === 5"
        :title="$t('Commons.download')"
        class="content-button"
        @click.stop="download"
      >
        <BaseIcon
          class="icon"
          name="download"
        />
      </div>
      <div
        v-if="isEditableContent && !readOnly"
        class="content-button"
        :title="$t('edit')"
        @click="editContent()"
      >
        <img
          src="@assets/edit.svg"
          :alt="$t('edit')"
        >
      </div>
      <div
        v-if="!readOnly"
        class="content-button"
        :title="$t('delete')"
        @click="confirmContentDeletion()"
      >
        <img
          src="@assets/trash.svg"
          :alt="$t('delete')"
        >
      </div>
    </div>
  </div>
</template>

<script>
import '@ckeditor/ckeditor5-build-inline/build/translations/fr'
import InlineEditor from '@ckeditor/ckeditor5-build-inline'

import NeroIcon from '@/components/Nero/NeroIcon'
import { component as CKEditor } from '@ckeditor/ckeditor5-vue'
import FileContent from '@components/Progression/Edit/Contents/FileContent'
import documentUtils from '@utils/documents.util'
import BaseIcon from '@components/Base/BaseIcon'

export default {
  name: 'ProgressionItemContent',
  components: { BaseIcon, FileContent, CKEditor, NeroIcon },
  props: {
    content: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      default: -1
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  emits: ['editContent'],
  data () {
    return {
      draggable: true,
      editor: InlineEditor,
      editorOptions: {
        language: 'fr'
      },
      isHovering: false,
      timeout: undefined
    }
  },
  computed: {
    draggedContent () {
      return this.$store.state.progression.draggedContent
    },
    editorId () {
      // Used to manage multiple editors - editorId is based on the (unique) order
      return 'editor' + this.content.order
    },
    isEditableContent () {
      // Link, video and h5p are editable
      return this.content.contentType === 3 || this.content.contentType === 4 || this.content.contentType === 6
    }
  },
  methods: {
    dragEnd () {
      this.$store.commit('progression/setDraggedContent', undefined)
    },
    dragLeave (e) {
      e.target.classList.remove('top')
      e.target.classList.remove('bottom')
    },
    dragOver (e) {
      const movedContent = this.draggedContent
      if (movedContent && movedContent.contentId !== this.content.contentId && movedContent.itemId === this.content.itemId) {
        if (this.index < movedContent.index) {
          e.target.classList.add('top')
        } else {
          e.target.classList.add('bottom')
        }
      }
    },
    dragStart (e) {
      if (this.draggable) {
        const movedContent = { ...this.content, index: this.index }
        // Use timeout to avoid chrome issue triggering dragend on DOM update
        setTimeout(() => { this.$store.commit('progression/setDraggedContent', movedContent) }, 0)
      }
    },
    drop (e) {
      const movedContent = this.draggedContent
      if (movedContent && movedContent.itemId === this.content.itemId) {
        const updatedContent = { ...movedContent }
        updatedContent.order = this.index + 1
        this.$store.dispatch('progression/updateItemContent', updatedContent)
      }
    },
    enableDrag () {
      this.draggable = (this.index > -1)
    },
    updateContent (newValue) {
      clearTimeout(this.timeout)
      this.$store.dispatch('progression/setIsWaiting', true)
      // 2s timeout
      this.timeout = setTimeout(() => {
        const updatedContent = { ...this.content }
        updatedContent.contentValue = newValue
        this.$store.dispatch('progression/updateItemContent', updatedContent)
      }, 2000)
    },
    confirmContentDeletion () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('deleteContentWarning'),
        lastAction: { fct: this.deleteContent }
      })
    },
    deleteContent () {
      this.$store.dispatch('progression/deleteItemContent', this.content.contentId)
    },
    editContent () {
      this.$emit('editContent', this.content)
    },
    download () {
      documentUtils.downLoadDocument({ id: this.content.fileEntryId, type: 'File', url: this.content.downloadUrl })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.item-content {
  position: relative;
  border: 1px solid $color-border;
  background-color: $color-body-bg;
  height: 80px;
  display: flex;
  justify-content: space-between;

  &:hover {
    .content-button {
      display: flex;
    }

    .content-move {
      opacity: 1;
      transition: .3s;
      left: -30px;
      width: 30px;
    }
  }

  // When Dnd is active disable pointer events
  &.droppable * {
    pointer-events: none;
  }

  &.top .drag-placeholder {
    border-top: 2px solid;
    top: -7px;
  }

  &.bottom .drag-placeholder {
    border-bottom: 2px solid;
    bottom: -7px;
  }
}

.drag-placeholder {
  position: absolute;
  width: 100%;
  margin: 0;
  border: none;
}

.content-move {
  position: absolute;
  height: calc(100% + 2px);
  width: 0;
  top: -1px;
  left: 0;
  background: $color-not-white-bg;
  border: 1px solid $color-border;
  border-right: none;
  display: flex;
  cursor: move;
  opacity: 0;

  .icon {
    margin: auto
  }
}

.content-text {
  width: 100%;
}

.content-link, .content-video, .content-h5p, .content-audio {
  width: calc(100% - 40px);
  display: flex;

  .preview {
    height: 100%;
    width: 120px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 60px;
      height: 40px;
    }
  }

  .column {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    span {
      overflow-x: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-bottom: 5px;
    }

    a {
      overflow-x: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    audio {
      width: 100%;
      height: 40px;
    }

  span {
    margin-top: 5px;
  }
}
}

.buttons-panel {
  flex-basis: 40px;
  flex-grow: 0;
  flex-shrink: 0;
  margin: auto;
  display: flex;
  flex-direction: column;

  .content-button {
    display: none;
    height: 40px;
    border-radius: $border-radius;
    align-items: center;
    justify-content: center;

    img {
      width: 20px;
      height: 20px;
    }

    .icon {
      font-size: 15px;
    }

    &:hover {
      background-color: $color-hover-bg;
      cursor: pointer;
    }
  }
}
</style>

<i18n locale="fr">
{
  "audio": "Contenu audio",
  "session": "Séance",
  "delete": "Supprimer cet élément",
  "edit": "Modifier cet élément",
  "deleteContentWarning": "Supprimer ce contenu ?",
  "externalLink": "Lien externe",
  "video": "Video",
  "h5p": "Contenu H5P"
}
</i18n>
