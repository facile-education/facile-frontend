<template>
  <PentilaWindow
    :modal="true"
    :max-width="750"
    :full-screen="mq.phone"
    class="delete-slot-modal"
    @close="closeModal"
  >
    <template #header>
      <span v-t="'title'" />
    </template>

    <template #body>
      <div class="body">
        <div class="message">
          {{ formattedMessage }}
        </div>
        <div
          v-if="isLoaded"
          class="period"
        >
          <span
            v-t="'onThePeriod'"
            class="label"
          />
          <DateRangePicker
            :initial-range="{start: deleteStartDate, end: deleteEndDate}"
            :min-date="schoolYearStartDate.toDate()"
            :max-date="schoolYearEndDate.toDate()"
            @updateDates="updateSlotDates"
          />
        </div>
        <PentilaSpinner v-else />
      </div>
    </template>

    <template #footer>
      <div class="footer">
        <PentilaButton
          :label="$t('deleteSlot')"
          class="delete"
          :disabled="!isLoaded"
          @click="confirmSlotDeletion"
        />
      </div>
    </template>
  </PentilaWindow>
</template>

<script>
import DateRangePicker from '@components/Base/DateRangePicker.vue'
import dayjs from 'dayjs'

import schoolLifeService from '@/api/schoolLife-portlet.service'
export default {
  name: 'DeleteSlotModal',
  components: { DateRangePicker },
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
      return dayjs(this.configuration.schoolYearStartDate, 'YYYY-MM-DD')
    },
    schoolYearEndDate () {
      return dayjs(this.configuration.schoolYearEndDate, 'YYYY-MM-DD')
    },
    currentSlotType () {
      return this.$store.state.notUsualSlots.currentSlotType
    },
    formattedMessage () {
      return this.$t('message', {
        slotType: this.currentSlotType.label,
        dayLabel: dayjs(this.initEvent.startDate, 'YYYY-MM-DD HH:mm').format('dddd'),
        startHour: dayjs(this.initEvent.startDate, 'YYYY-MM-DD HH:mm').format('HH:mm'),
        endHour: dayjs(this.initEvent.endDate, 'YYYY-MM-DD HH:mm').format('HH:mm')
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
    this.deleteStartDate = dayjs(this.initEvent.startDate, 'YYYY/MM/DD HH:mm')
  },
  methods: {
    getLastSessionDate () {
      schoolLifeService.getSessionLimitSlotDate(this.initEvent.sessionId).then((data) => {
        if (data.success) {
          this.deleteEndDate = dayjs(data.lastSessionDate, 'YYYY/MM/DD HH:mm')
        }
      }, (err) => {
        console.error(err)
      })
    },
    confirmSlotDeletion () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('deleteWarning'),
        lastAction: { fct: this.deleteSlot, params: [] }
      })
    },
    deleteSlot () {
      schoolLifeService.deleteSlot(
        this.initEvent.sessionId,
        this.deleteStartDate.format('YYYY-MM-DD HH:mm'), // convert from calendar format to back-end format
        this.deleteEndDate.format('YYYY-MM-DD HH:mm')
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

<i18n locale="fr">
{
  "deleteWarning": "La suppresion de ce créneau sera définitive !",
  "deleteSlot": "Supprimer",
  "message": "Supprimer les sessions de {slotType} du {dayLabel} de {startHour} à {endHour}",
  "onThePeriod": "Sur la période",
  "title": "Supprimer un horaire hors cadre"
}
</i18n>
