<template>
  <div
    class="previous-item"
    :class="{'selected': isSelected}"
    @mousedown="selectHistoryItem"
  >
    <div class="text">
      {{ item.query }}
    </div>
    <div class="date">
      {{ formattedDate }}
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

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
  computed: {
    formattedDate () {
      return dayjs(this.item.date, 'YYYY-MM-DD HH:mm:ss').calendar()
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

.previous-item {
  --date-width: 80px;

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

.text {
  flex: 1;
  max-width: calc(100% - var(--date-width));
}

.date {
  width: var(--date-width);
  font-size: 0.725em;
  color: $color-new-light-text;
  text-align: right;
}
</style>
