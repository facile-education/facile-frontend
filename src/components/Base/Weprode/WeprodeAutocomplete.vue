<template>
  <div
    v-click-outside="close"
    class="base-autocomplete"
    @click.stop
  >
    <div
      v-if="filtered"
      class="filter"
    >
      <WeprodeInput
        ref="filter"
        v-model="filter"
        v-bind="$attrs"
        :labelled="false"
        :placeholder="placeholder"
        @keydown.stop.enter="onEnter"
      />
    </div>
    <ul class="suggestion-list">
      <li
        v-for="(item, index) in filteredList"
        :key="index"
        class="item theme-hover-light-background-color"
        :class="{'theme-light-background-color': (index === highlightedIndex)}"
        @click="onSelect(item)"
      >
        <i
          v-if="item.icon"
          :class="item.icon"
        />
        {{ getDisplayValue(item) }} <slot />
      </li>
    </ul>
  </div>
</template>

<script>
import WeprodeUtils from '@utils/weprode.utils'
import { directive } from 'vue3-click-away'

import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'

export default {
  name: 'WeprodeAutocomplete',
  components: { WeprodeInput },
  directives: {
    'click-outside': directive
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    displayField: {
      type: String,
      default: undefined
    },
    filtered: {
      type: Boolean,
      default: false
    },
    highlightedIndex: {
      type: Number,
      default: -1
    },
    input: {
      type: String,
      default: undefined
    },
    reversed: {
      type: Boolean,
      default: false
    },
    sort: {
      type: Boolean,
      default: false
    },
    sortField: {
      type: String,
      default: undefined
    },
    placeholder: {
      type: String,
      default: 'Filtrer'
    }
  },
  emits: ['select', 'close'],
  data () {
    return {
      filter: ''
    }
  },
  computed: {
    sortedList () {
      if (!this.sort) {
        return this.list
      }
      return WeprodeUtils.sortArrayWithString(this.list, this.reversed, this.sortField !== undefined ? this.sortField : this.displayField)
    },
    filteredList () {
      const filter = this.input || this.filter
      return WeprodeUtils.filterArray(filter, this.sortedList, this.displayField)
    }
  },
  created () {
    if (this.filtered) {
      this.$nextTick(() => this.$refs.filter.$el.focus())
    }
  },
  mounted () {
    const autocomplete = this.$el

    // Prevent autocomplete to overflow the screen height
    const nbPixelsBeforeBottom = window.innerHeight - (autocomplete.getBoundingClientRect().top + autocomplete.getBoundingClientRect().height)
    if (nbPixelsBeforeBottom <= 10) {
      autocomplete.style.bottom = 'calc(100% + 4px)'
    } else {
      autocomplete.style.top = 'calc(100% + 4px)'
    }

    // Prevent autocomplete to overflow the screen width
    const isRightOverflow = autocomplete.getBoundingClientRect().right > window.innerWidth - 10 // With 10px of margin
    if (isRightOverflow) {
      autocomplete.style.right = '0'
    }
  },
  methods: {
    getDisplayValue (item) {
      if (this.displayField === undefined) {
        return item
      } else {
        return item[this.displayField]
      }
    },
    onEnter () {
      this.onSelect(this.filteredList[this.highlightedIndex])
    },
    onSelect (item) {
      this.$emit('select', item)
      this.filter = ''
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/design/common';

.base-autocomplete {
  background-color: $background-white-color;
  overflow-y: auto;
  position: absolute;
  max-height: 300px;
  min-width: 100%;
  z-index: $dropdown-z-index;

  .suggestion-list {
    list-style: none;
    margin: 0;
    padding: 10px;
  }

  .filter {
    padding: 10px;
  }

  .item {
    @extend %no-text-highlight;
    display: block;
    padding: 4px 10px;
    white-space: nowrap;
    cursor: pointer;
  }

  .fa,
  .fas {
    margin-right: 5px;
  }
}
</style>
