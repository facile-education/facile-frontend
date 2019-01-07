<template>
  <NeroWindow
    :modal="true"
    @close="closeModal"
  >
    <span
      slot="header"
      v-t="'TODO'"
    />

    <div slot="body">
      TODO
    </div>
  </NeroWindow>
</template>

<script>
export default {
  name: 'NewsDelegationModal',
  methods: {
    closeModal () {
      this.$store.dispatch('news/closeEditionModal')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
