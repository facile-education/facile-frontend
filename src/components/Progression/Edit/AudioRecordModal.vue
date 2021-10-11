<template>
  <PentilaWindow
    :modal="true"
    class="linkWindow"
    @close="closeModal"
  >
    <template #header>
      <span v-t="'title'" />
    </template>

    <template #body>
      <AudioRecorder
        upload-url="https://test-api.com"
        :attempts="3"
        :time="2"
        :pause-recording="callback"
        :after-recording="callback"
        :select-record="callback"
        :before-upload="callback"
        :successful-upload="callback"
        :failed-upload="callback"
      />
      <AudioPlayer src="/demo/example.mp3" />
    </template>

    <template #footer>
      <div
        class="footer"
      >
        <PentilaButton
          :label="$t('cancel')"
          class="button cancel-button"
          @click="closeModal"
        />
        <PentilaButton
          :label="$t('add')"
          class="button create-button"
          @click="addRecord"
        />
      </div>
    </template>
  </PentilaWindow>
</template>

<script>
import { AudioRecorder, AudioPlayer } from 'vue-audio-recorder'

export default {
  name: 'AudioRecordModal',
  components: { AudioRecorder, AudioPlayer },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  data () {
    return {
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
    callback () {
      console.log('callback')
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

.footer {
  display: flex;
  justify-content: space-around;
  .button {
    width: 150px;
  }
}
</style>

<i18n locale="fr">
{
  "title": "Enregistrement audio",
  "cancel": "Annuler",
  "add": "Ajouter",
  "namePlaceholder": "Mon lien",
  "urlPlaceholder": "https://wwww.monlien.com"
}
</i18n>
