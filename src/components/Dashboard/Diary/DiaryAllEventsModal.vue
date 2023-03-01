<template>
  <PentilaWindow
    class="update-diary-event-modal"
    data-test="update-diary-event-modal"
    :modal="true"
    :draggable="true"
    @close="onClose"
  >
    <template #header>
      <span v-t="'title'" />
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
        class="events-by-month"
      >
        <div
          v-for="(month, index) in eventsByMonth"
          :key="index"
        >
          <div class="period">
            {{ month.monthName }}
          </div>
          <DiaryEventItem
            v-for="(event, i) in month.eventList"
            :key="i"
            :event="event"
            @updateEvent="refresh"
            @deleteEvent="refresh"
          />
        </div>
      </div>
    </template>
  </PentilaWindow>
</template>

<script>
import { getEvents } from '@/api/dashboard/agenda.service'
import { diaryEventModalPaginationSize } from '@/constants/dashboardConstants'
import DiaryEventItem from '@components/Dashboard/Diary/DiaryEventItem.vue'
import dayjs from 'dayjs'

export default {
  name: 'DiaryAllEventsModal',
  components: { DiaryEventItem },
  emits: ['close', 'refresh'],
  data () {
    return {
      unReadOnly: false,
      isLoading: false,
      error: undefined,
      eventList: [],
      fromDate: dayjs()
    }
  },
  computed: {
    eventsByMonth () {
      const eventsByMonth = []
      this.eventList.forEach((event) => {
        const yearDifferenceFromToday = dayjs(event.startDate).year() - dayjs().year()
        const eventMonth = dayjs(event.startDate).month() + 12 * yearDifferenceFromToday
        const monthIndex = eventsByMonth.map(month => month.monthId).indexOf(eventMonth)
        if (monthIndex !== -1) {
          eventsByMonth[monthIndex].eventList.push(event)
        } else {
          eventsByMonth.push({ monthId: eventMonth, monthName: dayjs(event.startDate).format('MMMM' + (yearDifferenceFromToday ? ' YYYY' : '')), eventList: [event] })
        }
      })
      return eventsByMonth
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')
    this.loadDiaryEvents()
  },
  methods: {
    refresh () {
      this.fromDate = dayjs()
      this.loadDiaryEvents()
      this.$emit('refresh')
    },
    loadDiaryEvents () {
      this.isLoading = true
      getEvents(this.fromDate, diaryEventModalPaginationSize, this.unReadOnly).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.error = false
          this.eventList = data.events
          this.fromDate = dayjs(data.events[data.events.lenght - 1].startDate) // Assume they are sorted by date, so take the last event date
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
.period {
  text-transform: capitalize;
  font-size: 0.875em;
  margin-top: 4px;
}
</style>

<i18n locale="fr">
{
  "title": "Liste des événements",
  "errorPlaceholder": "Oups, une erreur est survenue..."
}
</i18n>
