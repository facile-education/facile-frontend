<template>
  <PentilaWindow
    class="news-details-modal"
    data-test="news-details-modal"
    :modal="true"
    :draggable="true"
    :full-screen="mq.phone || displayLikePhone"
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
      <PentilaButton
        class="footer-button"
        data-test="updateButton"
        :label="$t('update')"
        @click="openUpdateModal"
      />
      <PentilaButton
        class="footer-button"
        data-test="deleteButton"
        :label="$t('delete')"
        @click="confirmDeleteNews"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import NewsDetails from '@components/Dashboard/AnnouncementsWidget/NewsDetails.vue'

export default {
  name: 'NewsDetailsModal',
  components: { NewsDetails },
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
  computed: {
    displayLikePhone () {
      return this.$store.state.misc.keepPhoneStatus
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

<i18n locale="fr">
{
  "update": "Modifier",
  "delete": "Supprimer"
}
</i18n>
