<template>
  <div
    class="file"
    @click="displayFile"
  >
    <div class="preview">
      <img
        v-if="fileIconIsImage"
        class="icon"
        :src="fileIcon"
        alt="document icon"
      >
      <BaseIcon
        v-else
        class="icon"
        :name="[iconPrefix, fileIcon]"
      />
    </div>
    <p class="file-name">
      {{ fileName }}
    </p>
  </div>
</template>

<script>
import BaseIcon from '@components/Base/BaseIcon'

import { icons } from '@/constants/icons'
import { getExtensionFromName } from '@/utils/commons.util'

export default {
  name: 'FileContent',
  components: { BaseIcon },
  props: {
    fileName: {
      type: String,
      required: true
    },
    fileId: {
      type: String,
      required: true
    },
    downloadUrl: {
      type: String,
      default: ''
    },
    isHovering: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    fileExtension () {
      return getExtensionFromName(this.fileName)
    },
    fileIcon () {
      if (icons.extensions[this.fileExtension] === undefined) {
        return icons.file
      } else {
        return icons.extensions[this.fileExtension]
      }
    },
    fileIconIsImage () {
      // TODO: find a better way to separate img and font-awesome icons
      return this.fileIcon.includes('.') || this.fileIcon.includes(':') // if icon contains extension (like folder.svg) it's not a font-awesome
    },
    iconPrefix () {
      return 'fas'
    }
  },
  methods: {
    displayFile () {
      this.$store.dispatch('documents/openFile', { id: this.fileId, name: this.fileName })
    }
  }
}
</script>

<style lang="scss" scoped>

.file{
  height: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  cursor: pointer;
  text-align: center;
  background-color: white;
  //border: 1px solid rgba(50, 50, 255, 0.5);
  border-radius: 6px;

  .preview {
    height: 100%;
    width: 120px;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon{
      font-size: 35px;
      width: 37px;
      height: 37px;
    }
  }

  .download {
    margin-left: auto;
  }
}

</style>
