<template>
  <div class="widget">
    <div class="header">
      Action bar
    </div>
    <div class="body">
      body
    </div>
  </div>
</template>

<script>
export default {
  name: 'Widget'
}
</script>

<style lang="scss" scoped>
.header {
  color: silver;
  border-bottom: 1px silver solid;
}

.widget {
  border: 1px silver solid;
  border-radius: 5px;
}
</style>
