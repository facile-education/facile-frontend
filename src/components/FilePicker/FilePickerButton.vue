<template>
  <div
    class="file-picker-button theme-background-color"
    tabindex="0"
    @click="$refs.file.click()"
    @keyup.enter="$refs.file.click()"
  >
    <span class="button">
      <input
        ref="file"
        type="file"
        accept="image/*"
        :multiple="allowMultiple"
        @change="$emit('change', $event)"
      >
    </span>
  </div>
</template>

<script>

export default {
  name: 'FilePickerButton',
  props: {
    accept: {
      type: String,
      default: '*/*'
    },
    allowMultiple: {
      type: Boolean,
      default: false
    }
  },
  emits: ['change']
}
</script>

<style scoped>
  .file-picker-button{
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 3px rgba(0,0,0,.19);
    font-family: inherit;
    border-radius: 5px;
    padding: 6px 12px;
    border: none;
    cursor: pointer;
  }

  input {
    display: none;
  }
</style>
