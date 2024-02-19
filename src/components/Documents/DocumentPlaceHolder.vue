<template>
  <div
    class="placeholder"
    :class="{'phone': mq.phone}"
  >
    <div class="icon-container">
      <img
        v-if="isLoadDocumentsError"
        class="icon"
        src="@assets/icons/alert_file.svg"
        alt=""
      >
      <img
        v-else
        class="icon"
        src="@assets/icons/add_file.svg"
        alt=""
      >
      <div
        v-if="!mq.phone && !mq.tablet"
        class="text"
      >
        <p class="p1">
          {{ text1 }}
        </p>
        <p
          v-if="text2"
          class="p2"
        >
          {{ text2 }}
        </p>
      </div>
    </div>
    <div
      v-if="mq.phone || mq.tablet"
      class="text"
    >
      <p class="p1">
        {{ text1 }}
      </p>
      <p
        v-if="text2"
        class="p2"
      >
        {{ text2 }}
      </p>
    </div>
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
    text1 () {
      if (this.isLoadDocumentsError) {
        return this.$t('isLoadDocumentsError')
      } else if (this.mq.phone || this.mq.tablet) {
        return this.$t('noDocumentToDisplayMobile')
      } else {
        return this.$t('noDocumentToDisplay')
      }
    },
    text2 () {
      if (this.isLoadDocumentsError) {
        return this.$t('isLoadDocumentsError2')
      } else if (this.mq.phone || this.mq.tablet) {
        return undefined
      } else {
        return this.$t('noDocumentToDisplay2')
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

  &.phone {
    height: calc(100% - #{$doc-breadcrumb-mobile-size});
  }
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
    margin-block-start: 1em;
  }

  .fa-icon {
    font-size: 10vw;
    max-width: 100px;
  }
}

.text {
  margin-block-start: 1em;
  margin-block-end: 1em;

  p{
    font-size: 18px;
    color: #898989;
    letter-spacing: 0;
    text-align: center;
    margin: 0;
    margin-block-end: 0.3em;
    font-weight: 400;
  }

  .p2{
    font-weight: normal;
    font-size: 14px;
  }
}

</style>

<i18n locale="fr">
{
  "isLoadDocumentsError": "Problème rencontré lors du",
  "isLoadDocumentsError2": "chargement des fichiers",
  "noDocumentToDisplay": "Déposez vos fichiers ici",
  "noDocumentToDisplay2": "ou utilisez le bouton +",
  "noDocumentToDisplayMobile": "Ajouter un document avec le bouton +"
}
</i18n>
