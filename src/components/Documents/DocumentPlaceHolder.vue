<template>
  <div class="placeholder">
    <div class="message">
      <div class="icon-container">
        <img
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
export default {
  name: 'DocumentPlaceHolder',
  inject: ['mq'],
  computed: {
    text () {
      if (this.mq.phone || this.mq.tablet) {
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
  padding-top: 5em;
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
    width: 97px;
    height: 97px;
    border-radius: 48px;
    background-color: #F3F6F8;

    .icon {
      margin-left: 9px;
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
  "noDocumentToDisplay": "Glisser / déposer un document",
  "noDocumentToDisplayMobile": "Ajouter un document avec le bouton +"
}
</i18n>
