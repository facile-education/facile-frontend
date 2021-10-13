<template>
  <div class="grid-document">
    <i
      class="icon"
      :class="document.icon"
    />
    <p class="file-name">
      {{ document.name }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'GridDocument',
  props: {
    document: {
      type: Object,
      required: true,
      validator: function (obj) {
        return (typeof obj.id === 'number') &&
          (typeof obj.name === 'string' && obj.name.length > 0) &&
          (typeof obj.icon === 'string' && obj.icon.length > 0)
      }
    }
  }
}
</script>

<style scoped>
.grid-document{
  display: inline-block;
  padding: 2px 3px;
  margin: 5px;
  text-align: center;
  background-color: white;
  border: 1px solid rgba(50, 50, 255, 0.5);
}

.icon{
  font-size: 30px;
}

</style>
