<template>
  <section class="quick-search-panel">
    <SearchHistory v-if="isSearchHistoryDisplayed" />
    <QuickSearchResults v-else-if="isQuickSearchResultDisplayed" />
  </section>
</template>

<script>
import QuickSearchResults from '@components/Search/QuickSearchResults/QuickSearchResults.vue'
import SearchHistory from '@components/Search/SearchHistory/SearchHistory.vue'

export default {
  name: 'QuickSearchPanel',
  components: { SearchHistory, QuickSearchResults },
  computed: {
    isSearchHistoryDisplayed () {
      return this.$store.state.search.isHistoryOpen
    },
    isQuickSearchResultDisplayed () {
      return this.$store.state.search.isQuickSearchResultDisplayed
    }
  }
}
</script>

<style lang="scss" scoped>
.quick-search-panel {
  position: relative;
}
</style>
