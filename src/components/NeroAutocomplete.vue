<template>
  <div
    v-if="displayAutocomplete"
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
    displayAutocomplete: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      required: true
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
    }
  },
  data () {
    return {
      filter: ''
    }
  },
  computed: {
    sortedList () {
      var listCopy = this.list.slice()

      var vm = this
      function compare (a, b) {
        if (vm.displayField !== undefined) {
          a = a[vm.displayField]
          b = b[vm.displayField]
        }
        a = NeroUtils.String.normalize(a)
        b = NeroUtils.String.normalize(b)

        if (a < b) return -1
        if (a > b) return 1
        return 0
      }

      return listCopy.sort(compare)
    },
    filteredList () {
      var vm = this
      var filter = NeroUtils.String.normalize(this.input || this.filter)

      return this.sortedList.filter((item) => {
        if (filter.length === 0) {
          return true
        }
        return (NeroUtils.String.normalize(vm.getDisplayValue(item))
          .indexOf(filter) !== -1)
      })
    }
  },
  watch: {
    displayAutocomplete () {
      if (this.displayAutocomplete && this.filtered) {
        this.$nextTick(() => this.$refs.filter.focus())
      }
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
}
</style>
