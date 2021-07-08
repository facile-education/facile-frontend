<template>
  <PentilaWindow
    :modal="true"
    class="edit-slot-modal"
    @close="closeModal"
    @keydown.exact.enter.stop=""
    @keydown.exact.backspace.stop=""
    @keydown.exact.delete.stop=""
    @keydown.exact.f2.stop=""
    @keydown.ctrl.stop=""
  >
    <template #header>
      <span v-t="'NotUsualSlots.StudentListModal.header'" />
    </template>

    <template #body />

    <template #footer />
  </PentilaWindow>
</template>

<script>
export default {
  name: 'StudentListModal',
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  methods: {
    closeModal () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>

</style>
