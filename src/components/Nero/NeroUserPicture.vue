<template>
  <div class="user-picture">
    <img
      class="picture"
      :src="imageUrl"
      @click="onPictureClick()"
    >
    <div class="background theme-background-color" />
  </div>
</template>

<script>
export default {
  name: 'NeroUserPicture',
  props: {
    imageUrl: {
      type: String,
      required: true
    }
  },
  methods: {
    onPictureClick () {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
$side-width: 112px;

.user-picture {
  width: $side-width;
  height: $side-width;
  position: relative;
}

.picture {
  height: 106px;
  width: 106px;
  border-radius: 50%;
  position: absolute;
  left: 0;
  z-index: 1;
  margin: 3px;

  &:hover {
    cursor: pointer;
  }
}

.background {
  width: $side-width;
  height: $side-width;
  border-radius: 50%;
  position: absolute;
  left: 0;
}
</style>
