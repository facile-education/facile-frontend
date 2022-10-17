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
    <Office
      v-else-if="typeOfView === 'Office'"
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
    <WISIWIG
      v-else-if="typeOfView === 'WISIWIG' && loadedFile"
      :file="loadedFile"
      :have-to-save="haveToSaveFile"
      @saved="fileSaved"
    />
    <OtherDocument
      v-else-if="typeOfView === 'Other'"
      :src="fileUrl"
    />
    <div
      v-else-if="typeOfView === 'Unsupported'"
      v-t="('Unsupported')"
      class="placeHolder"
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
import Office from '@components/Documents/FileDisplay/Office'
import WISIWIG from '@components/Documents/FileDisplay/WISIWIG'
import groupService from '@/api/documents/group.service'

export default {
  name: 'FileDisplay',
  components: { WISIWIG, Office, Scratch, MindMap, Geogebra, PDF, Audio, Image, Video, OtherDocument },
  props: {
    file: {
      type: Object,
      required: true,
      validator: function (obj) {
        return (typeof obj.id === 'string') &&
               (typeof obj.name === 'string' && obj.name.length > 0)
      }
    },
    wantsToCloseFile: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'keepOpen'],
  data () {
    return {
      loadedFile: undefined,
      typeOfView: undefined,
      fileUrl: undefined,
      isLoaded: false,
      haveToSaveFile: false
    }
  },
  watch: {
    wantsToCloseFile () {
      if (this.wantsToCloseFile) {
        if (this.typeOfView === 'WISIWIG' && this.loadedFile && !this.loadedFile.readOnly) { // Only WISIWIG can auto-save for the moment...
          this.haveToSaveFile = true
        } else if (this.typeOfView === 'MindMap' || this.typeOfView === 'Geogebra' || this.typeOfView === 'Scratch') {
          this.$store.dispatch('warningModal/addWarning', {
            text: this.$t('quitWithoutSaving'),
            lastAction: { fct: this.emitCloseEvent }
          })
          this.$emit('keepOpen') // In case of canceling the closure
        } else {
          this.$emit('close')
        }
      }
    }
  },
  created () {
    this.loadMedia()
  },
  methods: {
    loadMedia () {
      const versionId = (this.file.versionId === undefined || this.file.versionId === 'latest') ? 0 : this.file.versionId // for the backend type consistency
      const readOnly = !!this.file.readOnly // To force to have boolean
      fileService.getResource(this.file.id, versionId, readOnly).then((data) => {
        if (data.success) {
          if (this.file.isGroupFile) {
            groupService.recordViewActivity(this.file.id, versionId)
          }
          this.typeOfView = data.typeOfView
          this.fileUrl = data.fileUrl
          this.loadedFile = { ...this.file }
          this.loadedFile.fileVersionId = data.fileVersionId
          this.loadedFile.readOnly = data.readOnly
          this.isLoaded = true
        } else {
          if (data.error === 'UnsupportedFileExtension') {
            this.typeOfView = 'Unsupported'
            this.isLoaded = true
          } else {
            // TODO: Display placeholder
            console.error('Error when loading file')
          }
        }
      })
    },
    emitCloseEvent () {
      this.$emit('close')
    },
    fileSaved () {
      if (this.wantsToCloseFile) {
        this.$emit('close')
      }
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

<i18n locale="fr">
{
  "quitWithoutSaving": "Toute modification non sauvegardée sera perdue",
  "Unsupported": "Type de fichier non affichable",
}
</i18n>
