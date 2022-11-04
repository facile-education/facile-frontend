<template>
  <div class="attached-files">
    <div
      v-if="readOnly"
      class="header"
    >
      {{ attachedFiles.length + (attachedFiles.length > 1 ? $t('attachedFiles') : $t('attachedFile')) }}
    </div>
    <div class="file-list">
      <div
        v-for="attachedFile in attachedFiles"
        :key="attachedFile.fileId"
        :title="attachedFile.name"
        class="attached-file"
        @click="downloadAttachedFile(attachedFile)"
      >
        <FileIcon
          class="file-icon"
          :file="attachedFile"
        />
        <p class="file-name">
          {{ attachedFile.name }}
        </p>
        <div
          v-if="!readOnly"
          class="file-actions"
        >
          <img
            class="file-action"
            src="@assets/big-cross-black.svg"
            :alt="$t('AttachedFiles.remove')"
            :title="$t('AttachedFiles.remove')"
            @click="removeAttachedFile(attachedFile)"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FileIcon from '@components/Base/FileIcon'
import mediaService from '@/api/documents/media.service'
import { downloadDocument } from '@utils/documents.util'

export default {
  name: 'AttachedFiles',
  components: {
    FileIcon
  },
  props: {
    initialAttachedFiles: {
      type: Array,
      required: false,
      default: function () { return [] }
    },
    readOnly: {
      type: Boolean,
      required: true
    }
  },
  emits: ['removeAttachedFile'],
  data () {
    return {
    }
  },
  computed: {
    attachedFiles () {
      return this.initialAttachedFiles
    }
  },
  created () {
  },
  methods: {
    removeAttachedFile (e, attachedFile) {
      this.$emit('removeAttachedFile', e, attachedFile)
    },
    iconPrefix (file) {
      if (file.type === 'File') {
        if (file.icon === 'code') {
          return 'fas'
        } else {
          return 'far'
        }
      } else {
        return 'fas'
      }
    },
    downloadAttachedFile (attachedFile) {
      if (this.readOnly) {
        downloadDocument(attachedFile)
      }
    },
    viewAttachedFile (attachedFile) {
      mediaService.getMediaUrl(attachedFile.id, 0).then(async (data) => {
        if (data.success) {
          // const typeOfView = data.typeOfView
          // const fileUrl = data.fileUrl
          // TODO open viewer
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.attached-files {
  margin-bottom: 10px;

  .header {
    border-top: 1px solid $color-border;
    padding-top: 20px;
    font-weight: 600;
    width: 100%;
    padding-left: 10px;
  }

  .file-list {
    padding-left: 10px;
    display: flex;
    justify-content: flex-start;
    width: 100%;
    flex-wrap: wrap;
    max-height: 150px;
    overflow-y: auto;

    .attached-file {
      height: 50px;
      border-radius: 8px 8px 8px 8px;
      margin: 10px 10px 10px 0;
      padding-right: 10px;
      display: flex;
      align-items: center;
      cursor: pointer;
      border: 1px solid transparent;

      &:hover {
        border: 1px solid $color-border;
      }

      p {
        margin-left: 10px;
        max-width: 300px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .file-actions {
        margin-left: 10px;

        img {
          height: 13px;
          width: 13px;
        }
      }
    }
  }
}
</style>

<i18n locale="fr">
{
  "attachedFile": " pièce jointe",
  "attachedFiles": " pièces jointes"
}
</i18n>
