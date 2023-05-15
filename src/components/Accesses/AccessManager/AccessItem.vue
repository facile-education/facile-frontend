<template>
  <div class="access">
    <h3>
      {{ access.title }}
    </h3>
  </div>
</template>

<script>
export default {
  name: 'AccessItem',
  props: {
    access: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
h3 {
  height: 50px;
  background-color: cornflowerblue;
  display: flex;
  align-items: center;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
