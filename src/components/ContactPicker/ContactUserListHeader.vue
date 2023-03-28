<template>
  <div>
    <button @click="closeMobileUserPanel">
      <img
        class="back-arrow"
        src="@assets/arrow_right.svg"
        alt="back"
      >
    </button>
    header
  </div>
</template>

<script>
export default {
  name: 'ContactUserListHeader',
  methods: {
    closeMobileUserPanel () {
      this.$store.dispatch('contact/closeMobileUserList')
    }
  }
}
</script>

<style lang="scss" scoped>
.back-arrow {
  transform: rotate(180deg);
}
</style>
