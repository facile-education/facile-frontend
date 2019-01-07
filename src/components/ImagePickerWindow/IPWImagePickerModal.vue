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
        <CustomCropper :img="image" />
      </div>
      <div class="personal-computer">
        PC picker
        <div class="reset-img">
          <i class="icon-reset" />
          <span>select image</span>
          <input
            id="file_input"
            type="file"
            accept="image/png,image/jpg,image/gif"
            @change="fileChange"
          >
        </div>
      </div>
      <div class="nero-documents">
        Workspace / Dropbox picker
      </div>
    </div>
    <NeroButton
      slot="footer"
      :label="$t('TODO')"
      @click="onConfirm"
    />
  </NeroWindow>
</template>

<script>
import CustomCropper from '@/components/ImagePickerWindow/CustomCropper'
import NeroButton from '@/components/Nero/NeroButton'
import NeroWindow from '@/components/Nero/NeroWindow'

export default {
  name: 'IPWImagePickerModal',
  components: {
    CustomCropper,
    NeroButton,
    NeroWindow
  },
  data () {
    return {
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
      var fd = new FileReader()
      fd.onloadend = function () {
        vm.image = fd.result
      }
      if (this.$input.files && this.$input.files[0]) {
        fd.readAsDataURL(this.$input.files[0])
      }
    },
    onClose () {
      this.$store.dispatch('nero/closeImagePickerModal')
    },
    onConfirm () {
      console.log('save image')
    }
  }
}
</script>

<style lang="scss" scoped>

.personal-computer {
  border: 4px solid red;
}

.reset-img {
  background: pink;
  position: relative;
  margin-top: 5px;
  color: #6d757a;
  cursor: pointer;
  width: 100px;
}

.reset-img input {
  position: absolute;
  font-size: 100px;
  right: 0;
  top: 0;
  opacity: 0;
  cursor: pointer
}

.reset-img:hover {
  color: #00b5e5;
}
</style>
