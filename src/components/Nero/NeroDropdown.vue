<template>
  <div
    class="dropdown"
  >
    <button
      v-if="displayDropdown"
      class="button"
      @click="toggleMenu"
    >
      {{ getCurrentDisplayValue() }}
      <i class="fa fa-caret-down theme-text-color" />
    </button>
    <NeroAutocomplete
      v-if="show"
      :list="list"
      :display-field="displayField"
      :filtered="isFilterDisplayed"
      :sort="sort"
      :sorted-type="sortedType"
      @select="onSelect"
      @close="onClose"
    />
  </div>
</template>

<script>
import NeroAutocomplete from '@/components/Nero/NeroAutocomplete'

export default {
  name: 'NeroDropdown',
  components: {
    NeroAutocomplete
  },
  props: {
    displayField: {
      type: String,
      default: undefined
    },
    list: {
      type: Array,
      required: true
    },
    value: {
      type: [String, Object],
      default: undefined
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
      show: false,
      isFilterDisplayed: (this.list.length > 5)
    }
  },
  computed: {
    displayDropdown () {
      return (this.list.length > 0)
    }
  },
  created () {
    if (this.list.length > 0) {
      if (this.value === undefined) {
        this.onSelect(this.list[0])
      } else {
        var index = this.list.indexOf(this.value)
        this.onSelect(this.list[index])
      }
    }
  },
  methods: {
    toggleMenu () {
      this.show = !this.show
    },
    getCurrentDisplayValue () {
      if (!this.value) {
        return ''
      } else if (this.displayField === undefined) {
        return this.value
      } else {
        return this.value[this.displayField]
      }
    },
    onSelect (item) {
      if (item !== undefined) {
        this.$emit('dropdown-select', item)
        this.$emit('input', item)
      }
      this.show = false
    },
    onClose () {
      this.show = false
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
  background-color: $dropdown-background-color;
  width: 100%;
  height: 100%;

  &:hover {
    background-color: $menu-selected-background-color;
    @include transition(background-color, 0.2s, linear);
  }
}
</style>
