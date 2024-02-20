<template>
  <div class="search-panel-header">
    <span
      v-if="isSearchHistory"
      class="search-history-text"
    >
      <img
        src="@/assets/icons/history.svg"
        alt=""
      >
      <span>{{ $t('Search.QuickSearchPanelHeader.history') }} </span>
    </span>
    <span v-else>{{ nbResults + ' ' + (nbResults > 1 ? $t('Search.QuickSearchPanelHeader.results') : $t('Search.QuickSearchPanelHeader.result')) }}</span>
    <!--    <button-->
    <!--      v-if="!isAlreadyInAdvancedSearchService"-->
    <!--      class="theme-text-color"-->
    <!--      @mousedown="displayAdvancedSearch"-->
    <!--      @click="displayAdvancedSearch"-->
    <!--    >-->
    <!--      <span v-t="'Search.QuickSearchPanelHeader.advancedSearch'" />-->
    <!--      <NeroIcon-->
    <!--        class="chevron"-->
    <!--        name="chevron-right"-->
    <!--      />-->
    <!--    </button>-->
    <button
      class="close-option"
      data-test="CloseQuickSearchPanel"
      @click="closePanel"
    >
      <CustomIcon
        icon-name="icon-cross-L"
        class="icon"
      />
    </button>
  </div>
</template>

<script>
// import NeroIcon from '@components/Nero/NeroIcon.vue'

import CustomIcon from '@components/Base/CustomIcon.vue'

export default {
  name: 'QuickSearchPanelHeader',
  components: { CustomIcon },
  // components: { NeroIcon },
  props: {
    isSearchHistory: {
      type: Boolean,
      default: false
    },
    nbResults: {
      type: Number,
      default: 0
    }
  },
  computed: {
    isAlreadyInAdvancedSearchService () {
      return this.$route.name === 'AdvancedSearch'
    }
  },
  methods: {
    closePanel () {
      this.$store.dispatch('search/closeHistory')
      this.$store.dispatch('search/closeQuickSearchResultDisplayed')
    },
    displayAdvancedSearch () {
      this.$router.push({ name: 'AdvancedSearch' })
      this.$store.dispatch('search/closeQuickSearchResultDisplayed')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.search-panel-header {
  height: $quick-search-banner-height;
  width: $quick-search-result-width;
  padding: 0 $quick-search-horizontal-padding;
  display: flex;
  align-items: center;
}

.search-history-text {
  display: flex;
  align-items: center;
  font-size: 0.75em;

  img{
    margin-top: -2px;
    vertical-align: center;
    margin-right: 10px;
  }
}

button {
  margin-left: auto;
  padding: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;

  .chevron {
    margin-left: 10px;
  }
}

.close-option {
  margin-left: auto;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;

  .icon {
    font-size: 1.25rem;
    font-weight: bold;
  }
}
</style>
