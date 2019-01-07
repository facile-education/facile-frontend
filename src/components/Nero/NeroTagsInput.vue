<template>
  <div class="component">
    <div
      :class="cls"
      class="tags-input"
      @click="onFocus"
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
      >
    </div>
    <NeroAutocomplete
      :list="filteredList"
      :display-field="displayField"
      :display-autocomplete="displayCompletion"
      :input="inputValue"
      @select="addTag"
      @close="hideCompletion"
    />
  </div>
</template>

<script>
import NeroTagItem from '@/components/Nero/NeroTagItem'
import NeroAutocomplete from '@/components/Nero/NeroAutocomplete'

// TODO display autocomplete / key listeners (return, delete, arrows up down) / contact (group ?) button
// TODO tabs -> required
export default {
  name: 'NeroTagsInput',
  components: {
    NeroTagItem,
    NeroAutocomplete
  },
  props: {
    list: { type: Array, required: true },
    value: { type: Array, default: () => [] },
    placeholder: { type: String, default: '' },
    cls: { type: String, default: '' },
    displayField: { type: String, default: undefined },
    completionOnly: { type: Boolean, default: false },
    minLength: { type: Number, default: 0 }
  },
  data () {
    return {
      inputValue: '',
      focus: false
    }
  },
  computed: {
    displayCompletion () {
      return (this.inputValue.length >= this.minLength && this.focus)
    },
    filteredList () {
      var value = this.value
      return this.list.filter(function (item) {
        return !value.includes(item)
      })
    }
  },
  methods: {
    getDisplayValue (tag) {
      if (this.displayField === undefined) {
        return tag
      } else {
        return tag[this.displayField]
      }
    },
    onFocus () {
      this.$refs.input.focus()
      this.focus = true
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
    addTag (tag) {
      var tags = this.value.slice()
      tags.push(tag)
      this.$emit('input', tags)
      this.inputValue = ''
      this.$nextTick(() => this.$refs.input.focus())
    },
    removeTag (tagLabel) {
      var vm = this
      var tags = this.value.slice().filter(function (item) {
        return (vm.getDisplayValue(item) !== tagLabel)
      })
      this.$emit('input', tags)
    },
    onDelete () {
      if (this.inputValue.length === 0 && this.value.length > 0) {
        var tags = this.value.slice()
        tags.pop()
        this.$emit('input', tags)
      }
    },
    hideCompletion () {
      if (this.$refs.input !== document.activeElement) {
        this.focus = false
      }
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

  &.form {
      padding: 4px 2px;
  }
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
  margin: 2px;
  padding: 0 0 0 5px;
  height: 26px;
  width: auto;
}
</style>
