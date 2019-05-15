<template>
  <div
    v-click-outside="close"
    class="autocomplete"
  >
    <div
      v-if="filtered"
      class="filter"
    >
      <input
        ref="filter"
        v-model="filter"
        :placeholder="$t('NeroAutocomplete.filterPlaceholder')"
      >
    </div>
    <ul class="suggestion-list">
      <li
        v-for="(item, index) in filteredList"
        :key="index"
        class="item"
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
import NeroUtils from '@/utils/nero.utils'
import clickoutside from '@/directives/clickoutside'

export default {
  name: 'NeroAutocomplete',
  directives: {
    'click-outside': clickoutside
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
    input: {
      type: String,
      default: undefined
    },
    filtered: {
      type: Boolean,
      default: false
    },
    sort: {
      type: Boolean,
      default: true
    },
    sortedType: {
      type: String,
      default: undefined
    }
  },
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
      if (!this.sortedType) {
        return NeroUtils.Array.sortWithString(this.list, this.displayField)
      }
      return NeroUtils.Array.sortWithString(this.list, this.displayField, this.sortedType)
    },
    filteredList () {
      var filter = this.input || this.filter
      return NeroUtils.Array.filter(filter, this.sortedList, this.displayField)
    }
  },
  created () {
    if (this.filtered) {
      this.$nextTick(() => this.$refs.filter.focus())
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
@import 'src/assets/css/constants';

.autocomplete {
  overflow-y: auto;
  max-height: 300px;
  position: absolute;
  background-color: $background-white-color;
  border: $border;
  border-radius: $border-radius;
  z-index: $dropdown-z-index;
  min-width: 100%;
  @extend %nero-shadow;

  .suggestion-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .filter {
    padding: 3px 20px;
    border-bottom: $border;

    input {
      width: 99%;

      &:focus {
        outline: none;
      }
    }
  }

  .item {
    @extend %no-text-highlight;
    display: block;
    padding: 3px 20px;
    white-space: nowrap;
    cursor: pointer;

    &:hover {
      background-color: #f5f5f5;
    }
  }

  .fa,
  .fas {
    margin-right: 5px;
  }
}
</style>
