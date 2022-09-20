<template>
  <div class="placeholder">
    <div class="message">
      <div class="icon-container">
        <NeroIcon
          v-if="isLoadDocumentsError"
          name="fa-exclamation-triangle"
          class="fa-icon"
        />
        <img
          v-else
          class="icon"
          src="@/assets/options/icon_fichier_ajout.svg"
          alt=""
        >
      </div>
      <p> {{ text }}</p>
    </div>
  </div>
</template>

<script>
import NeroIcon from '@components/Nero/NeroIcon'
export default {
  name: 'DocumentPlaceHolder',
  components: { NeroIcon },
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
  margin-right: auto;
  margin-left: auto;
  padding-top: 6em;
  font-size: 1.25em;
}

.message {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30vw;
    height: 30vw;
    border-radius: 15vw;
    background-color: #F3F6F8;

    .icon {
      margin-left: 3vw;
      width: 10vw;
    }

    .fa-icon {
      font-size: 10vw;
    }
  }

  p{
    font-size: 14px;
    font-weight: 600;
  }
}

</style>

<i18n locale="fr">
{
  "isLoadDocumentsError": "Nous avons rencontré une erreur lors du chargement des fichiers",
  "noDocumentToDisplay": "Glisser / déposer un document",
  "noDocumentToDisplayMobile": "Ajouter un document avec le bouton +"
}
</i18n>
