<template>
  <div class="upload-progression-item">
    <div class="name">
      {{ document.name.split('/').at(-1) }}
    </div>
    <div class="status">
      <div
        v-if="status==='uploading'"
        class="uploading"
      >
        ...
      </div>
      <BaseIcon
        v-else-if="status==='uploaded'"
        class="uploaded"
        name="check"
      />
      <div v-else />
    </div>
  </div>
</template>

<script>
import BaseIcon from '@components/Base/BaseIcon'
export default {
  name: 'UploadProgressionItem',
  components: { BaseIcon },
  props: {
    document: {
      type: Object,
      required: true
    }
  },
  computed: {
    currentUploadingFile () {
      return this.$store.state.currentActions.currentUploadingFile
    },
    listUploadedFiles () {
      return this.$store.state.currentActions.listUploadedFiles
    },
    status () {
      if (this.currentUploadingFile && this.document.name === this.currentUploadingFile.name) {
        return 'uploading'
      } else {
        let find = false
        this.listUploadedFiles.forEach((uploadedFile) => {
          if (uploadedFile.name === this.document.name) {
            find = true
          }
        })
        return find ? 'uploaded' : 'not-uploaded'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-progression-item {
  display: flex;
  justify-content: space-between;
  height: 40px;

  .name {
    max-width: 80%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 40px;
  }

  .status {
    line-height: 40px;

    .uploading {
      font-size: 1.4em;
    }

    .uploaded {
      color: green;
    }
  }

}
</style>
