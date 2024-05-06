<template>
  <WeprodeWindow
    class="news-details-modal"
    data-test="news-details-modal"
    :modal="true"
    :draggable="true"
    :full-screen="mq.phone || mq.tablet"
    @close="onClose"
  >
    <template #header>
      <span class="header">{{ initNews.title }}</span>
    </template>

    <template #body>
      <NewsDetails
        ref="newsDetails"
        :init-news="initNews"
        :is-in-modal="true"
        @update="$emit('update')"
        @delete="deleteNews"
      />
    </template>

    <template #footer>
      <div v-if="initNews.isEditable || initNews.isDeletable">
        <WeprodeButton
          v-if="initNews.isEditable"
          class="footer-button"
          data-test="updateButton"
          :label="$t('Dashboard.NewsDetailsModal.update')"
          @click="openUpdateModal"
        />
        <WeprodeButton
          v-if="initNews.isDeletable"
          class="footer-button"
          data-test="deleteButton"
          :label="$t('Dashboard.NewsDetailsModal.delete')"
          @click="confirmDeleteNews"
        />
      </div>
    </template>
  </WeprodeWindow>
</template>

<script>
import NewsDetails from '@components/Dashboard/AnnouncementsWidget/NewsDetails.vue'

import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'

export default {
  name: 'NewsDetailsModal',
  components: { NewsDetails, WeprodeButton, WeprodeWindow },
  inject: ['mq'],
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
    openUpdateModal () {
      this.$refs.newsDetails.openUpdateModal()
    },
    confirmDeleteNews () {
      this.$refs.newsDetails.confirmDeleteNews()
    },
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

<style lang="scss" scoped>
// TODO: put this in pentila component?
.header {
  width: 90%;
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.footer-button {
  margin-left: 1rem;
}
</style>
