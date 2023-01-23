<template>
  <Layout
    class="layout"
  >
    <h1 :aria-label="$t('serviceTitle')" />
    <PentilaSpinner v-if="areActionsInProgress" />
    <PentilaInput
      v-model="searchInput"
      :placeholder="$t('searchPlaceholder')"
      :maxlength="75"
    />
    <PentilaButton
      :label="buttonLabel"
      class="confirm-button"
      :disabled="searchInput === ''"
      @click="runSearch"
    />
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/EmptyLayout'
import { search } from '@/api/search.service'

export default {
  name: 'Progression',
  components: {
    Layout
  },
  data () {
    return {
      searchInput: ''
    }
  },
  methods: {
    runSearch () {
      search(this.searchInput, true, true, true, true, 0, 10).then((data) => {
        this.isLoadingCompletion = false
        if (data.success) {
          console.log('results=', data.results)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.layout {
  height: 100%;

}
</style>

<i18n locale="fr">
{
  "serviceTitle": "Recherche avancée",
  "searchPlaceholder": "Mots-clés",
  "buttonLabel": "Rechercher"
}
</i18n>
