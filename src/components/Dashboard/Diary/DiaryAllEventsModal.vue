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
      <button
        class="read-only-button"
        @click="toggleReadOnly"
      >
        <img
          :src="unReadOnly ? require('@/assets/options/icon_unread_filter_active.svg') : require('@/assets/options/icon_unread_filter.svg')"
          alt="unread filter"
        >
      </button>
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
            @updateEvent="updateList"
            @deleteEvent="updateList"
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
    toggleReadOnly () {
      this.unReadOnly = !this.unReadOnly
      this.refresh()
    },
    updateList () {
      this.refresh()
      this.$emit('refresh') // So the widget can update too
    },
    refresh () {
      this.fromDate = dayjs()
      this.loadDiaryEvents()
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
.read-only-button {
  height: 15px;
  width: 15px;
  padding: 0;
  background-color: white;
  border: none;
  cursor: pointer;
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

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
