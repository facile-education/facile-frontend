<template>
  <div data-test="terms-of-use">
    <br>
    <h3 align="center">
      <a
        data-test="confidentialityRulesLink"
        href="http://www.pentilanero.com/?page_id=533"
        target="_blank"
      >
        {{ $t('confidentialityRulesLinkText') }}
      </a>
    </h3>
    <div
      class="bodyCharter"
      data-test="bodyCharter"
    >
      <p
        v-if="termsOfUse"
      >
        {{ termsOfUse }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TermsOfUse',
  computed: {
    termsOfUse () {
      return this.$store.state.information.termsOfUse
    }
  },
  created () {
    if (this.termsOfUse === undefined) {
      this.$store.dispatch('information/getTermsOfUse')
    }
  }
}
</script>

<style lang="scss" scoped>
.bodyCharter {
  /* TODO change that horrible style */
  background-color: #dddddd ;
  margin-top: 30px;
}
</style>

<i18n locale="fr">
{
  "confidentialityRulesLinkText": "Règles de confidentialité"
}
</i18n>
