<template>
  <div
    v-if="!isStopped"
    class="icon"
    :class="{'pulse': isRecording}"
  >
    <NeroIcon name="microphone" />
  </div>

  <p
    v-t="'Nero.AudioRecorder.recording'"
    class="state"
    :class="{'recording': isRecording}"
  />

  <div
    v-if="isStopped"
    ref="wavesurfer"
  />

  <div class="timer">
    {{ timerLabel }}
  </div>

  <div class="actions">
    <template v-if="isStopped">
      <WeprodeButton
        data-test="play"
        @click="toggleAudio"
      >
        <NeroIcon
          :name="isAudioPlaying ? 'pause' : 'play'"
        />
        <span>{{ isAudioPlaying ? $t('Nero.AudioRecorder.pause') : $t('Nero.AudioRecorder.listen') }}</span>
      </WeprodeButton>
      <WeprodeButton
        cls="cancel"
        @click="restartRecording"
      >
        <NeroIcon name="undo" />
        <span>{{ $t('Nero.AudioRecorder.restart') }}</span>
      </WeprodeButton>
    </template>
    <template v-else>
      <WeprodeButton @click="toggleRecording">
        <NeroIcon :name="isRecording ? 'pause' : 'play'" />
        <span>{{ isPaused ? $t('Nero.AudioRecorder.continue') : isRecording ? $t('Nero.AudioRecorder.pause') : $t('Nero.AudioRecorder.start') }}</span>
      </WeprodeButton>
      <WeprodeButton
        cls="cancel"
        :disabled="!isRecording && !isPaused"
        data-test="stop"
        @click="stopRecording"
      >
        <NeroIcon
          name="stop"
        />
        <span>{{ $t('Nero.AudioRecorder.stop') }}</span>
      </WeprodeButton>
    </template>
    <WeprodeErrorMessage :error-message="errorMessage" />
  </div>
</template>

<script>
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'
import RecordRTC from 'recordrtc'
import WaveSurfer from 'wavesurfer.js'

import WeprodeErrorMessage from '@/components/Base/Weprode/WeprodeErrorMessage.vue'
import NeroIcon from '@/components/Nero/NeroIcon'

export default {
  name: 'AudioRecorder',
  components: { NeroIcon, WeprodeButton, WeprodeErrorMessage },
  props: {
    duration: {
      type: Number,
      // 5 minutes : 300 sec
      default: 300
    }
  },
  emits: ['audioFile', 'stoppedState'],
  data () {
    return {
      errorMessage: '',
      isAudioPlaying: false,
      recorder: undefined,
      state: 'inactive',
      stream: undefined,
      timer: 0,
      waveSurfer: undefined
    }
  },
  computed: {
    isPaused () {
      return this.state === 'paused'
    },
    isRecording () {
      return this.state === 'recording'
    },
    isStopped () {
      this.$emit('stoppedState', this.state === 'stopped')
      return this.state === 'stopped'
    },
    timerLabel () {
      let minutes = Math.floor(this.timer / 60)
      minutes = minutes < 10 ? '0' + minutes : minutes
      let seconds = Math.trunc(this.timer) % 60
      seconds = seconds < 10 ? '0' + seconds : seconds
      return `${minutes}:${seconds}`
    }
  },
  beforeUnmount () {
    if (this.stream) {
      const tracks = this.stream.getTracks()
      tracks[0].stop()
    }
    if (this.recorder) {
      this.recorder.destroy()
    }
    if (this.waveSurfer) {
      this.waveSurfer.destroy()
    }
  },
  methods: {
    checkUserMediaAccess () {
      if (this.stream) {
        this.startRecording(this.stream)
      } else if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(this.startRecording,
            () => {
              this.errorMessage = this.$t('Nero.AudioRecorder.deniedError')
            })
      } else {
        this.errorMessage = this.$t('Nero.AudioRecorder.browserError')
      }
    },
    displayStream () {
      const options = {
        container: this.$refs.wavesurfer,
        waveColor: '#a3a3a3',
        progressColor: this.$store.state.theme.mainColor
      }

      this.waveSurfer = WaveSurfer.create(options)
      this.waveSurfer.on('audioprocess', () => {
        this.timer = Math.trunc(this.waveSurfer.getCurrentTime())
      })
      this.waveSurfer.on('seek', () => {
        this.timer = this.waveSurfer.getCurrentTime()
      })
      this.waveSurfer.on('finish', () => {
        this.timer = 0
        this.isAudioPlaying = false
      })
      this.waveSurfer.loadBlob(this.recorder.getBlob())
    },
    emitAudioFile () {
      if (this.isStopped) {
        const recordedBlob = this.recorder.getBlob()

        // TODO File name with input when used in documents
        const fileName = `enregistrement_${Date.now()}.wav`
        this.$emit('audioFile', new File([recordedBlob], fileName))
      }
    },
    pauseRecording () {
      if (this.isRecording) {
        this.recorder.pauseRecording()
      } else {
        this.recorder.resumeRecording()
        this.stopWatch()
      }
    },
    restartRecording () {
      // Reset recorded data and timer
      this.recorder.reset()
      this.timer = 0

      if (this.wavesurfer !== undefined) {
        this.wavesurfer.destroy()
        this.wavesurfer = undefined
      }
    },
    startRecording (stream) {
      if (!this.recorder) {
        this.stream = stream
        this.errorMessage = ''

        // Initialize recorder
        this.recorder = RecordRTC(this.stream, {
          disableLogs: true,
          // Does not work on firefox
          // ondataavailable: () => {
          //   console.log('data available')
          //   if (this.isRecording) this.timer += 1
          //   if (this.timer >= this.duration) this.stopRecording()
          // },
          timeSlice: 1000,
          type: 'audio'
        })
        this.recorder.onStateChanged = (state) => {
          this.state = state
        }
      }

      // Start recording
      this.recorder.startRecording()
      this.stopWatch()
    },
    stopRecording () {
      if (!this.isRecording && !this.isPaused) return
      this.recorder.stopRecording((recordingURL) => {
        this.timer = 0
        this.displayStream()
        this.emitAudioFile()
      })
    },
    stopWatch () {
      if (this.isRecording) {
        setTimeout(() => {
          this.timer += 0.1
          // Stop recording if above max duration
          if (this.timer >= this.duration) this.stopRecording()
          this.stopWatch()
        }, 100)
      }
    },
    toggleAudio () {
      this.waveSurfer.playPause()
      this.isAudioPlaying = this.waveSurfer.isPlaying()
    },
    toggleRecording () {
      if (this.isRecording || this.isPaused) {
        this.pauseRecording()
      } else {
        this.checkUserMediaAccess()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$color: #878787;
$red: rgb(230, 109, 109);

.audio-name {
  margin-bottom: 20px
}

.icon {
  height: 60px;
  width: 60px;
  font-size: 1.7rem;
  color: $color;
  border: 1px solid rgba($red, 0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem auto 0.5rem;

  &.pulse {
    box-shadow: 0 0 0 0 rgba($red, 1);
    transform: scale(1);
    animation: pulse 2s infinite;
  }
}

.state {
  overflow: hidden;
  height: 0;
  transition: height 0.3s;
  margin: 0;
  background-color: rgba($red, 0.2);
  color: rgba($red, 1);
  text-align: center;

  &.recording {
    height: 36px;
    padding: 0.5rem 0;
  }
}

.timer {
  font-size: 1.7rem;
  width: 100px;
  text-align: center;
  margin: 20px auto;
  color: $color;
}

.actions {
  text-align: center;

  button {
    border-radius: 30px;
    margin: 0 10px;

    span {
      margin-left: 10px;
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba($red, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba($red, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba($red, 0);
  }
}
</style>
