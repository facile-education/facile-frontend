<template>
  <div class="container">
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
        <div
          v-if="!cancelStatus"
          v-t="'cancel'"
          class="cancel"
          @click="cancel"
        />
        <img
          v-else
          class="close-button"
          src="@assets/big-cross-black.svg"
          :alt="$t('close')"
          :title="$t('close')"
          @click="close"
        >
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
import UploadProgressionItem from '@components/Documents/UploadProgressionItem'
export default {
  name: 'UploadProgression',
  components: { UploadProgressionItem, BaseIcon },
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
    isUploadFinished () {
      return this.listUploadedFiles.length >= this.listFilesToUpload.length
    },
    cancelStatus () {
      return this.$store.state.currentActions.cancelUpload || this.isUploadFinished
    },
    headerText () {
      let text = ''
      if (!this.cancelStatus) {
        text = this.listUploadedFiles.length + this.$t('uploadOn') + this.listFilesToUpload.length + ' ...'
      } else if (this.listUploadedFiles.length === 1) {
        text = this.listUploadedFiles.length + this.$t('uploadfinished')
      } else {
        text = this.listUploadedFiles.length + this.$t('uploadsfinished')
      }
      return text
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

  .header{
    --header-height: 60px;
    height: var(--header-height);
    padding: 5px 10px;
    background-color: #777777;
    display: flex;
    justify-content: space-between;

    .text {
      line-height: 50px;
    }

    .right-section {
      display: flex;
      align-items: center;

      .collapse {
        margin-right: 20px;
        cursor: pointer;
      }

      .cancel {
        cursor: pointer;
        color: blue;
      }

      .close-button {
        cursor: pointer;
        width: 16px;
        height: 16px;
      }
    }

  }

  .document-list {
    padding: 0 10px;
    max-height: calc(var(--container-max-height) - 60px);
    overflow: auto;
    background-color: #aaaaaa;
  }
}

</style>

<i18n locale="fr">
{
  "cancel": "Annuler",
  "uploadOn": " chargements sur ",
  "uploadfinished": " Chargement terminé",
  "uploadsfinished": " Chargements terminés"
}
</i18n>
