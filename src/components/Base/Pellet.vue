<template>
  <div class="pellet theme-background-color">
    <div v-if="showCount">
      {{ count }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pellet',
  props: {
    count: {
      type: Number,
      default: 0
    },
    showCount: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>

.pellet{
  margin-left: auto;
  font-size: 12px;
  font-weight: bold;
  line-height: 20px;
  color: white;
  text-align: center;
  border-radius: 50%;
}

</style>
