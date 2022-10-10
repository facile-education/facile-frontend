<template>
  <div class="placeholder">
    <div class="icon-container">
      <img
        v-if="isLoadDocumentsError"
        class="icon"
        src="@/assets/options/loadingErrorPlaceholder.svg"
        alt=""
      >
      <img
        v-else
        class="icon"
        src="@/assets/options/emptyFolderPlaceholder.svg"
        alt=""
      >
      <p v-if="!mq.phone && !mq.tablet">
        {{ text }}
      </p>
    </div>
    <p v-if="mq.phone || mq.tablet">
      {{ text }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'DocumentPlaceHolder',
  inject: ['mq'],
  computed: {
    isLoadDocumentsError () {
      return this.$store.state.documents.loadDocumentsError
    },
    text () {
      if (this.isLoadDocumentsError) {
        return this.$t('isLoadDocumentsError')
      } else if (this.mq.phone || this.mq.tablet) {
        return this.$t('noDocumentToDisplayMobile')
      } else {
        return this.$t('noDocumentToDisplay')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.placeholder{
  height: calc(100% - #{$doc-breadcrumb-size});
  width: 100%;
  display: flex;
  padding-top: 6em;
  flex-direction: column;
  align-items: center;
  font-size: 1.25em;
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 30vw;
  max-width: 300px;
  height: 30vw;
  max-height: 300px;
  border-radius: 15vw;
  background-color: #F5F5F5;

  .icon {
    margin-left: 3vw;
    width: 10vw;
    max-width: 100px;
  }

  .fa-icon {
    font-size: 10vw;
    max-width: 100px;
  }
}

p{
  font-family: Roboto-Regular,sans-serif;
  font-size: 18px;
  color: #898989;
  letter-spacing: 0;
  text-align: center;
}

</style>

<i18n locale="fr">
{
  "isLoadDocumentsError": "Problème rencontré lors du chargement des fichiers",
  "noDocumentToDisplay": "Glisser / déposer un document",
  "noDocumentToDisplayMobile": "Ajouter un document avec le bouton +"
}
</i18n>
