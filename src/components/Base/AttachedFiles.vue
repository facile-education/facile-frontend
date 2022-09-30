<template>
  <div class="attached-files">
    <div
      v-for="attachedFile in attachedFiles"
      :key="attachedFile.fileId"
      :title="attachedFile.name"
      class="attached-file"
    >
      <FileIcon
        class="file-icon"
        :file-name="attachedFile.name"
      />
      <p class="file-name">
        {{ attachedFile.name }}
      </p>
      <div class="file-actions">
        <!--BaseIcon
          class="file-action"
          name="eye"
          :title="$t('AttachedFiles.view')"
          @click="viewAttachedFile(attachedFile)"
        /-->
        <BaseIcon
          class="file-action"
          name="download"
          :title="$t('AttachedFiles.download')"
          @click="downloadAttachedFile(attachedFile)"
        />
        <img
          v-if="!readOnly"
          class="file-action"
          src="@assets/options/icon_trash.svg"
          alt="delete"
          :title="$t('AttachedFiles.remove')"
          @click="removeAttachedFile(attachedFile)"
        >
      </div>
    </div>
  </div>
</template>

<script>
import FileIcon from '@components/Base/FileIcon'
import BaseIcon from '@components/Base/BaseIcon'
import mediaService from '@/api/documents/media.service'
import documentutils from '@utils/documents.util'

export default {
  name: 'AttachedFiles',
  components: {
    BaseIcon,
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
      documentutils.downloadDocument(attachedFile)
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
    display: flex;
    justify-content: flex-start;
    width: 100%;
    flex-wrap: wrap;
    max-height: 150px;
    overflow-y: auto;

    .attached-file {
      border: 1px solid;
      border-radius: 8px 8px 8px 8px;
      margin: 5px;
      height: 30px;
      display: flex;
      align-items: center;

      .file-icon {
        margin: auto;
        margin-left: 10px;
        margin-right: 10px;
      }
      p {
        max-width: 300px;
        margin: auto;
        margin-left: 10px;
        font-size: 12pt;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        float: left;
      }
      .file-actions {
        margin: auto;
        margin-left: 10px;
        margin-right: 10px;
        display: flex;

        .file-action {
          margin-left: 5px;
          margin-right: 5px;
          padding: 2px;
          &:hover {
            cursor: pointer;
          }
        }
      }
    }
  }
  </style>
