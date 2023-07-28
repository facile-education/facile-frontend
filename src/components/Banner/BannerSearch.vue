<template>
  <div
    class="banner-search"
    data-test="banner-search"
  >
    <input
      v-if="mq.desktop"
      v-model="searchInput"
      :placeholder="$t('searchLabel') + '...'"
      class="search-input"
      @input="inputChange"
      @focus="focus"
      @blur="blur"
      @keyup.enter.stop="submit"
    >
    <span
      :title="$t('searchLabel')"
      class="search-icon"
      @click="submit"
    >
      <img
        src="@/assets/icons/search.svg"
        alt="search_icon"
      >
    </span>
  </div>
</template>

<script>
import { nbCharBeforeCompletion, timeBeforeCompletion } from '@/constants/appConstants'

export default {
  name: 'AppBannerSearch',
  inject: ['mq'],
  data () {
    return {
      timeout: 0
    }
  },
  computed: {
    searchInput: {
      get () {
        return this.$store.state.search.searchInput
      },
      set (value) {
        this.$store.dispatch('search/setSearchInput', value)
      }
    }
  },
  methods: {
    focus () {
      if (this.searchInput.length < nbCharBeforeCompletion) {
        this.$store.dispatch('search/openHistory')
      } else {
        this.$store.dispatch('search/openQuickSearchResultDisplayed')
      }
    },
    blur () {
      setTimeout(() => this.$store.dispatch('search/closeHistory'), 50)
    },
    inputChange () {
      // Handle empty case
      if (this.searchInput.length < nbCharBeforeCompletion) {
        this.$store.dispatch('search/openHistory')
      }

      // Trigger a countdown before the search
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        if (this.searchInput.length >= nbCharBeforeCompletion) {
          clearTimeout(this.timeout)
          this.runSearch()
        }
      }, timeBeforeCompletion)
    },
    submit () {
      if (this.searchInput.length >= nbCharBeforeCompletion) {
        this.runSearch()
      }
    },
    runSearch () {
      this.$store.dispatch('search/quickSearch')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.banner-search {
  margin-left: 10px;
  background-color: white;
  display: flex;
  height: 32px;
  border-radius: 6px;
}

.search-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem 0 8px;
  height: 100%;
  line-height: 32px;
  vertical-align: top;
  cursor: pointer;

  img {
    height: 18px;
  }
}

.search-input {
  height: 100%;
  width: 200px;
  padding-left: 8px;
  margin: 0;
  font-size: 12px;
  border: 0;
  background-image: none;
  border-radius: 6px;
}

.fa-search {
  font-size: 1.3rem;
}
</style>

<i18n locale="fr">
{
  "searchLabel": "Rechercher"
}
</i18n>
