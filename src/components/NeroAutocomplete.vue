<template>
  <div
    v-click-outside="close"
    v-if="displayAutocomplete"
    class="autocomplete">
    <div
      v-if="filtered"
      class="filter">
      <input
        ref="filter"
        v-model="filter"
        placeholder="TODO label placeholder">
    </div>
    <ul class="suggestion-list">
      <li
        v-for="(item, index) in filteredList"
        :key="index"
        class="item"
        @click="onSelect(item)">
        {{ getDisplayValue(item) }} <slot/>
      </li>
    </ul>
  </div>
</template>

<script>
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
    filteredList () {
      var vm = this
      var filter = this.input || this.filter
      return this.list.filter(function (item) {
        if (filter.length === 0) {
          return true
        }
        return (vm.getDisplayValue(item)
          .toLowerCase()
          .indexOf(filter.toLowerCase()) !== -1)
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
    display: block;
    padding: 3px 20px;
    white-space: nowrap;

    &:hover {
      background-color: #f5f5f5;
    }
  }
}
</style>
