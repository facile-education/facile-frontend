<template>
  <div class="upload-progression-item">
    <div
      class="name"
      :title="document.name"
    >
      {{ document.name.split('/').at(-1) }}
    </div>
    <div class="status">
      <div
        v-if="status==='uploading'"
        class="uploading"
      >
        <span v-if="count % 3 === 0">...</span>
        <span v-if="count % 3 === 1">.</span>
        <span v-if="count % 3 === 2">..</span>
      </div>
      <div
        v-else-if="status!=='not-uploaded'"
        class="icon-container"
      >
        <BaseIcon
          :class="status==='uploaded'? 'uploaded' : 'error'"
          :name="status==='uploaded' ? 'check' : 'times'"
        />
      </div>
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
  data () {
    return {
      counter: undefined,
      count: 0
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
      if (this.currentUploadingFile && this.document.name.split('/').at(-1) === this.currentUploadingFile.name.split('/').at(-1)) {
        return 'uploading'
      } else {
        if (this.document.isError) {
          return 'error'
        }
        let find = false
        this.listUploadedFiles.forEach((uploadedFile) => {
          if (uploadedFile.name.split('/').at(-1) === this.document.name.split('/').at(-1)) {
            find = true
          }
        })
        return find ? 'uploaded' : 'not-uploaded'
      }
    }
  },
  watch: {
    status: {
      handler (value) {
        if (value === 'uploading') {
          this.$el.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }
      }
    }
  },
  created () {
    this.counter = setInterval(() => {
      this.count++
    }, 500)
  },
  beforeUnmount () {
    clearInterval(this.counter)
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

  .icon-container {
    height: 100%;
    width: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .status {
    line-height: 40px;

    .uploading {
      font-size: 1.4em;
    }

    .uploaded {
      color: green;
    }
    .error {
      color: red;
    }
  }

}
</style>
