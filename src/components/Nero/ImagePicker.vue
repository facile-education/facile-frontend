<template>
  <PentilaWindow
    :modal="true"
    @close="onClose"
  >
    <template #header>
      <span v-t="'header'" />
    </template>

    <template #body>
      <div class="container">
        <div class="content">
          <cropper
            ref="cropper"
            class="cropper"
            :src="image"
            :stencil-props="{
              aspectRatio: 1/1
            }"
            :debounce="false"
            :min-height="50"
            :min-width="50"
            @change="onChange"
          />
          <preview
            :width="120"
            :height="120"
            :image="result.image"
            :coordinates="result.coordinates"
            class="my-preview"
          />
          <div class="button-wrapper theme-background-color">
            <span
              class="button"
              @click="$refs.file.click()"
            >
              <input
                ref="file"
                type="file"
                accept="image/*"
                @change="loadImage($event)"
              >
              {{ $t('selectButton') }}
            </span>
          </div>
          <button @click="isFilePickerDisplayed=true">
            {{ $t('openFilePicker') }}
          </button>
        </div>
      </div>
    </template>

    <template #footer>
      <PentilaButton
        :label="$t('saveButton')"
        @click="onConfirm"
      />
    </template>
  </PentilaWindow>

  <teleport
    v-if="isFilePickerDisplayed"
    to="body"
  >
    <FilePickerModal
      :images-only="true"
      @addedFiles="doSelectFilesAction"
      @close="isFilePickerDisplayed=false"
    />
  </teleport>
</template>

<script>
import { Cropper, Preview } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { getResource, uploadTmpFile } from '@/api/documents/file.service'
import { defineAsyncComponent } from 'vue'
const FilePickerModal = defineAsyncComponent(() => import('@components/FilePicker/FilePickerModal'))

export default {
  name: 'ImagePickerModal',
  components: {
    FilePickerModal,
    Cropper,
    Preview
  },
  emits: ['close', 'save', 'createdTmpFile'],
  data () {
    return {
      result: {
        coordinates: null,
        image: null
      },
      image: null,
      isFilePickerDisplayed: false
    }
  },
  computed: {
    initializerPictureURL () {
      return undefined // this.$store.state.modals.imagePickerModal.initializerPictureURL
    }
  },
  mounted () {
    if (this.initializerPictureURL !== undefined) {
      this.image = this.initializerPictureURL
    }
  },
  methods: {
    doSelectFilesAction (files) {
      console.log(files)
      const file = files[0]
      getResource(file.id, 0, true).then((data) => {
        if (data.success) {
          this.loadImageAsBase64(data.fileUrl)
        } else {
          console.error('cannot load file in cropper')
        }
      })
    },
    reset () {
      this.image = null
    },
    loadImage (event) {
      // Reference to the DOM input element
      const input = event.target
      // Ensure that you have a file before attempting to read it
      if (input.files && input.files[0]) {
        // create a new FileReader to read this image and convert to base64 format
        const reader = new FileReader()
        // Define a callback function to run, when FileReader finishes its job
        reader.onload = (e) => {
          // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
          // Read image as base64 and set to imageData
          this.image = e.target.result
        }
        // Start the reader job - read file as a data url (base64 format)
        reader.readAsDataURL(input.files[0])
      }
    },
    loadImageAsBase64 (imageUrl) {
      return fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (e) => { this.image = e.target.result }
            reader.onerror = reject
            reader.readAsDataURL(blob)
          })
        })
    },
    onChange ({ coordinates, image }) {
      this.result = {
        coordinates,
        image
      }
    },
    onConfirm () {
      const { canvas } = this.$refs.cropper.getResult()
      if (canvas) {
        canvas.toBlob(blob => {
          this.fileName = 't.png'
          this.$emit('save', { blob, fileName: this.fileName })
          uploadTmpFile(new File([blob], this.fileName)).then((data) => {
            if (data.success) {
              this.$emit('createdTmpFile', data.uploadedFile)
            } else {
              console.error('Error')
            }
            this.onClose()
          })
        }, 'image/jpeg')
      }
    },
    onClose () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>

.container {
  display: flex;
  align-items: center;
  justify-content: center;

  .content {
    position: relative;
    width: 500px;
    height: 300px;
    display: flex;
    justify-content: center;

    .my-preview {
      position: absolute;
      right: -165px;
      top: 70px;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      overflow: hidden;
    }
  }
}

.cropper {
  border: solid 1px #EEE;
  height: 300px;
  width: 100%;
}

.button-wrapper {
  position: absolute;
  right: -200px;
  top: 20px;

  box-shadow: 0 2px 3px rgba(0,0,0,.19);
  font-family: inherit;
  border-radius: 5px;
  padding: 6px 12px;
  text-align: center;
  border: none;
  cursor: pointer;
  display: inline-block;
}

.button input {
  display: none;
}

</style>

<i18n locale="fr">
{
  "header": "Image",
  "saveButton": "Valider",
  "selectButton": "Sélectionner une image",
  "openFilePicker": "Choisir un fichier de l'ent"
}
</i18n>
