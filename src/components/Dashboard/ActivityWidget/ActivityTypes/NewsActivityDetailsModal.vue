<template>
  <PentilaWindow
    class="news-details-modal"
    data-test="news-details-modal"
    :modal="true"
    :draggable="true"
    :width="600"
    @close="onClose"
  >
    <template #header>
      <span class="header">{{ initNews.title }}</span>
    </template>

    <template #body>
      <NewsActivityDetails
        :init-news="initNews"
        @update="$emit('update')"
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
    deleteNews () {
      this.$emit('delete')
      this.onClose()
    },
    onClose () {
      this.$store.dispatch('misc/decreaseModalCount')
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.news-details-modal.modal-mask .window-container .window-body {
  padding-bottom: 0;
}
</style>

<style lang="scss" scoped>
// TODO: put this in pentila component?
.header {
  width: 90%;
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
