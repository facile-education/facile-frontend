<template>
  <div
    :id="id"
    class="file-picker-button"
  >
    <input
      class="input"
      data-test="file-picker-button"
      type="file"
      :accept="accept"
      :multiple="allowMultiple"
      @change="fileAdded"
    >
    <span :v-if="label">
      {{ label }}
    </span>
  </div>
</template>

<script>

import utils from '@/utils/utils'
export default {
  name: 'FilePickerButton',
  props: {
    id: {
      type: String,
      required: true
    },
    accept: {
      type: String,
      default: '*/*'
    },
    label: {
      type: String,
      default: ''
    },
    allowMultiple: {
      type: Boolean,
      default: false
    }
  },
  emits: ['fileAdded'],
  methods: {
    fileAdded (e) {
      utils.returnAddedFiles(e, this.$store).then((files) => {
        if (files.length !== 0) {
          this.$emit('fileAdded', files)
        } else {
          utils.alertNoFile()
        }
      })
    }
  }
}
</script>

<style scoped>

  .file-picker-button{
    display: inline-block;
    height: 30px;
    width: 150px;
    background-color: #9effa1;
    overflow: hidden;
    cursor: pointer;
  }

  .input{
    position: absolute;
    opacity: 0;
    height: 30px;
  }

</style>
