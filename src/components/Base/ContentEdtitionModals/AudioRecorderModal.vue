<template>
  <WeprodeWindow
    :modal="true"
    :draggable="true"
    class="linkWindow"
    :width="600"
    @close="closeModal"
  >
    <template #header>
      <span v-t="'Base.AudioRecorderModal.title'" />
    </template>

    <template #body>
      <div class="audio-name">
        <WeprodeInput
          ref="nameInput"
          v-model="audioName"
          :maxlength="200"
          :placeholder="$t('Base.AudioRecorderModal.namePlaceholder')"
          @keyup.enter.stop="addRecord"
        />
        <WeprodeErrorMessage
          :error-message="formErrorList.audioName"
        />
      </div>

      <AudioRecorder
        @audio-file="setAudioFile"
        @stopped-state="setStoppedState"
      />
    </template>

    <template #footer>
      <WeprodeButton
        :label="$t('Base.AudioRecorderModal.save')"
        :disabled="!isStopped || !formErrorList"
        data-test="submitRecord"
        @click="addRecord"
      />
    </template>
  </WeprodeWindow>
</template>

<script>
import AudioRecorder from '@components/Base/AudioRecorder.vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'
import WeprodeErrorMessage from '@/components/Base/Weprode/WeprodeErrorMessage.vue'
import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'

export default {
  name: 'AudioRecorderModal',
  components: { AudioRecorder, WeprodeButton, WeprodeErrorMessage, WeprodeInput, WeprodeWindow },
  props: {
    duration: {
      type: Number,
      // 5 minutes : 300 sec
      default: 300
    }
  },
  emits: ['close', 'save'],
  setup: () => ({ v$: useVuelidate() }),
  validations: {
    audioName: { required }
  },
  data () {
    return {
      audioFile: undefined,
      isStopped: false,
      audioName: '',
      errorMessage: ''
    }
  },
  computed: {
    formErrorList () {
      return {
        audioName: (this.v$.audioName.$invalid && this.v$.audioName.$dirty) ? this.$t('Commons.required') : ''
      }
    }
  },
  mounted () {
    // Focus form
    const input = this.$refs.nameInput
    input.focus()
    input.select()
  },
  methods: {
    setStoppedState (state) {
      this.isStopped = state
    },
    setAudioFile (file) {
      this.audioFile = file
    },
    closeModal () {
      this.$emit('close')
    },
    addRecord (e) {
      e.preventDefault()
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else if (this.isStopped) {
        const formData = new FormData()
        formData.append('fileName', this.audioFile.name)
        formData.append('file', this.audioFile)
        formData.append('contentName', this.audioName)
        this.$emit('save', formData)

        this.closeModal()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.audio-name {
  margin-bottom: 20px
}
</style>
