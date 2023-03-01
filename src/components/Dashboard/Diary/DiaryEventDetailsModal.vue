<template>
  <PentilaWindow
    class="update-diary-event-modal"
    data-test="update-diary-event-modal"
    :modal="true"
    :draggable="true"
    @close="onClose"
  >
    <template #header>
      <span> {{ initEvent.title }} </span>
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
        class="detailed-event"
      >
        {{ detailedEvent }}
      </div>
    </template>
  </PentilaWindow>
</template>

<script>
import { getEventDetails } from '@/api/dashboard/agenda.service'

export default {
  name: 'DiaryEventDetailsModal',
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
    this.getEventDetails()
  },
  methods: {
    getEventDetails () {
      this.isLoading = true
      getEventDetails(this.initEvent.eventId).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.error = false
          this.detailedEvent = data
        } else {
          this.error = true
          console.error('Error')
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
