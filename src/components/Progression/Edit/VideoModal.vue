<template>
  <PentilaWindow
    :modal="true"
    class="videoWindow"
    :class="{'mobile': mq.phone}"
    @close="closeModal"
  >
    <template #header>
      <span v-t="'title'" />
    </template>

    <template #body>
      <PentilaInput
        v-model="video.videoName"
        :maxlength="200"
        :placeholder="$t('namePlaceholder')"
        class="video-name"
      />
      <PentilaInput
        v-model="video.videoUrl"
        :maxlength="200"
        :placeholder="$t('urlPlaceholder')"
        class="video-url"
      />
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
          @click="addVideo"
        />
      </div>
    </template>
  </PentilaWindow>
</template>

<script>

export default {
  name: 'VideoModal',
  inject: ['mq'],
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  data () {
    return {
      video: {
        videoName: '',
        videoUrl: ''
      }
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
    addVideo () {
      this.$store.dispatch('progression/addVideo', { itemId: this.item.itemId, videoName: this.video.videoName, videoUrl: this.video.videoUrl })
      this.closeModal()
    }
  }
}
</script>

<style lang="scss" scoped>
.videoWindow {
  span {
    text-align: center;
    margin: 10px;
  }
  .video-url, .video-name {
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
  "title": "Ajouter une video",
  "cancel": "Annuler",
  "add": "Ajouter",
  "namePlaceholder": "Ma video",
  "urlPlaceholder": "https://www.youtube.com/watch?v=C_uNmmgQliM"
}
</i18n>
