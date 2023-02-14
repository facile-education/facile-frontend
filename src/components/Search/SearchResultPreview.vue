<template>
  <div
    ref="tooltip"
    class="result-details"
  >
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
    },
    fixedPosition: {
      type: Object,
      default: undefined
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
  mounted () {
    if (this.fixedPosition) {
      //  Set x position
      this.$refs.tooltip.style.left = this.fixedPosition.x + 'px'

      // Set y position, prevent windows overflow
      const domRect = this.$refs.tooltip.getBoundingClientRect()
      const yOverflow = (this.fixedPosition.y + domRect.height) - window.innerHeight
      if (yOverflow > 0) {
        this.$refs.tooltip.style.top = this.fixedPosition.y - yOverflow + 'px'
      } else {
        this.$refs.tooltip.style.top = this.fixedPosition.y + 'px'
      }
    }
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
