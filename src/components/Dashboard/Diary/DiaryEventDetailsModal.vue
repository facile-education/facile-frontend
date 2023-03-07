<template>
  <PentilaWindow
    class="diary-event-details-modal"
    data-test="diary-event-details-modal"
    :modal="true"
    :draggable="true"
    @close="onClose"
  >
    <template #body>
      <DiaryEventDetails
        :init-event="initEvent"
        :is-in-modal="true"
        @update="updateEvent"
        @delete="deleteEvent"
      />
    </template>

    <template #footer>
      <PentilaButton
        v-if="initEvent.isEditable"
        class="footer-button"
        data-test="updateButton"
        :label="$t('update')"
        @click="updateEvent"
      />
      <PentilaButton
        v-if="initEvent.isEditable"
        class="footer-button"
        data-test="deleteButton"
        :label="$t('delete')"
        @click="deleteEvent"
      />
    </template>
  </PentilaWindow>
</template>

<script>

import DiaryEventDetails from '@components/Dashboard/Diary/DiaryEventDetails.vue'

export default {
  name: 'DiaryEventDetailsModal',
  components: { DiaryEventDetails },
  props: {
    initEvent: {
      type: Object,
      default: undefined
    }
  },
  emits: ['close', 'update', 'delete'],
  data () {
    return {
      detailedEvent: undefined,
      isLoading: false,
      error: undefined
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')
  },
  methods: {
    updateEvent () {
      this.$emit('update')
    },
    deleteEvent () {
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
.placeholder {
  height: 20vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.25em;
}

.footer-button {
  margin-left: 15px;
}
</style>

<i18n locale="fr">
{
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "update": "Modifier",
  "delete": "Supprimer"
}
</i18n>
