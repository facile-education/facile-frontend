<template>
  <NeroWindow
    :modal="true"
    @close="closeModal"
  >
    <span
      slot="header"
      v-t="'TODO'"
    />

    <div
      slot="body"
      class="nero-form"
    >
      Toto
    </div>

    <NeroButton
      slot="footer"
      :label="$t('TODO')"
      @click="save"
    />
  </NeroWindow>
</template>

<script>
export default {
  name: 'NewsEditionModal',
  methods: {
    closeModal () {
      this.$store.dispatch('news/closeEditionModal')
    },
    save () {
      // TODO
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
