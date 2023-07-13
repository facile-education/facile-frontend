<template>
  <button
    :title="$t('selectFromDevice')"
    :aria-label="$t('selectFromDevice')"
    class="file-picker-button"
    @click="$refs.file.click()"
  >
    <img
      class="icon"
      src="@assets/options/icon_upload.svg"
      alt="upload"
    >
    <input
      ref="file"
      type="file"
      :accept="accept"
      :multiple="allowMultiple"
      @change="$emit('change', $event)"
    >
  </button>
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

<style lang="scss" scoped>
  button {
    cursor: pointer;
    background-color: transparent;
    border-radius: 0;
    padding: 0;
    margin: 0;
    border: none;
  }

  .file-picker-button{
    display: flex;
    align-items: center;

    .icon {
      width: 20px;
      height: 20px;
    }
  }

  input {
    display: none;
  }
</style>

<i18n locale="fr">
{
  "selectFromDevice": "importer depuis le poste de travail"
}
</i18n>
