<template>
  <!-- TODO merge similar viewers (like geogebra, mind map, pdf...) -->
  <div
    v-if="isLoaded"
    class="container"
    data-test="file-content"
  >
    <Image
      v-if="typeOfView === 'Image'"
      :src="fileUrl"
    />
    <Video
      v-else-if="typeOfView === 'Video'"
      :src="fileUrl"
    />
    <Audio
      v-else-if="typeOfView === 'Audio'"
      :src="fileUrl"
    />
    <PDF
      v-else-if="typeOfView === 'PDF'"
      :src="fileUrl"
    />
    <Geogebra
      v-else-if="typeOfView === 'Geogebra'"
      :src="fileUrl"
    />
    <MindMap
      v-else-if="typeOfView === 'MindMap'"
      :src="fileUrl"
    />
    <Scratch
      v-else-if="typeOfView === 'Scratch'"
      :src="fileUrl"
    />
    <OtherDocument
      v-else-if="typeOfView === 'Other'"
      :src="fileUrl"
    />
  </div>
  <PentilaSpinner v-else />
</template>

<script>
import fileService from '@/api/documents/file.service'
import OtherDocument from '@/components/Documents/FileDisplay/OtherDocument'
import Video from '@components/Documents/FileDisplay/Video'
import Image from '@components/Documents/FileDisplay/Image'
import Audio from '@components/Documents/FileDisplay/Audio'
import PDF from '@components/Documents/FileDisplay/PDF'
import Geogebra from '@components/Documents/FileDisplay/Geogebra'
import MindMap from '@components/Documents/FileDisplay/MindMap'
import Scratch from '@components/Documents/FileDisplay/Scratch'

export default {
  name: 'FileDisplay',
  components: { Scratch, MindMap, Geogebra, PDF, Audio, Image, Video, OtherDocument },
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
  data () {
    return {
      typeOfView: undefined,
      fileUrl: undefined,
      isLoaded: false
    }
  },
  created () {
    this.loadMedia()
  },
  methods: {
    loadMedia () {
      const versionId = (this.file.versionId === undefined || this.file.versionId === 'latest') ? 0 : this.file.versionId // for the backend type consistency
      fileService.getResource(this.file.id, versionId).then((data) => {
        if (data.success) {
          this.typeOfView = data.typeOfView
          this.fileUrl = data.fileUrl
          this.isLoaded = true
        } else {
          // TODO: Display placeholder
          console.error('Error when loading file')
        }
      })
    }
  }
}
</script>

<style scoped>
  .container {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
