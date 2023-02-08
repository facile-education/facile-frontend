<template>
  <Layout
    class="layout"
  >
    <h1 :aria-label="$t('serviceTitle')" />
    <PentilaInput
      v-model="searchInput"
      :placeholder="$t('searchPlaceholder')"
      :maxlength="75"
    />
    <PentilaButton
      :label="$t('search')"
      class="confirm-button"
      :disabled="searchInput === ''"
      @click="runSearch"
    />
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/BannerLayout.vue'
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
  created () {
    this.searchInput = this.$store.state.search.searchInput
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
  "search": "Rechercher",
  "serviceTitle": "Recherche avancée",
  "searchPlaceholder": "Mots-clés",
  "buttonLabel": "Rechercher"
}
</i18n>
