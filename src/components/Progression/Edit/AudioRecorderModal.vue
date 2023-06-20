<template>
  <PentilaWindow
    :modal="true"
    :draggable="true"
    class="linkWindow"
    :width="600"
    @close="closeModal"
  >
    <template #header>
      <span v-t="'title'" />
    </template>

    <template #body>
      <div class="audio-name">
        <PentilaInput
          ref="nameInput"
          v-model="audioName"
          :maxlength="200"
          :placeholder="$t('namePlaceholder')"
          @keyup.enter.stop="addRecord"
        />
        <PentilaErrorMessage
          :error-message="formErrorList.audioName"
        />
      </div>

      <AudioRecorder
        @audioFile="setAudioFile"
        @stoppedState="setStoppedState"
      />
    </template>

    <template #footer>
      <PentilaButton
        :label="$t('save')"
        :disabled="!isStopped || !formErrorList"
        @click="addRecord"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import AudioRecorder from '@components/Nero/AudioRecorder'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

export default {
  name: 'AudioRecorderModal',
  components: { AudioRecorder },
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
  margin: 0 auto 1.5rem;

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

<i18n locale="fr">
{
  "browserError": "Votre navigateur ne permet pas l'enregistrement de contenu media.",
  "continue": "Reprendre",
  "deniedError": "Une erreur est survenue lors de l'accès aux ressources de l'ordinateur (Accès refusé)",
  "listen": "Ecouter",
  "namePlaceholder": "Titre",
  "title": "Enregistrement audio",
  "pause": "Interrompre",
  "recording": "Enregistrement...",
  "restart": "Recommencer",
  "save": "Valider",
  "start": "Démarrer",
  "stop": "Arrêter"
}
</i18n>
