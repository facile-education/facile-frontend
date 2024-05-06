<template>
  <div
    class="container"
    data-test="fileUploadProgressionPopover"
  >
    <div class="header">
      <div class="text">
        {{ headerText }}
      </div>

      <div class="right-section">
        <button
          class="collapse"
          :title="$t('Documents.UploadProgression.' + (isCollapsed? 'extend' : 'collapse'))"
          :aria-label="$t('Documents.UploadProgression.' + (isCollapsed? 'extend' : 'collapse'))"
          @click="isCollapsed=!isCollapsed"
        >
          <CustomIcon
            :class="{'collapsed': isCollapsed}"
            icon-name="icon-chevron-right-s"
          />
        </button>
        <button
          v-if="!isUploadFinished && !cancelStatus"
          v-t="'Documents.UploadProgression.cancel'"
          class="cancel-button"
          @click="cancel"
        />

        <button
          v-else
          class="close-button"
          :title="$t('Documents.UploadProgression.close')"
          :aria-label="$t('Documents.UploadProgression.close')"
          @click="close"
        >
          <CustomIcon
            icon-name="icon-cross-L"
            class="icon"
          />
        </button>
      </div>
    </div>
    <div
      v-if="!isCollapsed"
      class="document-list"
    >
      <UploadProgressionItem
        v-for="(document, index) in listFilesToUpload"
        :key="index"
        :document="document"
      />
    </div>
  </div>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import UploadProgressionItem from '@components/Documents/UploadProgressionItem'

import { uploadProgressionTimeAfterFinish } from '@/constants/appConstants.js'
export default {
  name: 'UploadProgression',
  components: { CustomIcon, UploadProgressionItem },
  data () {
    return {
      isCollapsed: false
    }
  },
  computed: {
    listFilesToUpload () {
      return this.$store.state.currentActions.listFilesToUpload
    },
    listUploadedFiles () {
      return this.$store.state.currentActions.listUploadedFiles
    },
    listOfFailedUploadFiles () {
      return this.$store.state.currentActions.listFilesInError
    },
    isUploadFinished () {
      return this.listUploadedFiles.length + this.listOfFailedUploadFiles.length >= this.listFilesToUpload.length
    },
    cancelStatus () {
      return this.$store.state.currentActions.cancelUpload
    },
    headerText () {
      let text = ''
      if (!this.isUploadFinished && !this.cancelStatus) {
        text = this.$tc('Documents.UploadProgression.uploadOn', this.listUploadedFiles.length, { done: this.listUploadedFiles.length, total: this.listFilesToUpload.length })
      } else {
        text = this.$tc('Documents.UploadProgression.uploadfinished', this.listUploadedFiles.length, { nb: this.listUploadedFiles.length })
      }
      return text
    }
  },
  watch: {
    isUploadFinished (value) {
      // If upload is finished without any problems, remove Progression after 5s
      if (value && this.listOfFailedUploadFiles.length === 0) {
        setTimeout(() => {
          this.close()
        }, uploadProgressionTimeAfterFinish)
      }
    }
  },
  methods: {
    cancel () {
      this.$store.dispatch('currentActions/cancelUpload')
    },
    close () {
      this.$store.dispatch('currentActions/hideUploadProgression')
    }
  }
}
</script>

<style lang="scss" scoped>

.container {
  --container-max-height: 500px;
  max-height: var(--container-max-height);
  width: 400px;
  max-width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
  padding: 0 30px 10px 30px;

  .header{
    --header-height: 60px;
    height: var(--header-height);
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);

    .text {
      line-height: 60px;
      font-weight: 600;
    }

    .right-section {
      display: flex;
      align-items: center;

      .collapse {
        margin-right: 20px;
        cursor: pointer;
        background-color: transparent;
        border: none;
        display: flex;
        align-items: center;
      }

      .cancel-button {
        color: #E74B3B;
      }

      .icon-chevron-right-s {
        transform: rotate(90deg);
        font-size: 1.3rem;

        &.collapsed {
          transform: rotate(-90deg);
        }
      }

      .close-button, .cancel-button {
        height: 100%;
        margin: 0;
        padding: 0;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        background: transparent;

        .icon {
          font-size: 1.4rem;
          font-weight: bold;
        }
      }
    }

  }

  .document-list {
    max-height: calc(var(--container-max-height) - 60px);
    overflow: auto;
  }
}

</style>
