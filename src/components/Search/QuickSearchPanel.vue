<template>
  <section class="quick-search-panel">
    <SearchHistory v-if="isSearchHistoryDisplayed" />
    <QuickSearchResults v-else-if="isQuickSearchResultDisplayed" />
  </section>
</template>

<script>
import { defineAsyncComponent } from 'vue'
const QuickSearchResults = defineAsyncComponent(() => import('@components/Search/QuickSearchResults/QuickSearchResults'))
const SearchHistory = defineAsyncComponent(() => import('@components/Search/SearchHistory/SearchHistory'))

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
