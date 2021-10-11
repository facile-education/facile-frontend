<template>
  <div
    class="option-item"
    :title="option.title"
    @click="optionClicked"
  >
    <img
      :src="option.img"
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
  padding: 0 2px;

  img {
    width: 33px;
    height: 33px;
    padding: 5px;
  }
}
</style>
