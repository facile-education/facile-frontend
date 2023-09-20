<template>
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
</template>

<script>
import { search } from '@/api/search.service'

export default {
  name: 'Progression',
  emits: ['update:layout'],
  data () {
    return {
      searchInput: ''
    }
  },
  beforeCreate () {
    this.$emit('update:layout', 'BannerLayout')
  },
  created () {
    this.searchInput = this.$store.state.search.searchInput
  },
  methods: {
    runSearch () {
      search(this.searchInput, true, true, true, true, 0, 10).then((data) => {
        this.isLoadingCompletion = false
        if (data.success) {
          // TODO
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

<i18n locale="fr">
{
  "search": "Rechercher",
  "serviceTitle": "Recherche avancée",
  "searchPlaceholder": "Mots-clés",
  "buttonLabel": "Rechercher"
}
</i18n>
