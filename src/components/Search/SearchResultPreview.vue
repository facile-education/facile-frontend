<template>
  <div class="result-details">
    {{ searchResult.title }}
  </div>
</template>

<script>
import { getSearchResultDetails } from '@/api/search.service'

export default {
  name: 'SearchResultPreview',
  props: {
    searchResult: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      resultDetails: undefined
    }
  },
  created () {
    this.getResultDetails()
  },
  methods: {
    getResultDetails () {
      getSearchResultDetails(this.searchResult.entityId, this.searchResult.service).then((data) => {
        if (data.success) {
          this.resultDetails = data.result
        } else {
          console.error('Cannot get result details')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
div {
  background-color: #01d801;
}
</style>
