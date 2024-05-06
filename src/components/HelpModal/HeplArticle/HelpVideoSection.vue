<template>
  <section class="video-section">
    <video
      v-if="videoUrl!==''"
      controls
      :autoplay="false"
      class="video"
    >
      <source
        :src="videoUrl"
        type="video/mp4"
      >
      Sorry, your browser doesn't support embedded videos.
    </video>
    <button
      v-if="isAdministrator"
      v-t="'HelpModal.HelpVideoSection.editVideo'"
      :class="{'visible': videoUrl === ''}"
      @click="isEditVideoModalDisplayed=true"
    />
    <div
      v-if="videoUrl!==''"
      class="video-description"
      v-html="videoDescription"
    />

    <teleport
      v-if="isEditVideoModalDisplayed"
      to="body"
    >
      <EditVideoModal
        :video-url="videoUrl"
        :video-description="videoDescription"
        @close="isEditVideoModalDisplayed=false"
      />
    </teleport>
  </section>
</template>

<script>
import { defineAsyncComponent } from 'vue'
const EditVideoModal = defineAsyncComponent(() => import('@components/HelpModal/CreationModals/EditVideoModal.vue'))

export default {
  name: 'HelpVideoSection',
  components: { EditVideoModal },
  props: {
    videoUrl: {
      type: String,
      required: true
    },
    videoDescription: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isEditVideoModalDisplayed: false
    }
  },
  computed: {
    isAdministrator () {
      return this.$store.state.user.isAdministrator
    }
  }
}
</script>

<style lang="scss" scoped>
.video-section {
  &:hover {
    button {
      display: block;
    }
  }
}

button {
  width: 100%;
  display: none;

  &.visible {
    display: block;
  }
}

video {
  width: 100%;
}

.video-description {
  font-size: 1.063em;
  font-weight: bold;
  text-align: center;
}

</style>
