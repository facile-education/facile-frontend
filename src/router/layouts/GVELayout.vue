<template>
  <div
    class="body"
    :class="{'authenticated': isAuthenticated}"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'GVELayout',
  computed: {
    isAuthenticated () {
      return this.$store.state.user.userId && this.$store.state.user.userId !== 0
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.body {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:not(.authenticated) {
    header, footer {
      background-color: rgba(0,0,0,0.6);
    }
  }
}

header, footer {
  @extend %font-regular-m;
  color: #fff;
  min-height: $gve-layout-banner-height;
  max-height: $gve-layout-banner-height;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  padding: 0 1rem;
}

footer {
  div {
    margin-left: auto;
  }
}

</style>
