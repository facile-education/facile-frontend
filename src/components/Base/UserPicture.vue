<template>
  <img
    v-if="hasPicture"
    class="user-picture"
    :src="user.picture"
    alt="user_picture"
    :style="'--size: ' + size + ';'"
  >
  <div
    v-else
    class="user-picture"
    :style="'--size: ' + size + ';'"
  >
    {{ userInitials }}
  </div>
</template>

<script>
export default {
  name: 'UserPicture',
  props: {
    user: {
      type: Object,
      required: true
    },
    size: {
      type: String,
      default: '32px'
    }
  },
  computed: {
    hasPicture () {
      return this.user.picture !== ''
    },
    userInitials () {
      return this.user.firstName[0] + this.user.lastName[0]
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.user-picture {
  height: var(--size);
  width: var(--size);
  max-height: var(--size);
  max-width: var(--size);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $neutral-20;
  color: $neutral-80;
  @extend %font-regular-l;
  font-size: calc(0.5 * var(--size))
}

</style>
