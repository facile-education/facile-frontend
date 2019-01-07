<template>
  <li class="tag-item theme-background-color">
    {{ tag }}
    <i
      class="fa fa-times"
      @click="onRemove"
    />
  </li>
</template>

<script>
export default {
  name: 'NeroTagItem',
  props: {
    tag: {
      type: String,
      required: true
    }
  },
  methods: {
    onRemove () {
      this.$emit('remove', this.tag)
    }
  }
}
</script>

<style lang="scss" scoped>
.tag-item {
  margin: 2px;
  padding: 0 5px;
  display: inline-block;
  font-size: 10px;
  height: 26px;
  line-height: 26px;
  border-radius: 3px;

  i {
    cursor: pointer;
  }
}
</style>
