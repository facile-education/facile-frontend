<template>
  <PentilaWindow
    :modal="true"
    :is-full-screen="true"
    @close="closeModal"
  >
    <template #header />

    <template #body>
      <FileDisplay
        :file="file"
      />
    </template>

    <template #footer />
  </pentilawindow>
</template>

<script>
import FileDisplay from '@components/Documents/FileDisplay/FileDisplay'
export default {
  name: 'FileDisplayModal',
  components: { FileDisplay },
  props: {
    file: {
      type: Object,
      required: true,
      validator: function (obj) {
        return (typeof obj.id === 'string') &&
          (typeof obj.name === 'string' && obj.name.length > 0)
      }
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

<style lang="scss" scoped>

</style>
