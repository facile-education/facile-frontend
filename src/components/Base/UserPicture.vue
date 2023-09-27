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
    :class="colorReversed ? 'theme-text-color' : 'theme-background-color'"
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
    },
    colorReversed: {
      type: Boolean,
      default: false
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
  @extend %font-bold-l;
  font-size: calc(0.55 * var(--size));

  &.theme-text-color {
    background-color: $neutral-10;
  }
}

</style>
