<template>
  <QuickSearchPanelHeader :nb-results="total" />
  <WeprodeSpinner v-if="isLoadingResults" />
  <ul
    v-if="searchResults && searchResults.length > 0"
    ref="scroll"
    @scroll="handleScroll"
  >
    <li
      v-for="(item, index) in searchResults"
      :key="index"
    >
      <QuickSearchResultItem
        :search-result="item"
        :is-selected="currentSelectedItem ? currentSelectedItem.entityId === item.entityId : false"
        :is-last="index === searchResults.length - 1"
      />
    </li>
  </ul>
</template>

<script>
import QuickSearchPanelHeader from '@components/Search/QuickSearchPanelHeader'
import { defineAsyncComponent } from 'vue'

import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
const QuickSearchResultItem = defineAsyncComponent(() => import('@components/Search/QuickSearchResults/QuickSearchResultItem'))

let oldScrollTop = 0

export default {
  name: 'QuickSearchResults',
  components: { QuickSearchResultItem, QuickSearchPanelHeader, WeprodeSpinner },
  data () {
    return {
      currentSelectedItem: undefined
    }
  },
  computed: {
    isLoadingResults () {
      return this.$store.getters['currentActions/isInProgress']('getQuickSearch')
    },
    searchResults () {
      return this.$store.state.search.quickSearchResults
    },
    total () {
      return this.$store.state.search.quickSearchTotal
    }
  },
  mounted () {
    window.addEventListener('keydown', this.keyMonitor)
  },
  beforeUnmount () {
    window.removeEventListener('keydown', this.keyMonitor)
  },
  methods: {
    handleScroll () {
      const scroll = this.$refs.scroll
      if (scroll.scrollTop > oldScrollTop) { // if we go down
        const nbPixelsBeforeBottom = scroll.scrollHeight - (scroll.scrollTop + scroll.clientHeight)

        if (nbPixelsBeforeBottom <= 0) {
          if (!this.isLoadingResults) {
            this.$store.dispatch('search/quickSearch', false) // Get next results
          }
        }
      }
      oldScrollTop = scroll.scrollTop
    },
    keyMonitor (event) {
      if (event.key === 'ArrowDown') {
        this.selectNextItem()
      } else if (event.key === 'ArrowUp') {
        this.selectPreviousItem()
      }
    },
    selectNextItem () {
      if (this.currentSelectedItem === undefined) {
        this.currentSelectedItem = this.searchResults[0]
      } else if (this.searchResults.map(item => item.entityId).indexOf(this.currentSelectedItem.entityId) === this.searchResults.length - 1) { // The last item
        // Do nothing
      } else {
        const currentIndex = this.searchResults.map(item => item.entityId).indexOf(this.currentSelectedItem.entityId)
        this.currentSelectedItem = this.searchResults[currentIndex + 1]
      }
    },
    selectPreviousItem () {
      if (this.currentSelectedItem === undefined) {
        this.currentSelectedItem = this.searchResults[this.searchResults.length - 1]
      } else if (this.searchResults.map(item => item.entityId).indexOf(this.currentSelectedItem.entityId) === 0) { // The first item
        // Do nothing
      } else {
        const currentIndex = this.searchResults.map(item => item.entityId).indexOf(this.currentSelectedItem.entityId)
        this.currentSelectedItem = this.searchResults[currentIndex + -1]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
  height: calc(100% - #{$quick-search-banner-height});
  overflow-y: auto;
}
</style>
