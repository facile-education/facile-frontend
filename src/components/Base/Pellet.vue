<template>
  <div class="pellet">
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
  font-size: 15px;
  line-height: 20px;
  color: white;
  text-align:center;
  background:#F00;
  border-radius:25px;
}

</style>
