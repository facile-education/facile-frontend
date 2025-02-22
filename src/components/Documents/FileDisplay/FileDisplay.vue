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
      ref="file"
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
      v-t="('Documents.FileDisplay.Forbidden')"
      class="placeHolder"
    />
    <div
      v-else
      v-t="('Documents.FileDisplay.Unsupported')"
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
import dayjs from 'dayjs'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants'
import fileService from '@/api/documents/file.service'
import groupService from '@/api/documents/group.service'
import versionsService from '@/api/documents/version.service'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import OtherDocument from '@/components/Documents/FileDisplay/OtherDocument'

const timeBeforeAskSaveConfirmation = 30000 // 30s

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
  emits: ['close', 'keep-open', 'set-fullscreen', 'documentLoaded'],
  data () {
    return {
      hasLock: false,
      haveToSaveFile: false,
      fileUrl: undefined,
      isLoaded: false,
      loadedFile: undefined,
      typeOfView: undefined,
      loadDate: undefined
    }
  },
  computed: {
    documentsProperties () {
      return this.$store.state.documents.documentsProperties
    },
    hasGeogebraBroadcasted () {
      return this.documentsProperties !== undefined && this.documentsProperties.hasGeogebraBroadcasted
    },
    hasMindmapBroadcasted () {
      return this.documentsProperties !== undefined && this.documentsProperties.hasMindmapBroadcasted
    },
    hasScratchBroadcasted () {
      return this.documentsProperties !== undefined && this.documentsProperties.hasScratchBroadcasted
    },
    hasLoolBroadcasted () {
      return this.documentsProperties !== undefined && this.documentsProperties.hasLoolBroadcasted
    },
    hasH5pBroadcasted () {
      return this.documentsProperties !== undefined && this.documentsProperties.hasH5pBroadcasted
    }
  },
  watch: {
    wantsToCloseFile () {
      if (this.wantsToCloseFile) {
        if (this.loadedFile) {
          if (this.typeOfView === 'WISIWIG' && !this.loadedFile.readOnly) { // Only WISIWIG can auto-save for the moment...
            this.$refs.file.saveContent()
          } else if (!this.loadedFile.readOnly && (this.typeOfView === 'MindMap' || this.typeOfView === 'Geogebra' || this.typeOfView === 'Scratch')) {
            this.askToSaveContent()
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
      this.loadDate = dayjs()

      const versionId = (this.file.versionId === undefined || this.file.versionId === 'latest') ? 0 : this.file.versionId // for the backend type consistency
      const readOnly = !!this.file.readOnly // To force to have boolean
      if (this.documentsProperties === undefined) {
        this.$store.dispatch('documents/getGlobalDocumentsProperties')
      }

      fileService.getResource(this.file.id, versionId, readOnly).then((data) => {
        if (data.success) {
          if (this.file.isGroupFile) {
            groupService.recordViewActivity(this.file.id, versionId)
          }
          this.typeOfView = data.typeOfView
          this.fileUrl = data.fileUrl + '&p_auth=' + this.$store.state.user.pauth
          this.loadedFile = { ...this.file }
          this.loadedFile.fileVersionId = data.fileVersionId
          this.loadedFile.readOnly = data.readOnly
          this.loadedFile.fileName = data.fileName
          if (!data.readOnly) {
            this.checkLock()
          } else {
            this.isLoaded = true
          }
          this.$emit('set-fullscreen', this.mq.phone || data.typeOfView !== 'Audio')
          this.$emit('documentLoaded', this.loadedFile)
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
              const message = this.$t('Documents.FileDisplay.lockWarningUser', { userName: data.userName })
              this.$store.dispatch('popups/pushPopup', { message, type: 'warning' })
            } else if (data.isWritable !== undefined) {
              const message = this.$t('Documents.FileDisplay.lockWarning')
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
    askToSaveContent () {
      // If file is open for more than 30 seconds and last version is older than 30 seconds, ask quit confirmation
      if (dayjs().isAfter(this.loadDate.add(timeBeforeAskSaveConfirmation, 'ms'))) {
        versionsService.getFileVersions(this.file.id).then((data) => {
          if (data.success) {
            const lastVersion = data.fileVersions.find(version => version.isCurrentVersion !== undefined)
            const lastVersionDate = dayjs(lastVersion.date, DATE_EXCHANGE_FORMAT)
            if (dayjs().isAfter(lastVersionDate.add(timeBeforeAskSaveConfirmation, 'ms'))) {
              this.openWarningModal()
            } else {
              this.emitCloseEvent()
            }
          } else {
            this.emitCloseEvent()
          }
        }, (err) => {
          console.error(err)
          this.emitCloseEvent()
        })
      } else {
        this.emitCloseEvent()
      }
    },
    openWarningModal () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('Documents.FileDisplay.quitWithoutSaving'),
        lastAction: { fct: this.emitCloseEvent }
      })
      this.$emit('keep-open') // In case of canceling the closure
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
  margin-top: 20px;
  height: calc(100% - 20px);
}
</style>
