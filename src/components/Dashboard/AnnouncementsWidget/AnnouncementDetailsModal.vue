<template>
  <PentilaWindow
    class="diary-event-details-modal"
    data-test="diary-event-details-modal"
    :modal="true"
    :draggable="true"
    @close="onClose"
  >
    <template #body>
      <AnnouncementDetails
        :init-announcement="initAnnouncement"
        @update="updateAnnouncement"
        @delete="deleteAnnouncement"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import AnnouncementDetails from '@components/Dashboard/AnnouncementsWidget/AnnouncementDetails.vue'
export default {
  name: 'AnnouncementDetailsModal',
  components: { AnnouncementDetails },
  props: {
    initAnnouncement: {
      type: Object,
      default: undefined
    }
  },
  emits: ['close', 'update', 'delete'],
  data () {
    return {
      detailedAnnouncement: undefined
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')
  },
  methods: {
    updateAnnouncement () {
      this.$emit('update')
    },
    deleteAnnouncement () {
      this.$emit('delete')
    },
    onClose () {
      this.$store.dispatch('misc/decreaseModalCount')
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
