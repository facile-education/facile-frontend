<template>
  <div
    class="base-dropdown"
    data-test="dropdown"
  >
    <button
      v-if="displayDropdown"
      class="button"
      type="button"
      :disabled="disabled"
      @click="toggleMenu"
      @keydown.stop.prevent.up="onUpKey"
      @keydown.stop.prevent.down="onDownKey"
      @keydown.stop.enter="onEnter"
      @keydown.stop.esc="onClose"
      @keydown.tab="onClose"
    >
      <span>
        {{ getCurrentDisplayValue() }}
      </span>
      <CustomIcon icon-name="icon-chevron-right-s" />
    </button>
    <WeprodeAutocomplete
      v-if="show"
      :list="sortedList"
      :display-field="displayField"
      :filtered="isFilterDisplayed"
      :highlighted-index="highlightedIndex"
      :style="'max-width:' + listMaxWidth + ';'"
      @keydown.stop.up="onUpKey"
      @keydown.stop.down="onDownKey"
      @keydown.stop.esc="onClose"
      @select="onSelect"
      @close="onClose"
    />
  </div>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import WeprodeUtils from '@utils/weprode.utils'

import WeprodeAutocomplete from '@/components/Base/Weprode/WeprodeAutocomplete.vue'

export default {
  name: 'WeprodeDropdown',
  components: {
    CustomIcon,
    WeprodeAutocomplete
  },
  props: {
    placeholder: {
      type: String,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    },
    displayField: {
      type: String,
      default: undefined
    },
    filtered: {
      type: Boolean,
      default: true
    },
    list: {
      type: Array,
      required: true
    },
    listMaxWidth: {
      type: String,
      default: 'none'
    },
    modelValue: {
      type: [String, Object],
      default: undefined
    },
    reversed: {
      type: Boolean,
      default: false
    },
    sort: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:modelValue'],
  data () {
    return {
      show: false,
      highlightedIndex: -1,
      isFilterDisplayed: (this.filtered && this.list.length > 5)
    }
  },
  computed: {
    displayDropdown () {
      return (this.list.length > 0)
    },
    sortedList () {
      if (!this.sort) {
        return this.list
      }

      return WeprodeUtils.sortArrayWithString(this.list, this.reversed, this.displayField)
    }
  },
  created () {
    if (this.list.length > 0) {
      if (this.modelValue === undefined) {
        if (!this.placeholder) {
          this.onSelect(this.sortedList[0])
        }
      } else {
        const index = this.sortedList.indexOf(this.modelValue)
        this.onSelect(this.sortedList[index])
      }
    }
  },
  methods: {
    toggleMenu () {
      this.show = !this.show
    },
    getCurrentDisplayValue () {
      if (!this.modelValue) {
        if (this.placeholder) {
          return this.placeholder
        } else {
          return ''
        }
      } else if (this.displayField === undefined) {
        return this.modelValue
      } else {
        return this.modelValue[this.displayField]
      }
    },
    onClose (e) {
      if (this.show && e && e.type === 'keydown') {
        e.stopPropagation()
      }
      this.show = false
      this.highlightedIndex = -1
    },
    onDownKey () {
      this.highlightedIndex === (this.sortedList.length - 1)
        ? this.highlightedIndex = 0
        : ++this.highlightedIndex
    },
    onEnter ($e) {
      if (this.show && this.highlightedIndex > -1) {
        this.onSelect(this.sortedList[this.highlightedIndex])
        $e.preventDefault()
      }
    },
    onSelect (item) {
      if (item !== undefined && item !== this.modelValue) {
        this.$emit('update:modelValue', item)
      }
      this.onClose()
    },
    onUpKey () {
      this.highlightedIndex < 1
        ? this.highlightedIndex = (this.sortedList.length - 1)
        : --this.highlightedIndex
    }
  }
}
</script>

<style lang="scss" scoped>
.base-dropdown {
  display: inline-block;
  position: relative;
}

.button {
  justify-content: space-between;
  display: flex;

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.icon-chevron-right-s {
  transform: rotate(90deg);
  margin-left: 0.5rem;
}
</style>
