<template>
  <div
    v-if="displayLackOfFiles && selectedFiles.length === 0"
    v-t="'FilePickerModal.SelectedFileSummary.noSelectedFiles'"
  />
  <div v-else-if="selectedFiles.length === 1">
    {{ selectedFiles[0].name + $t('FilePickerModal.SelectedFileSummary.oneSelectedFiles') }}
  </div>
  <div v-else-if="selectedFiles.length > 1">
    {{ selectedFiles.length + $t('FilePickerModal.SelectedFileSummary.manySelectedFiles') }}
  </div>
</template>

<script>
export default {
  name: 'SelectedFilesSummary',
  props: {
    selectedFiles: {
      type: Array,
      required: true
    },
    displayLackOfFiles: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>

</style>
