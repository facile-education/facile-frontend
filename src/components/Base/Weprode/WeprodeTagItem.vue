<template>
  <div
    class="tag-item theme-background-color"
    data-test="tag-item"
  >
    <span class="label">{{ tag }}</span>
    <button
      :aria-label="$t('Base.WeprodeTagItem.remove')"
      :title="$t('Base.WeprodeTagItem.remove')"
    >
      <NeroIcon
        name="times"
        class="icon"
        @click="onRemove"
      />
    </button>
  </div>
</template>

<script>

import NeroIcon from '@/components/Nero/NeroIcon.vue'

export default {
  name: 'WeprodeTagItem',
  components: {
    NeroIcon
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

  button {
    margin: 0;
    padding: 0;
    background-color: transparent;
    border: none;
    color: white;

    .icon {
      margin-left: 5px;
      cursor: pointer;
    }
  }
}
</style>
