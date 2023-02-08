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
    >
    <span
      :title="$t('searchLabel')"
      class="search-icon"
    >
      <NeroIcon name="search" />
    </span>
  </div>
</template>

<script>
import NeroIcon from '@/components/Nero/NeroIcon'
import { nbCharBeforeCompletion, timeBeforeCompletion } from '@/constants/appConstants'

export default {
  name: 'AppBannerSearch',
  components: { NeroIcon },
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
          this.runSearch()
        }
      }, timeBeforeCompletion)
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
  border: 1px white solid;
  display: flex;
  border-radius: $border-radius;
  height: 35px;
}

.search-icon {
  width: 35px;
  height: 35px;
  line-height: 35px;
  vertical-align: top;
  text-align: center;
  cursor: pointer;
}

.search-input {
  height: 33px;
  width: 303px;
  padding: 0 0 0 8px;
  margin: 0;
  font-size: 12px;
  border: 0;
  background-image: none;
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
