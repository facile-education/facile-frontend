<template>
  <div
    class="dropdown"
  >
    <button
      v-if="displayDropdown"
      class="button"
      @click="toggleMenu"
    >
      {{ getDisplayValue(selectedItem) }}
      <i class="fa fa-caret-down theme-text-color" />
    </button>
    <NeroAutocomplete
      :list="list"
      :display-field="displayField"
      :filtered="filtered"
      :display-autocomplete="show"
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
      filtered: this.list.length > 5
    }
  },
  computed: {
    displayDropdown () {
      return (this.list.length > 0)
    }
  },
  created () {
    if (this.list.length > 0) {
      this.onSelect(this.list[0])
    }
  },
  methods: {
    toggleMenu () {
      this.show = !this.show
    },
    getDisplayValue (item) {
      if (this.displayField === undefined) {
        return item
      } else {
        return item[this.displayField]
      }
    },
    onSelect (item) {
      if (item !== undefined) {
        this.$emit('dropdown-select', item)
        this.selectedItem = item
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
