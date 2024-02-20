<template>
  <h1 :aria-label="$t('AdvancedSearch.serviceTitle')" />
  <WeprodeInput
    v-model="searchInput"
    :placeholder="$t('AdvancedSearch.searchPlaceholder')"
    :maxlength="75"
  />
  <WeprodeButton
    :label="$t('AdvancedSearch.search')"
    class="confirm-button"
    :disabled="searchInput === ''"
    @click="runSearch"
  />
</template>

<script>
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'

import { search } from '@/api/search.service'
import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'

export default {
  name: 'Progression',
  components: { WeprodeButton, WeprodeInput },
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
