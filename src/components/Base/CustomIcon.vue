<template>
  <i
    class="custom-icon"
    :class="iconName"
  />
</template>

<script>
export default {
  name: 'CustomIcon',
  props: {
    iconName: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/design/customIcons.css";

@font-face {
  font-family: 'CustomIcons';
  src: url('@/assets/fonts/Custom-icons-font.ttf') format('truetype');
}

i.custom-icon:before{
  font-family: "CustomIcons", sans-serif;
  margin: 0;
}
</style>
