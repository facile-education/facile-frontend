<template>
  <div class="file-icon">
    <BaseIcon
      v-if="isImage"
      name="file-image"
      class="fa-lg"
    />
    <BaseIcon
      v-else-if="isVideo"
      name="film"
      class="fa-lg"
    />
    <BaseIcon
      v-else-if="isSound"
      name="music"
      class="fa-lg"
    />
    <img
      v-else-if="isPdf"
      class="img-icon"
      :src="$options.myIcons.extensions.pdf"
      alt="document icon"
    >
    <BaseIcon
      v-else
      name="file"
      class="fa-lg"
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
    fileName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      imageExtensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp'],
      videoExtensions: ['mov', 'avi', 'mp4', 'ogv'],
      soundExtensions: ['wav', 'mp3', 'm4a', 'ogg'],
      pdfExtensions: ['pdf']
    }
  },
  computed: {
    extension () {
      return this.fileName.split('.').pop()
    },
    isImage () {
      return this.imageExtensions.includes(this.extension)
    },
    isVideo () {
      return this.videoExtensions.includes(this.extension)
    },
    isSound () {
      return this.soundExtensions.includes(this.extension)
    },
    isPdf () {
      return this.pdfExtensions.includes(this.extension)
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
