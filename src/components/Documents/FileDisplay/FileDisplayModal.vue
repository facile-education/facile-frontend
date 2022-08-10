<template>
  <PentilaWindow
    class="file-display-modal"
    :modal="true"
    :is-full-screen="true"
    @close="wantsToCloseFile = true"
  >
    <template #header>
      <h1 :title="file.name">
        {{ file.name }}
      </h1>
    </template>

    <template #body>
      <FileDisplay
        :file="file"
        :wants-to-close-file="wantsToCloseFile"
        @close="closeModal"
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
  data () {
    return {
      wantsToCloseFile: false
    }
  },
  methods: {
    closeModal () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.file-display-modal {
  .window-wrapper.full-screen {
    .window-container {
      height: 100vh;
      width: 100vw;
      .window-header {
        width: 100%;
        border-bottom: none;
      }

      .window-body {
        padding: 0;
        height: calc(100% - 35px);
        max-height: calc(100% - 35px);
      }
    }
  }
}
</style>

<style lang="scss" scoped>
  h1 {
    font-size: 1.25rem;
    margin: 0;
    line-height: 1.5rem;
    max-width: calc(100% - 20px);
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
