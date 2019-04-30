<template>
  <div class="component">
    <div
      :class="cssClasses"
      class="tags-input"
      @click="setFocus"
    >
      <ul class="tag-list">
        <NeroTagItem
          v-for="(tag, index) in value"
          :key="index"
          :tag="getDisplayValue(tag)"
          @remove="removeTag"
        />
      </ul>
      <input
        ref="input"
        v-model="inputValue"
        :placeholder="placeholder"
        class="input"
        @keyup.enter="onEnter"
        @keydown.delete="onDelete"
        @focus="onFocus"
      >
      <!-- @blur="onBlur" -->
    </div>
    <NeroAutocomplete
      v-if="displayCompletion"
      :list="filteredList"
      :display-field="displayField"
      :input="inputValue"
      @select="addTag"
      @close="hideCompletion"
    />
  </div>
</template>

<script>
import NeroTagItem from '@/components/Nero/NeroTagItem'
import NeroAutocomplete from '@/components/Nero/NeroAutocomplete'

export default {
  name: 'NeroTagsInput',
  components: {
    NeroTagItem,
    NeroAutocomplete
  },
  props: {
    cls: { type: String, default: '' },
    completionOnly: { type: Boolean, default: false },
    displayField: { type: String, default: undefined },
    idField: { type: String, default: undefined },
    list: { type: Array, default: () => [] },
    minLength: { type: Number, default: 0 },
    placeholder: { type: String, default: '' },
    value: { type: Array, default: () => [] }
  },
  data () {
    return {
      isInputFocused: false,
      inputValue: ''
    }
  },
  computed: {
    cssClasses () {
      return this.cls + (this.isInputFocused ? ' theme-border-color' : '')
    },
    displayCompletion () {
      return (this.inputValue.length >= this.minLength && this.isInputFocused)
    },
    filteredList () {
      var value = this.value
      var vm = this

      if (this.displayField !== undefined) {
        value = []
        for (var idx = 0; idx < this.value.length; ++idx) {
          value.push(this.getIdValue(this.value[idx]))
        }
      }

      return this.list.filter(function (item) {
        return !value.includes(vm.getIdValue(item))
      })
    }
  },
  methods: {
    addTag (tag) {
      var tags = this.value.slice()
      tags.push(tag)
      this.$emit('input', tags)
      this.inputValue = ''
      this.$nextTick(() => this.$refs.input.focus())
    },
    getDisplayValue (tag) {
      if (this.displayField === undefined) {
        return tag
      } else {
        return tag[this.displayField]
      }
    },
    getIdValue (tag) {
      // Return id if defined else return text value
      if (this.idField !== undefined) {
        return tag[this.idField]
      }
      return this.getDisplayValue(tag)
    },
    hideCompletion () {
      if (this.$refs.input !== document.activeElement) {
        this.isInputFocused = false
      }
    },
    onBlur () {
      this.hideCompletion()
    },
    onDelete () {
      if (this.inputValue.length === 0 && this.value.length > 0) {
        var tags = this.value.slice()
        tags.pop()
        this.$emit('input', tags)
      }
    },
    onEnter () {
      // If not only complete results
      if (!this.completionOnly) {
        var tag
        if (this.displayField === undefined) {
          tag = this.inputValue
        } else {
          tag = {}
          tag[this.displayField] = this.inputValue
        }
        this.addTag(tag)
      }
    },
    onFocus () {
      this.isInputFocused = true
    },
    setFocus () {
      this.$refs.input.focus()
    },
    removeTag (tagLabel) {
      var vm = this
      var tags = this.value.slice().filter(function (item) {
        return (vm.getDisplayValue(item) !== tagLabel)
      })
      this.$emit('input', tags)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.component {
  position: relative;
}

.tags-input {
  @extend %nero-input;
  padding: 4px 2px;
  cursor: text;
}

.tag-list {
  margin: 0;
  padding: 0;
  display: inline-block;
  list-style-type: none;
  vertical-align: top;
}

.input {
  @extend %nero-input;
  border-bottom: 0;
  margin: 2px;
  padding: 0 0 0 5px;
  height: 26px;
  width: auto;
}
</style>
