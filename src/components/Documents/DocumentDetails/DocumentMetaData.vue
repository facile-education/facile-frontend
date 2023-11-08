<template>
  <div class="meta-data">
    <!-- Size -->
    <div class="field">
      <span
        v-t="'Commons.size'"
        class="content-label"
      />
      <span class="content-description"> {{ formattedSize }} </span>
    </div>

    <!-- Type -->
    <div
      v-if="formattingType !== ''"
      class="field"
    >
      <span
        v-t="'Commons.type'"
        class="content-label"
      />
      <span class="content-description"> {{ formattingType }} </span>
    </div>

    <!-- Last modification -->
    <div class="field">
      <span
        v-t="'Documents.documentFields.lastModifiedDate'"
        class="content-label"
      />
      <span class="content-description"> {{ formattedModificationDate }} </span>
    </div>

    <!-- Creation -->
    <div class="field">
      <span
        v-t="'Documents.documentFields.creationDate'"
        class="content-label"
      />
      <span class="content-description"> {{ formattedCreationDate }} </span>
    </div>

    <!-- Groups -->
    <div
      v-if="document.isGroupFile && document.viewCount !== undefined"
      class="field"
    >
      <span
        v-t="'Documents.documentFields.totalViewCount'"
        class="content-label"
      />
      <span class="content-description"> {{ document.viewCount }} </span>
    </div>
    <div
      v-if="document.isGroupFile && document.downloadCount !== undefined"
      class="field"
    >
      <span
        v-t="'Documents.documentFields.totalDownloadCount'"
        class="content-label"
      />
      <span class="content-description"> {{ document.downloadCount }} </span>
    </div>
  </div>
</template>

<script>
import { formatSize } from '@utils/commons.util'
import dayjs from 'dayjs'

export default {
  name: 'DocumentMetaData',
  props: {
    document: {
      type: Object,
      required: true
    }
  },
  computed: {
    formattedCreationDate () {
      return this.document.creationDate !== undefined ? dayjs(this.document.creationDate, 'YYYY-MM-DD HH:mm:ss').calendar() : '-'
    },
    formattedModificationDate () {
      return this.document.lastModifiedDate !== undefined ? dayjs(this.document.lastModifiedDate, 'YYYY-MM-DD HH:mm:ss').calendar() : '-'
    },
    formattedSize () {
      return this.document.size !== undefined ? formatSize(this.document.size) : '-'
    },
    formattingType () {
      if (this.document.type === 'Folder') {
        return this.$t('Documents.folder')
      } else if (this.document.type === 'File') {
        if (this.document.extension === 'odp' ||
          this.document.extension === 'ppt' ||
          this.document.extension === 'sxi' ||
          this.document.extension === 'pptx' ||
          this.document.extension === 'csv' ||
          this.document.extension === 'ods' ||
          this.document.extension === 'sxc' ||
          this.document.extension === 'tsv' ||
          this.document.extension === 'xls' ||
          this.document.extension === 'xlsx' ||
          this.document.extension === 'odt' ||
          this.document.extension === 'doc' ||
          this.document.extension === 'sxw' ||
          this.document.extension === 'docx'
        ) {
          return 'Office'
        } else if (this.document.extension === 'gif' ||
          this.document.extension === 'jpg' ||
          this.document.extension === 'jpeg' ||
          this.document.extension === 'png'
        ) {
          return 'Image'
        } else if (this.document.extension === 'mp4' ||
        this.document.extension === 'mpg' ||
        this.document.extension === 'mov'
        ) {
          return 'Film'
        } else if (this.document.extension === 'mp3'
        ) {
          return 'Audio'
        } else if (this.document.extension === 'mind'
        ) {
          return 'Mindmap'
        } else if (this.document.extension === 'ggb'
        ) {
          return 'Géogébra'
        } else if (this.document.extension === 'sb3'
        ) {
          return 'Scratch'
        } else if (this.document.extension === 'html'
        ) {
          return 'Note'
        } else if (this.document.extension === 'pdf'
        ) {
          return 'PDF'
        } else {
          return ''
        }
      } else if (this.document.type === 'Group') {
        return this.$t('Documents.group')
      } else {
        console.error('Unknown document type')
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.meta-data {
  flex: 1;
  color: #646464;

  .field{
    padding: 10px 0 10px 10px;
    display: flex;
  }

  .content-label{
    flex: 1;
  }

  .content-description{
    flex: 1;
  }
}

</style>
