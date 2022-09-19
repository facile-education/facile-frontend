<template>
  <div class="container">
    <div class="header">
      <div class="text">
        {{ headerText }}
      </div>
      <div
        v-if="!cancelStatus"
        class="cancel"
        @click="cancel"
      >
        Annuler
      </div>
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
</template>

<script>
export default {
  name: 'UploadProgression',
  computed: {
    listFilesToUpload () {
      return this.$store.state.currentActions.listFilesToUpload
    },
    listUploadedFiles () {
      return this.$store.state.currentActions.listUploadedFiles
    },
    isUploadFinished () {
      return this.listUploadedFiles.length === this.listFilesToUpload.length
    },
    cancelStatus () {
      return this.$store.state.currentActions.cancelUpload || this.isUploadFinished
    },
    headerText () {
      let text = ''
      if (!this.isUploadFinished) {
        text = this.listUploadedFiles.length + this.$t('uploadOn') + this.listFilesToUpload.length
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
  width: 300px;

  .header{
    height: 60px;
    padding: 5px 10px;
    background-color: gray;
    display: flex;
    justify-content: space-between;

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

</style>

<i18n locale="fr">
{
  "uploadOn": " chargements sur ",
  "uploadfinished": " Chargement terminé",
  "uploadsfinished": " Chargements terminés"
}
</i18n>
