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
  margin: 5px;
  background: white;
  border-radius: 5px;

  .header {
    border-bottom: 1px silver solid;
    .widget-icon {
      font-size: 1.5em;
      padding-right: 5px;
    }

    h4 {
      display: inline-block;
      margin: 0;
    }
  }

  .body {
    padding: 5px 0;
    max-height: 500px;
    overflow: auto;
  }
}
</style>
