<template>
  <PentilaWindow
    class="diary-event-details-modal"
    data-test="diary-event-details-modal"
    :modal="true"
    :draggable="true"
    :full-screen="mq.phone || mq.tablet"
    @close="onClose"
  >
    <template #header>
      <span class="header">{{ initEvent.title }}</span>
    </template>

    <template #body>
      <DiaryEventDetails
        :init-event="initEvent"
        :is-in-modal="true"
        @update="updateEvent"
        @delete="deleteEvent"
      />
    </template>
    <template #footer>
      <div v-if="initEvent.isEditable || initEvent.isDeletable">
        <PentilaButton
          v-if="initEvent.isEditable"
          class="footer-button"
          data-test="updateButton"
          :label="$t('update')"
          @click="updateEvent"
        />
        <PentilaButton
          v-if="initEvent.isDeletable"
          class="footer-button"
          data-test="deleteButton"
          :label="$t('delete')"
          @click="confirmDeleteEvent"
        />
      </div>
    </template>
  </PentilaWindow>
</template>

<script>

import DiaryEventDetails from '@components/Dashboard/DiaryWidget/DiaryEventDetails.vue'

export default {
  name: 'DiaryEventDetailsModal',
  components: { DiaryEventDetails },
  inject: ['mq'],
  props: {
    initEvent: {
      type: Object,
      default: undefined
    }
  },
  emits: ['close', 'update', 'delete'],
  data () {
    return {
      detailedEvent: undefined
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')
  },
  methods: {
    confirmDeleteEvent () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('removalConfirmMessage'),
        lastAction: { fct: this.deleteEvent, params: [] }
      })
    },
    deleteEvent () {
      this.$emit('delete')
    },
    onClose () {
      this.$store.dispatch('misc/decreaseModalCount')
      this.$emit('close')
    },
    updateEvent () {
      this.$emit('update')
    }
  }
}
</script>

<style lang="scss" scoped>
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
