<template>
  <!-- TODO merge similar viewers (like geogebra, mind map, pdf...) -->
  <div
    v-if="isLoaded"
    class="document-wrapper"
    data-test="file-content"
  >
    <ImageDocument
      v-if="typeOfView === 'Image'"
      :src="fileUrl"
    />
    <VideoDocument
      v-else-if="typeOfView === 'Video'"
      :src="fileUrl"
    />
    <AudioDocument
      v-else-if="typeOfView === 'Audio'"
      :src="fileUrl"
    />
    <PDF
      v-else-if="typeOfView === 'PDF'"
      :src="fileUrl"
    />
    <Office
      v-else-if="typeOfView === 'Office' && hasLoolBroadcasted"
      :src="fileUrl"
    />
    <Geogebra
      v-else-if="typeOfView === 'Geogebra' && hasGeogebraBroadcasted"
      :src="fileUrl"
    />
    <MindMap
      v-else-if="typeOfView === 'MindMap' && hasMindmapBroadcasted"
      :src="fileUrl"
    />
    <Scratch
      v-else-if="typeOfView === 'Scratch' && hasScratchBroadcasted"
      :src="fileUrl"
    />
    <WISIWIG
      v-else-if="typeOfView === 'WISIWIG' && loadedFile"
      class="wisiwyg"
      :file="loadedFile"
      :have-to-save="haveToSaveFile"
      @saved="fileSaved"
    />
    <OtherDocument
      v-else-if="typeOfView === 'Other'"
      :src="fileUrl"
    />
    <div
      v-else-if="typeOfView === 'Forbidden'"
      v-t="('Forbidden')"
      class="placeHolder"
    />
    <div
      v-else
      v-t="('Unsupported')"
      class="placeHolder"
    />
  </div>
  <WeprodeSpinner v-else />
</template>

<script>
import AudioDocument from '@components/Documents/FileDisplay/AudioDocument.vue'
import Geogebra from '@components/Documents/FileDisplay/Geogebra'
import ImageDocument from '@components/Documents/FileDisplay/ImageDocument.vue'
import MindMap from '@components/Documents/FileDisplay/MindMap'
import Office from '@components/Documents/FileDisplay/Office'
import PDF from '@components/Documents/FileDisplay/PDF'
import Scratch from '@components/Documents/FileDisplay/Scratch'
import VideoDocument from '@components/Documents/FileDisplay/VideoDocument.vue'
import WISIWIG from '@components/Documents/FileDisplay/WISIWIG'

import fileService from '@/api/documents/file.service'
import groupService from '@/api/documents/group.service'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import OtherDocument from '@/components/Documents/FileDisplay/OtherDocument'

export default {
  name: 'FileDisplay',
  components: { WISIWIG, Office, Scratch, MindMap, Geogebra, PDF, AudioDocument, ImageDocument, VideoDocument, OtherDocument, WeprodeSpinner },
  inject: ['mq'],
  props: {
    file: {
      type: Object,
      required: true
    },
    wantsToCloseFile: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'keep-open', 'set-fullscreen'],
  data () {
    return {
      hasLock: false,
      haveToSaveFile: false,
      fileUrl: undefined,
      isLoaded: false,
      loadedFile: undefined,
      typeOfView: undefined
    }
  },
  computed: {
    hasGeogebraBroadcasted () {
      return this.$store.state.documents.documentsProperties.hasGeogebraBroadcasted
    },
    hasMindmapBroadcasted () {
      return this.$store.state.documents.documentsProperties.hasMindmapBroadcasted
    },
    hasScratchBroadcasted () {
      return this.$store.state.documents.documentsProperties.hasScratchBroadcasted
    },
    hasLoolBroadcasted () {
      return this.$store.state.documents.documentsProperties.hasLoolBroadcasted
    },
    hasH5pBroadcasted () {
      return this.$store.state.documents.documentsProperties.hasH5pBroadcasted
    }
  },
  watch: {
    wantsToCloseFile () {
      if (this.wantsToCloseFile) {
        if (this.loadedFile) {
          if (this.typeOfView === 'WISIWIG' && !this.loadedFile.readOnly) { // Only WISIWIG can auto-save for the moment...
            this.haveToSaveFile = true
          } else if (!this.loadedFile.readOnly && (this.typeOfView === 'MindMap' || this.typeOfView === 'Geogebra' || this.typeOfView === 'Scratch')) {
            this.$store.dispatch('warningModal/addWarning', {
              text: this.$t('quitWithoutSaving'),
              lastAction: { fct: this.emitCloseEvent }
            })
            this.$emit('keep-open') // In case of canceling the closure
          } else {
            this.$emit('close')
          }
        } else {
          this.$emit('close')
        }
      }
    }
  },
  created () {
    this.loadMedia()
  },
  unmounted () {
    if (this.hasLock) {
      fileService.removeLock(this.file.id).then((data) => {
        if (data.success) {
          this.hasLock = false
        }
      })
    }
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
          if (!data.readOnly) {
            this.checkLock()
          } else {
            this.isLoaded = true
          }
          this.$emit('set-fullscreen', this.mq.phone || data.typeOfView !== 'Audio')
        } else {
          if (data.error === 'UnsupportedFileExtension') {
            this.typeOfView = 'Unsupported'
            this.isLoaded = true
          } else if (data.error === 'PermissionException') {
            this.typeOfView = 'Forbidden'
            this.isLoaded = true
          } else {
            // TODO: Display placeholder
            console.error('Error when loading file')
          }
        }
      })
    },
    checkLock () {
      // Handling write lock to prevent concurrent edition if not supported
      if (this.file.isGroupFile && (this.typeOfView === 'MindMap' || this.typeOfView === 'Geogebra' || this.typeOfView === 'Scratch')) {
        fileService.addLock(this.file.id).then((data) => {
          if (data.success) {
            this.hasLock = true
            this.isLoaded = true
          } else {
            // Handle error message
            if (data.userName !== undefined) {
              const message = this.$t('lockWarningUser', { userName: data.userName })
              this.$store.dispatch('popups/pushPopup', { message, type: 'warning' })
            } else if (data.isWritable !== undefined) {
              const message = this.$t('lockWarning')
              this.$store.dispatch('popups/pushPopup', { message, type: 'warning' })
            }
            this.fileUrl = this.fileUrl.replace('editor.html', 'viewmode.html')
            this.fileUrl = this.fileUrl.replace('readonly=false', 'readonly=true')
            this.fileUrl = this.fileUrl.replace('isCreation=false', 'isCreation=true')
            if (this.typeOfView === 'MindMap' && this.fileUrl.indexOf('readonly') === -1) {
              this.fileUrl += '&readonly=true'
            }
            this.loadedFile.readOnly = true
            this.isLoaded = true
          }
        })
      } else {
        this.isLoaded = true
      }
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
.document-wrapper {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.wisiwyg {
  margin-top: 40px;
}
</style>

<i18n locale="fr">
{
  "lockWarning": "Ce fichier est ouvert en édition par un autre utilisateur. Ouverture en consultation seule...",
  "lockWarningUser": "Ce fichier est ouvert en édition par {userName}. Ouverture en consultation seule...",
  "quitWithoutSaving": "Toute modification non sauvegardée sera perdue",
  "Unsupported": "Type de fichier non affichable",
  "Forbidden": "Vous n'avez pas la permission de voir ce fichier"
}
</i18n>
