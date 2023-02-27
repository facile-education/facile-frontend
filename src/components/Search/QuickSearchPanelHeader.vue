<template>
  <div class="close-header">
    <button
      class="close-option"
      @click="closePanel"
    >
      <img
        src="@assets/options/icon_cross_black.svg"
        alt="close"
      >
    </button>
  </div>
  <div class="search-panel-header">
    <span
      v-if="isSearchHistory"
      class="search-history-text"
    >
      <img
        src="@/assets/history.svg"
        alt=""
      >
      <span>{{ $t('history') }} </span>
    </span>
    <span v-else>{{ nbResults + ' ' + (nbResults > 1 ? $t('results') : $t('result')) }}</span>
    <!--    <button-->
    <!--      v-if="!isAlreadyInAdvancedSearchService"-->
    <!--      class="theme-text-color"-->
    <!--      @mousedown="displayAdvancedSearch"-->
    <!--      @click="displayAdvancedSearch"-->
    <!--    >-->
    <!--      <span v-t="'advancedSearch'" />-->
    <!--      <NeroIcon-->
    <!--        class="chevron"-->
    <!--        name="chevron-right"-->
    <!--      />-->
    <!--    </button>-->
  </div>
</template>

<script>
// import NeroIcon from '@components/Nero/NeroIcon.vue'

export default {
  name: 'QuickSearchPanelHeader',
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
  padding: 0 $quick-search-horizontal-padding;
  display: flex;
  align-items: center;
  width: 100%;
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

.close-header {
  width: 100%;
  height: $quick-search-close-option-height;
  padding: 0 $quick-search-horizontal-padding;

  .close-option {
    margin-left: auto;
    height: 100%;
    display: flex;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;

    img {
      width: 16px;
      height: 16px;
    }
  }
}
</style>

<i18n locale="fr">
{
  "advancedSearch": "Recherche avancée",
  "history": "Recherché récemment...",
  "result": "Résultat",
  "results": "Résultats"
}
</i18n>
