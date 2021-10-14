<template>
  <div class="current-options">
    <OptionItem
      v-for="(option, index) in options"
      :key="index"
      :option="option"
      @optionClicked="emitOption"
    />
  </div>
</template>

<script>
import OptionItem from '@components/Documents/OptionItem'
export default {
  name: 'Options',
  components: { OptionItem },
  props: {
    options: {
      type: Array,
      required: true
    }
  },
  emits: ['optionClicked'],
  methods: {
    emitOption (option) {
      this.$emit('optionClicked', option)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.current-options {
  border-bottom: 1px solid $color-border;
  display: flex;
  align-items: center;
}

</style>
