<template>
  <PentilaWindow
    :modal="true"
    :width="700"
    @close="onClose"
  >
    <template #header>
      <span v-t="'header'" />
    </template>

    <template #body>
      <div class="body">
        <PentilaSpinner v-if="isLoading" />
        <div
          v-if="initialThumbnailUrl && image===null"
          class="placeholder"
        >
          <img
            :src="initialThumbnailUrl"
            alt="init thumbnail"
          >
        </div>
        <div
          v-show="image!==null"
          class="content"
        >
          <cropper
            ref="cropper"
            class="cropper"
            :src="image"
            :stencil-props="{
              aspectRatio: 1
            }"
            :debounce="false"
            :min-height="50"
            :min-width="50"
            @change="onChange"
          />
          <div
            v-if="!mq.phone && !mq.tablet"
            class="preview-container"
          >
            <preview
              class="my-preview"
              :width="120"
              :height="120"
              :image="result.image"
              :coordinates="result.coordinates"
            />
          </div>
        </div>

        <SelectFilesButtons
          :label="$t('changePictureLabel')"
          :images-only="true"
          @load="loadImage"
          @select-files="selectImageFromApp"
        />
      </div>
    </template>

    <template #footer>
      <PentilaButton
        v-if="result.image !== null"
        :label="$t('saveButton')"
        @click="onConfirm"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import { Cropper, Preview } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { getResource, uploadTmpFile } from '@/api/documents/file.service'
import SelectFilesButtons from '@components/FilePicker/SelectFilesButtons.vue'

export default {
  name: 'ImagePickerModal',
  components: {
    SelectFilesButtons,
    Cropper,
    Preview
  },
  inject: ['mq'],
  props: {
    initialThumbnailUrl: {
      type: String,
      default: undefined
    }
  },
  emits: ['close', 'save', 'createdTmpFile'],
  data () {
    return {
      result: {
        coordinates: null,
        image: null
      },
      image: null,
      isFilePickerDisplayed: false,
      isLoading: false
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
    reset () {
      this.image = null
    },
    selectImageFromApp (files) {
      const image = files[0]
      getResource(image.id, 0, true).then((data) => {
        if (data.success) {
          this.loadImageAsBase64(data.fileUrl)
        } else {
          console.error('cannot load file in cropper')
        }
      })
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
    onChange ({ coordinates, image }) {
      this.result = {
        coordinates,
        image
      }
    },
    onConfirm () {
      const { canvas } = this.$refs.cropper.getResult()
      if (canvas && !this.isLoading) {
        canvas.toBlob(blob => {
          this.fileName = 't.jpeg'
          this.$emit('save', { blob, fileName: this.fileName })
          this.isLoading = true
          uploadTmpFile(new File([blob], this.fileName)).then((data) => {
            this.isLoading = false
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
.body {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.placeholder, .content {
  margin-bottom: 1rem;
  width: 100%;
}

.placeholder {
  display: flex;
  justify-content: center;

  img {
    width: min(350px, 100%);;
  }
}

.content {
  display: flex;

  .cropper {
    border: solid 1px #EEE;
    height: 300px;
    width: min(500px, 100%);
  }

  .preview-container {
    width: 100%;
    margin-top: 2rem;
    display: flex;
    justify-content: flex-end;
  }

  .my-preview {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
  }
}

</style>

<i18n locale="fr">
{
  "header": "Choisir une image",
  "saveButton": "Valider",
  "changePictureLabel": "Changer l'image"
}
</i18n>
