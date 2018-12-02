<template>
  <div class="widget">
    <slot>
      spinner loading message
    </slot>
  </div>
</template>

<script>
export default {
  name: 'DashboardWidget'
}
</script>

<style lang="scss">
.widget {
  background: white;
  border: 1px silver solid;
  border-radius: 5px;

  .header {
    color: silver;
    border-bottom: 1px silver solid;
  }

  .body {
    padding: 15px;
  }
}
</style>
