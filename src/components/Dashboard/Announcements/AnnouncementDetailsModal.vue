<template>
  <PentilaWindow
    class="diary-event-details-modal"
    data-test="diary-event-details-modal"
    :modal="true"
    :draggable="true"
    @close="onClose"
  >
    <template #header>
      <span> {{ initAnnouncement.title }} </span>
    </template>

    <template #body>
      <div
        v-if="isLoading"
        class="placeholder"
      >
        <PentilaSpinner />
      </div>
      <div
        v-if="error === true"
        v-t="'errorPlaceholder'"
        class="placeholder"
      />
      <div
        v-else
        class="detailed-announcement"
      >
        {{ detailedAnnouncement }}
      </div>
    </template>
  </PentilaWindow>
</template>

<script>
import { getNewsDetails } from '@/api/dashboard/news.service'

export default {
  name: 'AnnouncementDetailsModal',
  props: {
    initAnnouncement: {
      type: Object,
      default: undefined
    }
  },
  emits: ['close'],
  data () {
    return {
      detailedAnnouncement: undefined,
      isLoading: false,
      error: undefined
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')
    this.getAnnouncementDetails()
  },
  methods: {
    getAnnouncementDetails () {
      this.isLoading = true
      getNewsDetails(this.initAnnouncement.newsId).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.error = false
          this.detailedAnnouncement = data
        } else {
          this.error = true
          console.error('Error while getting announcement details')
        }
      })
    },
    onClose () {
      this.$store.dispatch('misc/decreaseModalCount')
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.placeholder {
  height: 20vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.25em;
}
</style>

<i18n locale="fr">
{
  "errorPlaceholder": "Oups, une erreur est survenue..."
}
</i18n>
