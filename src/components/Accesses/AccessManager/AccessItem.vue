<template>
  <div class="access">
    {{ access.title }}
  </div>
</template>

<script>
export default {
  name: 'AccessItem',
  access: {
    type: Object,
    required: true
  }
}
</script>

<style lang="scss" scoped>
.access {
  height: 40px;
}
</style>
