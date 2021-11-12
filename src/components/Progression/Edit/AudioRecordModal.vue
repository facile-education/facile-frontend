<template>
  <PentilaWindow
    :modal="true"
    class="linkWindow"
    win-width="600px"
    @close="closeModal"
  >
    <template #header>
      <span v-t="'title'" />
    </template>

    <template #body>
      <h1>Simple Video Recording using RecordRTC</h1>
      <br>
      <button
        id="btn-start-recording"
        :disabled="disabled"
        @click="startRec"
      >
        Start Recording
      </button>&nbsp;&nbsp;
      <button
        id="btn-stop-recording"
        :disabled="!disabled"
        @click="stopRec"
      >
        Stop Recording
      </button>
      <hr>
      <!-- <video controls autoplay playsinline ref="video" height="500" width="700"></video>-->
      <audio
        ref="audio"
        autoplay
        height="500"
        width="700"
      />
    </template>

    <template #footer>
      <PentilaButton
        :label="$t('add')"
        class="button create-button"
        @click="addRecord"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import RecordRTC from 'recordrtc'

export default {
  name: 'AudioRecordModal',
  components: { },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  data () {
    return {
      recorder: null,
      disabled: false
    }
  },
  computed: {
  },
  created () {
  },
  methods: {
    closeModal () {
      this.$emit('close')
    },
    addRecord () {
      this.$store.dispatch('progression/addAudioRecord', { itemId: this.item.itemId, linkName: this.link.linkName, linkUrl: this.link.linkUrl })
      this.closeModal()
    },
    startRec () {
      this.disabled = true
      this.captureCamera(camera => {
        const video = this.$refs.video
        video.muted = true
        video.volume = 0
        video.srcObject = camera
        this.recorder = RecordRTC(camera, { type: 'video' })
        this.recorder.startRecording()
        // release camera on stopRecording
        this.recorder.camera = camera

        this.disabled = true
      })
    },
    stopRec () {
      this.disabled = false
      this.recorder.stopRecording(this.stopRecordingCallback)
    },
    captureCamera (callback) {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then(function (camera) {
          callback(camera)
        })
        .catch(function (error) {
          alert('Unable to capture your camera. Please check console logs.')
          console.error(error)
        })
    },
    stopRecordingCallback () {
      const video = this.$refs.video
      video.src = video.srcObject = null
      video.muted = false
      video.volume = 1
      video.src = URL.createObjectURL(this.recorder.getBlob())

      this.recorder.camera.stop()
      this.recorder.destroy()
      this.recorder = null
    }
  }
}
</script>

<style lang="scss" scoped>
.linkWindow {
  span {
    text-align: center;
    margin: 10px;
  }
  .link-url, .link-name {
    margin: 10px;
  }
}
</style>

<i18n locale="fr">
{
  "title": "Enregistrement audio",
  "cancel": "Annuler",
  "add": "Ajouter",
  "namePlaceholder": "Mon lien",
  "urlPlaceholder": "https://www.monlien.com"
}
</i18n>
