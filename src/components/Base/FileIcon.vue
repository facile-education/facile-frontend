<template>
  <div class="file-icon">
    <img
      v-if="fileIconIsImage"
      class="img-icon"
      :src="fileIcon"
      alt="document icon"
      :style="'width: ' + width + ';min-width:' + width + ';height: ' + height"
    >
    <BaseIcon
      v-else
      class="base-icon"
      :name="['fas', fileIcon]"
    />
  </div>
</template>

<script>
import BaseIcon from '@components/Base/BaseIcon'

import { icons } from '@/constants/icons'

export default {
  components: {
    BaseIcon
  },
  myIcons: icons,
  props: {
    file: {
      type: Object,
      required: true
    },
    width: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: ''
    }
  },
  computed: {
    extension () {
      return this.file.extension
    },
    fileIcon () {
      if (icons.extensions[this.file.extension] === undefined) {
        return icons.file
      } else {
        return icons.extensions[this.file.extension]
      }
    },
    fileIconIsImage () {
      // TODO: find a better way to separate img and font-awesome icons
      return this.fileIcon.includes('.') || this.fileIcon.includes(':') // if icon contains extension (like folder.svg) it's not a font-awesome
    }
  }
}
</script>

<style lang="scss" scoped>
.file-icon {
  max-height: 100%;
  max-width: 100%;
  display: flex;

  .img-icon {
    width: 23px;
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
