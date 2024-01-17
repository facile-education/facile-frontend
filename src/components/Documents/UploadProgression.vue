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
        <div
          class="collapse"
          @click="isCollapsed=!isCollapsed"
        >
          <BaseIcon
            v-if="!isCollapsed"
            class="icon"
            name="chevron-down"
          />
          <BaseIcon
            v-else
            class="icon"
            name="chevron-up"
          />
        </div>
        <button
          v-if="!isUploadFinished && !cancelStatus"
          v-t="'cancel'"
          class="cancel-button"
          @click="cancel"
        />

        <button
          v-else
          class="close-button"
          :title="$t('close')"
          :aria-label="$t('close')"
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
import BaseIcon from '@components/Base/BaseIcon'
import CustomIcon from '@components/Base/CustomIcon.vue'
import UploadProgressionItem from '@components/Documents/UploadProgressionItem'
export default {
  name: 'UploadProgression',
  components: { CustomIcon, UploadProgressionItem, BaseIcon },
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
        text = this.$tc('uploadOn', this.listUploadedFiles.length, { done: this.listUploadedFiles.length, total: this.listFilesToUpload.length })
      } else {
        text = this.$tc('uploadfinished', this.listUploadedFiles.length, { nb: this.listUploadedFiles.length })
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
        }, 5000)
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
      }

      .cancel-button {
        color: #E74B3B;
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

<i18n locale="fr">
{
  "cancel": "Annuler",
  "close": "Fermer",
  "uploadOn": "{done} chargement sur {total} | {done} chargement sur {total} | {done} chargements sur {total}",
  "uploadfinished": "{nb} chargement terminé | {nb} chargements terminés"
}
</i18n>
