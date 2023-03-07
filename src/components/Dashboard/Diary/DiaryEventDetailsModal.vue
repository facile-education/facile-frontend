<template>
  <PentilaWindow
    class="diary-event-details-modal"
    data-test="diary-event-details-modal"
    :modal="true"
    :draggable="true"
    @close="onClose"
  >
    <template #body>
      <DiaryEventDetails :init-event="initEvent" />
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
  emits: ['close'],
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
