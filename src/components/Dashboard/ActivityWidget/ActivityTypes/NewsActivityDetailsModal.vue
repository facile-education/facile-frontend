<template>
  <PentilaWindow
    class="diary-event-details-modal"
    data-test="diary-event-details-modal"
    :modal="true"
    :draggable="true"
    @close="onClose"
  >
    <template #header>
      <span>{{ initNews.title }}</span>
    </template>

    <template #body>
      <NewsActivityDetails
        :init-news="initNews"
        @update="updateNews"
        @delete="deleteNews"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import NewsActivityDetails from '@components/Dashboard/ActivityWidget/ActivityTypes/NewsActivityDetails.vue'

export default {
  name: 'NewsActivityDetailsModal',
  components: { NewsActivityDetails },
  props: {
    initNews: {
      type: Object,
      default: undefined
    }
  },
  emits: ['close', 'update', 'delete'],
  data () {
    return {
      detailedNews: undefined
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')
  },
  methods: {
    updateNews () {
      this.$emit('update')
    },
    deleteNews () {
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
