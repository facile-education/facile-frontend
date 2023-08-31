<template>
  <div class="select-files-buttons">
    <label v-if="label">{{ label }}</label>
    <button
      :title="$t('selectFromApp')"
      :aria-label="$t('selectFromApp')"
      class="button add-local-button"
      @click="isFilePickerDisplayed = true"
    >
      <img
        class="icon"
        src="@assets/options/dossier-pj.svg"
        alt="select"
      >
    </button>
    <FilePickerButton
      class="button"
      :allow-multiple="allowMultiple"
      :accept="imagesOnly? 'image/*' : '*/*'"
      @change="$emit('load', $event)"
    />

    <teleport
      v-if="isFilePickerDisplayed"
      to="body"
    >
      <FilePickerModal
        :images-only="imagesOnly"
        :multi-selection="allowMultiple"
        @added-files="$emit('selectFiles', $event)"
        @close="isFilePickerDisplayed=false"
      />
    </teleport>
  </div>
</template>

<script>

import FilePickerButton from '@components/FilePicker/FilePickerButton.vue'
import { defineAsyncComponent } from 'vue'
const FilePickerModal = defineAsyncComponent(() => import('@components/FilePicker/FilePickerModal'))

export default {
  name: 'SelectFilesButtons',
  components: {
    FilePickerButton,
    FilePickerModal
  },
  props: {
    label: {
      type: String,
      default: undefined
    },
    imagesOnly: {
      type: Boolean,
      default: false
    },
    allowMultiple: {
      type: Boolean,
      default: false
    }
  },
  emits: ['load', 'selectFiles'],
  data () {
    return {
      isFilePickerDisplayed: false
    }
  }
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

.select-files-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
}

.add-local-button {
  display: flex;
  align-items: center;

  .icon {
    width: 20px;
    height: 20px;
  }
}
</style>

<i18n locale="fr">
{
  "selectFromApp": "importer depuis l'application"
}
</i18n>
