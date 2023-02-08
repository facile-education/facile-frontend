<template>
  <li
    :class="{'selected': isSelected}"
    @mousedown="redirect"
  >
    <span>{{ searchResult.title }}</span>
  </li>
</template>

<script>
export default {
  name: 'QuickSearchResultItem',
  props: {
    searchResult: {
      type: Object,
      required: true
    },
    isSelected: {
      type: Boolean,
      required: true
    },
    isLast: {
      type: Boolean,
      default: false
    }
  },
  watch: { // Must be watched to react on a new search
    isLast: {
      handler () {
        if (this.isLast) {
          if (this.isInViewport(this.$el)) {
            this.$store.dispatch('search/quickSearch', false)
          }
        }
      }
    }
  },
  mounted () {
    window.addEventListener('keydown', this.keyMonitor)
    if (this.isLast) {
      if (this.isInViewport(this.$el)) {
        this.$store.dispatch('search/quickSearch', false) // get the followings results because it's the last element of the scroll but still visible
      }
    }
  },
  beforeUnmount () {
    window.removeEventListener('keydown', this.keyMonitor)
  },
  methods: {
    isInViewport (element) {
      const rect = element.getBoundingClientRect()
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      )
    },
    keyMonitor (event) {
      if (event.key === 'Enter' && this.isSelected) {
        this.redirect()
      }
    },
    redirect () {
      console.log('TODO')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

li {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 $quick-search-horizontal-padding;
  border-bottom: 1px solid $color-border;
  cursor: pointer;

  &:hover, &.selected {
    background-color: $color-hover-bg;
  }
}
</style>
