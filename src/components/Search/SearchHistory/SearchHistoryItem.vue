<template>
  <li
    :class="{'selected': isSelected}"
    @mousedown="selectHistoryItem"
  >
    <span>{{ item.query }}</span>
  </li>
</template>

<script>
export default {
  name: 'SearchHistoryItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    isSelected: {
      type: Boolean,
      required: true
    }
  },
  mounted () {
    window.addEventListener('keydown', this.keyMonitor)
  },
  beforeUnmount () {
    window.removeEventListener('keydown', this.keyMonitor)
  },
  methods: {
    keyMonitor (event) {
      if (event.key === 'Enter' && this.isSelected) {
        this.selectHistoryItem()
      }
    },
    selectHistoryItem () {
      this.$store.dispatch('search/setSearchInput', this.item.query)
      this.$store.dispatch('search/quickSearch')
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
