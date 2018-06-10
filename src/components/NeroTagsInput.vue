<template>
  <div>
    <div
      :class="cls"
      class="tags-input"
      @click="onFocus">
      <ul class="tag-list">
        <NeroTagItem
          v-for="(tag, index) in value"
          :key="index"
          :tag="getDisplayValue(tag)"/>
      </ul>
      <input
        ref="input"
        v-model="inputValue"
        :placeholder="placeholder"
        class="input"
        @keyup.enter="onEnter"
        @keyup.delete="onDelete">
    </div>
    <NeroAutocomplete
      :min-length="3"
      :filter="inputValue"/>
  </div>
</template>

<script>
import NeroTagItem from '@/components/NeroTagItem'
import NeroAutocomplete from '@/components/NeroAutocomplete'

// TODO display autocomplete / key listeners (return, delete, arrows up down) / contact (group ?) button
// TODO tabs -> required
export default {
  name: 'NeroTagsInput',
  components: {
    NeroTagItem,
    NeroAutocomplete
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: ''
    },
    cls: {
      type: String,
      default: ''
    },
    displayField: {
      type: String,
      default: undefined
    },
    completionOnly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      inputValue: ''
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
    },
    onDelete () {
      console.log('on delete')
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

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
