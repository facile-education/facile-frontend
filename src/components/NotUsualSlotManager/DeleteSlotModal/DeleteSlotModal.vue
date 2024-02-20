<template>
  <WeprodeWindow
    :modal="true"
    :max-width="750"
    :full-screen="mq.phone || mq.tablet"
    class="delete-slot-modal"
    data-test="delete-slot-modal"
    @close="closeModal"
  >
    <template #header>
      <span v-t="'NotUsualSlotManager.DeleteSlotModal.title'" />
    </template>

    <template #body>
      <div class="body">
        <div class="message">
          {{ formattedMessage }}
        </div>
        <div
          v-if="isLoaded"
          class="period"
          data-test="period"
        >
          <span
            v-t="'NotUsualSlotManager.DeleteSlotModal.onThePeriod'"
            class="label"
          />
          <DateRangePicker
            :initial-range="{start: deleteStartDate, end: deleteEndDate}"
            :min-date="schoolYearStartDate.toDate()"
            :max-date="schoolYearEndDate.toDate()"
            @update-dates="updateSlotDates"
          />
        </div>
        <WeprodeSpinner v-else />
      </div>
    </template>

    <template #footer>
      <div class="footer">
        <WeprodeButton
          :label="$t('NotUsualSlotManager.DeleteSlotModal.deleteSlot')"
          class="delete"
          :disabled="!isLoaded"
          @click="confirmSlotDeletion"
        />
      </div>
    </template>
  </WeprodeWindow>
</template>

<script>
import DateRangePicker from '@components/Base/DateRangePicker.vue'
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'
import dayjs from 'dayjs'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants'
import schoolLifeService from '@/api/schoolLife-portlet.service'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'
export default {
  name: 'DeleteSlotModal',
  components: { WeprodeButton, DateRangePicker, WeprodeSpinner, WeprodeWindow },
  inject: ['mq'],
  props: {
    initEvent: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  data () {
    return {
      deleteStartDate: undefined,
      deleteEndDate: undefined
    }
  },
  computed: {
    isLoaded () {
      return this.configuration && this.deleteEndDate
    },
    configuration () {
      return this.$store.state.calendar.configuration
    },
    schoolYearStartDate () {
      return dayjs(this.configuration.schoolYearStartDate, DATE_EXCHANGE_FORMAT)
    },
    schoolYearEndDate () {
      return dayjs(this.configuration.schoolYearEndDate, DATE_EXCHANGE_FORMAT)
    },
    currentSlotType () {
      return this.$store.state.notUsualSlots.currentSlotType
    },
    formattedMessage () {
      return this.$t('NotUsualSlotManager.DeleteSlotModal.message', {
        slotType: this.currentSlotType.label,
        dayLabel: dayjs(this.initEvent.startDate, DATE_EXCHANGE_FORMAT).format('dddd'),
        startHour: dayjs(this.initEvent.startDate, DATE_EXCHANGE_FORMAT).format('HH:mm'),
        endHour: dayjs(this.initEvent.endDate, DATE_EXCHANGE_FORMAT).format('HH:mm')
      })
    }
  },
  watch: {
    configuration: {
      immediate: true,
      handler () {
        if (this.configuration) {
          this.getLastSessionDate()
        } else {
          this.$store.dispatch('calendar/getConfiguration')
        }
      }
    }
  },
  created () {
    this.deleteStartDate = dayjs(this.initEvent.startDate, DATE_EXCHANGE_FORMAT)
  },
  methods: {
    getLastSessionDate () {
      schoolLifeService.getSessionLimitSlotDate(this.initEvent.sessionId).then((data) => {
        if (data.success) {
          this.deleteEndDate = dayjs(data.lastSessionDate, DATE_EXCHANGE_FORMAT)
        }
      }, (err) => {
        console.error(err)
      })
    },
    confirmSlotDeletion () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('NotUsualSlotManager.DeleteSlotModal.deleteWarning'),
        lastAction: { fct: this.deleteSlot, params: [] }
      })
    },
    deleteSlot () {
      schoolLifeService.deleteSlot(
        this.initEvent.sessionId,
        this.deleteStartDate.hour(4).format(DATE_EXCHANGE_FORMAT), // Set hour early in the morning
        this.deleteEndDate.format(DATE_EXCHANGE_FORMAT)
      ).then((data) => {
        if (data.success) {
          this.$store.dispatch('notUsualSlots/refreshCalendar')
          this.closeModal()
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
          console.error(data.error)
        }
      }, (err) => {
        this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        console.error(err)
      })
    },
    updateSlotDates (range) {
      this.deleteStartDate = dayjs(range.start)
      this.deleteEndDate = dayjs(range.end)
    },
    closeModal () {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss">
.delete-slot-modal {
  .window-body {
    overflow: visible !important;
  }
}
</style>

<style lang="scss" scoped>

.body {
  position: relative;
}

.message {
  margin-bottom: 1rem;
}

.period {
  display: flex;
  align-items: center;

  .label {
    margin-right: 1rem;
  }
}

</style>
