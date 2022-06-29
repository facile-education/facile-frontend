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
    <div class="field">
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
      return dayjs(this.document.creationDate, 'YYYY-MM-DD HH:mm:ss').calendar()
    },
    formattedModificationDate () {
      return dayjs(this.document.lastModifiedDate, 'YYYY-MM-DD HH:mm:ss').calendar()
    },
    formattedSize () {
      return formatSize(this.document.size)
    },
    formattingType () {
      if (this.document.type === 'Folder') {
        return this.$t('Documents.folder')
      } else if (this.document.type === 'File') {
        return this.$t('Documents.file') + ' ' + this.document.extension
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