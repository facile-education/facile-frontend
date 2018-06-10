<template>
  <div class="dropdown">
    <button
      class="button"
      @click="toggleMenu">
      {{ getDisplayValue(selectedItem) }}
      <i class="fa fa-caret-down theme-text-color"/>
    </button>
    <div
      v-click-outside="toggleMenu"
      v-if="show"
      class="menu">
      <div
        v-if="filtered"
        class="filter">
        <input
          ref="filter"
          v-model="filter"
          placeholder="TODO placeholder">
      </div>
      <span
        v-for="(item, index) in filteredList"
        :key="index"
        class="item"
        @click="onSelect(item)">
        {{ getDisplayValue(item) }}
      </span>
    </div>
  </div>
</template>

<script>
import clickoutside from '@/directives/clickoutside'

export default {
  name: 'NeroDropdown',
  directives: {
    'click-outside': clickoutside
  },
  props: {
    list: {
      type: Array,
      required: true
    },
    displayField: {
      type: String,
      default: undefined
    }
  },
  data () {
    return {
      show: false,
      selectedItem: undefined,
      filtered: this.list.length > 5,
      filter: ''
    }
  },
  computed: {
    filteredList () {
      var vm = this
      return this.list.filter(function (item) {
        if (vm.filter.length === 0) {
          return true
        }
        return (vm.getDisplayValue(item)
          .toLowerCase()
          .indexOf(vm.filter.toLowerCase()) !== -1)
      })
    }
  },
  created () {
    this.onSelect(this.list[0])
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
      this.$emit('dropdown-select', item)
      this.selectedItem = item
      this.show = false
    },
    toggleMenu () {
      this.show = !this.show
      if (this.show) {
        this.$nextTick(() => this.$refs.filter.focus())
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';
.dropdown {
  display: inline-block;
  position: relative;
}

.button {
  @extend %nero-btn-like;
  background-color: #f9f9f9;

  &:hover {
    background-color: #e4e4e4;
  }
}

.menu {
  overflow-y: auto;
  max-height: 300px;
  position: absolute;
  background-color: $background-white-color;
  border: $border;
  border-radius: $border-radius;
  z-index: $dropdown-z-index;
  @extend %nero-shadow;

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
