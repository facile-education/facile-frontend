<template>
  <div
    class="option-item"
    :title="option.title"
    @click="optionClicked"
  >
    <img
      :src="option.icon"
      alt=""
    >
    <div class="title">
      {{ option.title }}
    </div>
  </div>
</template>

<script>

export default {
  name: 'OptionItem',
  props: {
    option: {
      type: Object,
      required: true
    }
  },
  emits: ['optionClicked'],
  methods: {
    optionClicked () {
      this.$emit('optionClicked', this.option)
    }
  }
}
</script>

<style lang="scss" scoped>
.option-item {
  display: flex;
  cursor: pointer;
  align-items: center;
  margin: 0 5px;

  img {
    width: 28px;
    height: 28px;
    padding: 5px;
  }

  .title {
    font-size: 0.875em;
  }
}
</style>
