<template>
  <WeprodeInput
    v-model="searchInput"
    class="search-input"
    :placeholder="$t('HelpModal.HelpSearch.searchPlaceholder')"
    :maxlength="75"
    @input="inputHandler"
  />
</template>

<script>
import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'
export default {
  name: 'HelpSearch',
  components: { WeprodeInput },
  data () {
    return {
      searchInput: '',
      timeout: undefined
    }
  },
  methods: {
    inputHandler () {
      if (this.searchInput.length === 0) { // 0 for reset search results
        this.getHelpMenu()
      } else {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          if (this.searchInput.length >= 3) {
            this.getHelpMenu()
          }
        }, 1000)
      }
    },
    getHelpMenu () {
      this.$store.dispatch('help/getHelpMenu', { query: this.searchInput })
    }
  }
}
</script>

<style lang="scss" scoped>
.search-input {
  width: 100%;
}
</style>
