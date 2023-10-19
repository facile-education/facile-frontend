<template>
  <li class="tag-item theme-background-color">
    <span class="label">{{ tag }}</span>
    <FontAwesomeIcon
      icon="times"
      class="icon"
      @click="onRemove"
    />
  </li>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(
  require('@fortawesome/free-solid-svg-icons/faTimes').definition
)

export default {
  name: 'WeprodeTagItem',
  components: {
    FontAwesomeIcon
  },
  props: {
    tag: {
      type: String,
      required: true
    }
  },
  emits: ['remove'],
  methods: {
    onRemove () {
      this.$emit('remove', this.tag)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/design/common';

.tag-item {
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
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    max-width: 95%;
  }

  .icon {
    margin-left: 5px;
    cursor: pointer;
  }
}
</style>
