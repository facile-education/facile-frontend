<template>
  <div
    v-if="documentsProperties"
    class="add-content-buttons"
  >
    <PentilaButton
      v-for="content in contents"
      :key="content.name"
      :title="content.name"
      class="circle"
      @click="content.callback()"
    >
      <CustomIcon
        :icon-name="content.icon"
        :style="'font-size: ' + content.fontSize"
      />
      <input
        v-if="content.hasInput"
        ref="file"
        type="file"
        @change="importDocument"
      >
    </PentilaButton>
  </div>

  <teleport to="body">
    <FilePickerModal
      v-if="isFilePickerDisplayed"
      @added-files="addFile"
      @close="toggleFilePicker"
    />
    <AudioRecorderModal
      v-if="isAudioRecorderModalDisplayed"
      :edited-content="{}"
      @save="addAudioRecording"
      @close="toggleAudioRecorderModal"
    />
    <LinkModal
      v-if="isLinkModalDisplayed"
      :edited-content="{}"
      @save="addContent"
      @close="toggleLinkModal"
    />
    <VideoModal
      v-if="isVideoModalDisplayed"
      :edited-content="{}"
      @save="addContent"
      @close="toggleVideoModal"
    />
    <H5PModal
      v-if="isH5PModalDisplayed"
      :edited-content="{}"
      @save="addContent"
      @close="toggleH5PModal"
    />
  </teleport>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import { importDocuments } from '@utils/documents.util'
import { alertNoFile, returnAddedFiles } from '@utils/upload.util'
import { defineAsyncComponent } from 'vue'

import { uploadTmpFile } from '@/api/documents/file.service'

const AudioRecorderModal = defineAsyncComponent(() => import('@/components/Progression/Edit/AudioRecorderModal'))
const LinkModal = defineAsyncComponent(() => import('@/components/Progression/Edit/LinkModal'))
const FilePickerModal = defineAsyncComponent(() => import('@/components/FilePicker/FilePickerModal'))
const H5PModal = defineAsyncComponent(() => import('@/components/Progression/Edit/H5PModal'))
const VideoModal = defineAsyncComponent(() => import('@/components/Progression/Edit/VideoModal'))

export default {
  name: 'ContentPicker',
  components: {
    CustomIcon,
    AudioRecorderModal,
    LinkModal,
    FilePickerModal,
    H5PModal,
    VideoModal
  },
  emits: ['add', 'close'],
  data () {
    return {
      contents: [
        {
          icon: 'icon-folder',
          fontSize: '1.25rem',
          name: this.$t('addFile'),
          callback: this.toggleFilePicker
        },
        {
          icon: 'icon-upload',
          fontSize: '1rem',
          name: this.$t('addFile'),
          callback: this.toggleOSFilePicker,
          hasInput: true
        },
        {
          icon: 'icon-Aa',
          fontSize: '0.8rem',
          name: this.$t('addText'),
          callback: this.addText
        },
        {
          icon: 'icon-record',
          fontSize: '1.25rem',
          name: this.$t('addSound'),
          callback: this.toggleAudioRecorderModal
        },
        {
          icon: 'icon-link',
          fontSize: '1.1rem',
          name: this.$t('addLink'),
          callback: this.toggleLinkModal
        },
        {
          icon: 'icon-play',
          fontSize: '1rem',
          name: this.$t('addVideo'),
          callback: this.toggleVideoModal
        },
        {
          icon: 'icon-h5p',
          fontSize: '0.6rem',
          name: this.$t('addH5p'),
          callback: this.toggleH5PModal
        }
      ],
      isAudioRecorderModalDisplayed: false,
      isLinkModalDisplayed: false,
      isFilePickerDisplayed: false,
      isH5PModalDisplayed: false,
      isVideoModalDisplayed: false
    }
  },
  computed: {
    documentsProperties () {
      return this.$store.state.documents.documentsProperties
    }
  },
  created () {
    if (this.documentsProperties === undefined) {
      this.$store.dispatch('documents/getGlobalDocumentsProperties')
    }
  },
  methods: {
    addAudioRecording (formData) {
      uploadTmpFile(new File([formData.get('file')], formData.get('contentName') + '.wav')).then((data) => {
        if (data.success) {
          this.addContent({ contentType: 2, fileId: parseInt(data.uploadedFile.id), contentName: data.uploadedFile.name })
        } else {
          console.error('Error')
        }
      })
    },
    addContent (content) {
      this.$emit('add', content)
    },
    addFile (files) {
      this.addContent({ contentType: 5, fileId: files[0].id, contentName: files[0].name })
    },
    addText () {
      this.addContent({ contentType: 1, contentValue: '', contentName: '' })
    },
    importDocument (event) {
      returnAddedFiles(event, this.$store).then((files) => {
        if (files.length !== 0) {
          this.$store.dispatch('currentActions/setImportFileList', files)
          this.$store.dispatch('currentActions/displayUploadProgression')

          importDocuments(undefined, files).then((data) => {
            const tmpFiles = this.$store.state.currentActions.listUploadedFiles
            this.addContent({ contentType: 5, fileId: tmpFiles[0].id, contentName: tmpFiles[0].name })
          })
        } else {
          alertNoFile()
        }
      })
    },
    toggleAudioRecorderModal () {
      this.isAudioRecorderModalDisplayed = !this.isAudioRecorderModalDisplayed
    },
    toggleLinkModal (content) {
      this.isLinkModalDisplayed = !this.isLinkModalDisplayed
    },
    toggleFilePicker () {
      this.isFilePickerDisplayed = !this.isFilePickerDisplayed
    },
    toggleH5PModal () {
      this.isH5PModalDisplayed = !this.isH5PModalDisplayed
    },
    toggleOSFilePicker () {
      this.$refs.file[0].click()
    },
    toggleVideoModal () {
      this.isVideoModalDisplayed = !this.isVideoModalDisplayed
    }
  }
}
</script>

<style lang="scss">
.edit-course-modal .window-body {
  display: flex;
  padding: 1.5rem 0rem;
  align-items: flex-start;
  gap: 2rem;
  align-self: stretch;

  overflow: auto;
  max-height: 70vh;
}
</style>

<style lang="scss" scoped>
@import '@design';

.add-content-buttons {
  display: flex;
  gap: 8px;
}

.circle {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 15px;
}

input {
  display: none;
}
</style>

<i18n locale="fr">
{
  "addFile": "Ajouter une pièce jointe",
  "addH5p": "Ajouter un élément h5p",
  "addLink": "Ajouter un lien",
  "addSound": "Ajouter un enregistrement",
  "addText": "Ajouter du texte",
  "addVideo": "Ajouter une vidéo"
}
</i18n>
