<template>
  <NeroWindow
    :modal="true"
    @close="onClose"
  >
    <span
      slot="header"
      v-t="'ImagePicker'"
    />

    <div slot="body">
      <div class="cropper">
        <CustomCropper
          :img="image"
          @select-image="onSelect"
        />
      </div>
      <div class="personal-computer">
        <h4 v-t="'ImagePickerWindow.ImagePickerModal.personalComputerHeader'" />
        <div>
          <div class="input-button">
            <i class="icon-reset" />
            <span v-t="'ImagePickerWindow.ImagePickerModal.fileInputLabel'" />
            <input
              id="file_input"
              type="file"
              accept="image/png,image/jpg,image/gif"
              @change="fileChange"
            >
          </div>
          <span
            v-if="fileName === ''"
            v-t="'ImagePickerWindow.ImagePickerModal.noFilePickedLabel'"
          />
          <span v-else>
            {{ fileName }}
          </span>
        </div>
        <label class="max-size">
          {{ $t('ImagePickerWindow.ImagePickerModal.maxSizeLabel') }} -
          {{ $t('ImagePickerWindow.ImagePickerModal.extensionsLabel') }}
        </label>
      </div>
      <div class="nero-documents">
        <h4 v-t="'ImagePickerWindow.ImagePickerModal.neroDocumentsHeader'" />
      </div>
    </div>
    <NeroButton
      slot="footer"
      :label="$t('ImagePickerWindow.ImagePickerModal.saveButtonLabel')"
      @click="onConfirm"
    />
  </NeroWindow>
</template>

<script>
import CustomCropper from '@/components/ImagePickerWindow/CustomCropper'
import NeroButton from '@/components/Nero/NeroButton'
import NeroWindow from '@/components/Nero/NeroWindow'

export default {
  name: 'ImagePickerModal',
  components: {
    CustomCropper,
    NeroButton,
    NeroWindow
  },
  data () {
    return {
      imageBlob: undefined,
      fileName: '',
      image: '',
      $input: null
    }
  },
  mounted () {
    this.$input = this.$el.querySelectorAll('#file_input')[0]
  },
  methods: {
    fileChange () {
      var vm = this
      var fileReader = new FileReader()
      fileReader.onloadend = function () {
        vm.image = fileReader.result
      }
      if (this.$input.files && this.$input.files[0]) {
        fileReader.readAsDataURL(this.$input.files[0])
      }
    },
    onClose () {
      this.$store.dispatch('nero/closeImagePickerModal')
    },
    onConfirm () {
      if (this.imageBlob !== undefined) {
        // TODO get fileName
        this.fileName = 't.png'
        this.$store.state.nero.imagePickerModal.onConfirm(this.imageBlob, this.fileName)
        this.onClose()
      }
    },
    onSelect (blob) {
      this.imageBlob = blob
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.personal-computer h4,
.nero-documents h4 {
  margin: 10px 0px;
}

.input-button {
  display: inline-block;
  border: 1px rgba(0, 0, 0, 0.3) solid;
  border-radius: 5px;
  background: $background-light-color;
  position: relative;
  margin: 0 10px;
  padding: 6px 12px;
  cursor: pointer;
}

.input-button input {
  position: absolute;
  font-size: 100px;
  right: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
}

.input-button:hover {
  color: #00b5e5;
}

.max-size {
  margin-left: 10px;
}
</style>
