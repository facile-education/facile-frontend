<template>
  <div
    class="component"
    data-test="tagsInput"
  >
    <div
      :class="{'default-bg': (!disabled && !isInputFocused), 'theme-light-background-color theme-border-color': isInputFocused, 'disabled': disabled}"
      class="base-tags-input"
      @mousedown="onMouseDown"
      @click="onClick"
    >
      <ul class="tag-list">
        <li
          v-for="(tag, index) in tagsToDisplay"
          :key="index"
        >
          <WeprodeTagItem
            :tag="getDisplayValue(tag)"
            @remove="removeTag"
          />
        </li>

        <li
          v-if="tagsToDisplay.length < modelValue.length"
          class="others theme-background-color"
        >
          <span class="label">{{ othersLabelTemplate(modelValue.length - tagsToDisplay.length) }}</span>
        </li>
      </ul>
      <WeprodeInput
        v-if="!reachMaxLength"
        ref="input"
        v-model="inputValue"
        :placeholder="placeholder"
        :labelled="false"
        :disabled="disabled || reachMaxLength"
        @keyup.enter="onEnter"
        @keydown.delete="onDelete"
        @keyup.up="onUpKey"
        @keyup.down="onDownKey"
        @keyup.esc="onEscape"
        @keydown.tab="onEscape"
        @blur="onBlur"
        @focus="onFocus"
        @input="onInput"
      />
    </div>
    <WeprodeAutocomplete
      v-if="displayCompletion"
      :list="filteredList"
      :display-field="displayField"
      :sort="sort"
      :sort-field="sortField"
      :highlighted-index="highlightedIndex"
      @select="addTag"
      @close="onClose"
    />
  </div>
</template>

<script>
import WeprodeUtils from '@utils/weprode.utils'

import WeprodeAutocomplete from '@/components/Base/Weprode/WeprodeAutocomplete.vue'
import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'
import WeprodeTagItem from '@/components/Base/Weprode/WeprodeTagItem.vue'

export default {
  name: 'WeprodeTagsInput',
  components: {
    WeprodeAutocomplete,
    WeprodeInput,
    WeprodeTagItem
  },
  props: {
    closeOnSelect: { type: Boolean, default: false },
    completionOnly: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    displayField: { type: String, default: undefined },
    idField: { type: String, default: undefined },
    list: { type: Array, default: () => [] },
    minLength: { type: Number, default: 0 },
    maxSize: { type: Number, default: -1 },
    modelValue: { type: Array, default: () => [] },
    placeholder: { type: String, default: '' },
    sort: { type: Boolean, default: true },
    sortField: { type: String, default: undefined },
    maxTagsToDisplay: { type: Number, default: -1 },
    othersLabelTemplate: { type: Function, default: (nbOthers) => { return 'and ' + nbOthers + ' others' } }
  },
  emits: ['blur', 'update:modelValue', 'inputChange'],
  data () {
    return {
      highlightedIndex: -1,
      isInputFocused: false,
      inputValue: '',
      mouseDownStatus: false
    }
  },
  computed: {
    displayCompletion () {
      return (this.inputValue.length >= this.minLength && this.isInputFocused) && !this.reachMaxLength
    },
    reachMaxLength () {
      return (this.maxSize !== -1 && this.modelValue.length >= this.maxSize)
    },
    sortedList () {
      if (!this.sort) {
        return this.list
      }
      const reverse = false
      return WeprodeUtils.sortArrayWithString(this.list, reverse, this.sortField !== undefined ? this.sortField : this.displayField)
    },
    tagsToDisplay () {
      if (this.maxTagsToDisplay === -1 || this.modelValue.length <= this.maxTagsToDisplay || this.isInputFocused) {
        return this.modelValue
      } else {
        return this.modelValue.slice(0, this.maxTagsToDisplay - 1)
      }
    },
    filteredList () {
      let modelValue = this.modelValue
      const vm = this

      if (this.displayField !== undefined) {
        modelValue = []
        for (let idx = 0; idx < this.modelValue.length; ++idx) {
          modelValue.push(this.getIdValue(this.modelValue[idx]))
        }
      }

      return WeprodeUtils.filterArray(this.inputValue,
        this.sortedList.filter(function (item) {
          return !modelValue.includes(vm.getIdValue(item))
        }),
        this.displayField)
    }
  },
  watch: {
    'inputValue' () {
      this.$emit('inputChange', this.inputValue)
    }
  },
  mounted () {
    if (this.completionOnly) {
      this.highlightedIndex = 0
    }
  },
  methods: {
    focus () {
      this.$refs.input.focus()
    },
    addTag (tag) {
      const tags = this.modelValue.slice()
      tags.push(tag)
      this.$emit('update:modelValue', tags)
      this.inputValue = ''
      this.highlightedIndex = -1
      if (this.closeOnSelect) {
        this.blurTagsInput()
      } else {
        this.setFocus()
      }
    },
    getDisplayValue (tag) {
      if (this.displayField === undefined) {
        return tag
      } else {
        return tag[this.displayField]
      }
    },
    getIdValue (tag) {
      // Return id if defined else return text modelValue
      if (this.idField !== undefined) {
        return tag[this.idField]
      }
      return this.getDisplayValue(tag)
    },
    blurTagsInput () {
      this.isInputFocused = false
      this.$emit('blur')
    },
    onMouseDown () {
      this.mouseDownStatus = true
    },
    onClick () {
      this.mouseDownStatus = false
      this.setFocus()
    },
    onBlur () {
      if (!this.displayCompletion && !this.mouseDownStatus) {
        this.blurTagsInput()
      }
    },
    onClose () {
      if (this.$refs.input.$el !== document.activeElement) {
        this.blurTagsInput()
      }
    },
    onDelete () {
      if (this.inputValue.length === 0 && this.modelValue.length > 0) {
        const tags = this.modelValue.slice()
        tags.pop()
        this.$emit('update:modelValue', tags)
      }
    },
    onDownKey () {
      const minValue = this.completionOnly ? 0 : -1
      this.highlightedIndex === (this.filteredList.length - 1)
        ? this.highlightedIndex = minValue
        : ++this.highlightedIndex
    },
    onEnter () {
      if (this.displayCompletion && this.highlightedIndex !== -1) {
        if (this.filteredList.length > 0) {
          this.addTag(this.filteredList[this.highlightedIndex])
        }
      } else if (!this.completionOnly && this.inputValue !== '') {
        let tag
        if (this.displayField === undefined) {
          tag = this.inputValue
        } else {
          tag = {}
          tag[this.displayField] = this.inputValue
        }
        this.addTag(tag)
      }
    },
    onEscape () {
      this.blurTagsInput()
    },
    onFocus () {
      this.isInputFocused = true
    },
    onInput () {
      this.onFocus()
      this.highlightedIndex = this.completionOnly ? 0 : -1
    },
    onUpKey () {
      const minValue = this.completionOnly ? 0 : -1
      this.highlightedIndex <= minValue
        ? this.highlightedIndex = (this.filteredList.length - 1)
        : --this.highlightedIndex
    },
    setFocus () {
      this.$nextTick(() => { if (this.$refs.input) this.$refs.input.$el.focus() })
    },
    removeTag (tagLabel) {
      const vm = this
      const tags = this.modelValue.slice().filter(function (item) {
        return (vm.getDisplayValue(item) !== tagLabel)
      })
      this.$emit('update:modelValue', tags)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/design/common';

.component {
  position: relative;
}

.base-tags-input {
  padding: 6px 2px;
  cursor: text;

  &.disabled {
    cursor: not-allowed;

    .tag-list {
      pointer-events: none;
    }
  }
}

.tag-list {
  margin: 0;
  padding: 0;
  list-style-type: none;
  vertical-align: top;
  max-width: 100%;

  li {
    display: inline-block;
  }
}

.base-input {
  border-bottom: 0;
  margin: 2px;
  padding: 0 0 0 5px;
  height: 30px;
  width: auto;
  background: none;
}

.others {
  cursor: initial;
  margin: 2px;
  padding: 0 5px;
  display: inline-flex;
  font-size: 0.8rem;
  height: 30px;
  line-height: 30px;
  border-radius: 3px;
  align-items: center;
  max-width: 100%;

  @extend %no-text-highlight;

  .label {
    white-space: nowrap;
    display: inline-block;
    max-width: 95%;
  }
}
</style>
