<template>
  <div class="select-files-buttons">
    <label v-if="label">{{ label }}</label>

    <WeprodeButton
      v-for="button in fileButtons"
      :key="button.name"
      :title="button.name"
      :aria-label="button.name"
      class="circle"
      @click="button.callback()"
    >
      <CustomIcon
        :icon-name="button.icon"
        :style="'font-size: ' + button.fontSize"
      />
      <input
        v-if="button.hasInput"
        ref="file"
        :accept="imagesOnly? 'image/*' : '*/*'"
        :multiple="allowMultiple"
        type="file"
        @change="$emit('load', $event)"
      >
    </WeprodeButton>

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

import CustomIcon from '@components/Base/CustomIcon.vue'
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'
import { defineAsyncComponent } from 'vue'
const FilePickerModal = defineAsyncComponent(() => import('@components/FilePicker/FilePickerModal'))

export default {
  name: 'SelectFilesButtons',
  components: {
    WeprodeButton,
    CustomIcon,
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
      isFilePickerDisplayed: false,
      fileButtons: [
        {
          icon: 'icon-folder',
          fontSize: '1.25rem',
          name: this.$t('FilePicker.SelectFilesButtons.addFile'),
          callback: this.toggleFilePicker
        },
        {
          icon: 'icon-upload',
          fontSize: '1rem',
          name: this.$t('FilePicker.SelectFilesButtons.addOSFile'),
          callback: this.toggleOSFilePicker,
          hasInput: true
        }
      ]
    }
  },
  methods: {
    toggleFilePicker () {
      this.isFilePickerDisplayed = !this.isFilePickerDisplayed
    },
    toggleOSFilePicker () {
      this.$refs.file[0].click()
    }
  }
}
</script>

<style lang="scss" scoped>
.select-files-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-local-button {
  display: flex;
  align-items: center;

  .icon {
    width: 20px;
    height: 20px;
  }
}

.circle {
  display: flex !important;
  align-items: center;
  justify-content: center;
  line-height: 15px;
}

input {
  display: none;
}
</style>
