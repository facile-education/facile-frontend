<template>
  <QuickSearchPanelHeader :is-search-history="true" />
  <WeprodeSpinner v-if="isLoadingHistory" />
  <ul v-if="sortedHistoryList.length > 0">
    <li
      v-for="(item, index) in sortedHistoryList"
      :key="index"
    >
      <SearchHistoryItem
        :item="item"
        :is-selected="currentSelectedItem ? currentSelectedItem.historyId === item.historyId : false"
      />
    </li>
  </ul>
</template>

<script>
import QuickSearchPanelHeader from '@components/Search/QuickSearchPanelHeader.vue'
import SearchHistoryItem from '@components/Search/SearchHistory/SearchHistoryItem.vue'
import { compare } from '@utils/commons.util'

import { getLastSearchQueries } from '@/api/search.service'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'

export default {
  name: 'SearchHistory',
  components: { QuickSearchPanelHeader, SearchHistoryItem, WeprodeSpinner },
  data () {
    return {
      historyList: [],
      currentSelectedItem: undefined
    }
  },
  computed: {
    isLoadingHistory () {
      return this.$store.getters['currentActions/isInProgress']('getSearchHistory')
    },
    sortedHistoryList () {
      if (this.historyList.length > 0) {
        return this.historyList.slice().sort(compare('date', false))
      } else {
        return []
      }
    }
  },
  created () {
    this.getHistoryList()
  },
  mounted () {
    window.addEventListener('keydown', this.keyMonitor)
  },
  beforeUnmount () {
    window.removeEventListener('keydown', this.keyMonitor)
  },
  methods: {
    getHistoryList () {
      this.$store.dispatch('currentActions/addAction', { name: 'getSearchHistory' })
      getLastSearchQueries().then((data) => {
        this.$store.dispatch('currentActions/removeAction', { name: 'getSearchHistory' })
        if (data.success) {
          this.historyList = data.results
        } else {
          console.error('Error while retrieving quickSearchResult')
        }
      }, (err) => {
        console.error(err)
        this.$store.dispatch('currentActions/removeAction', { name: 'getSearchHistory' })
      })
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
        this.currentSelectedItem = this.sortedHistoryList[0]
      } else if (this.sortedHistoryList.map(item => item.historyId).indexOf(this.currentSelectedItem.historyId) === this.sortedHistoryList.length - 1) { // The last item
        // Do nothing
      } else {
        const currentIndex = this.sortedHistoryList.map(item => item.historyId).indexOf(this.currentSelectedItem.historyId)
        this.currentSelectedItem = this.sortedHistoryList[currentIndex + 1]
      }
    },
    selectPreviousItem () {
      if (this.currentSelectedItem === undefined) {
        this.currentSelectedItem = this.sortedHistoryList[this.sortedHistoryList.length - 1]
      } else if (this.sortedHistoryList.map(item => item.historyId).indexOf(this.currentSelectedItem.historyId) === 0) { // The first item
        // Do nothing
      } else {
        const currentIndex = this.sortedHistoryList.map(item => item.historyId).indexOf(this.currentSelectedItem.historyId)
        this.currentSelectedItem = this.sortedHistoryList[currentIndex + -1]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
</style>
