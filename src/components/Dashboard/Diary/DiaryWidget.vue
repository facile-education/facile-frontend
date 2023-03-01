<template>
  <section>
    <DiaryHeader
      :nb-new-events="nbNewEvents"
      @createEvent="refresh"
    />
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
      v-else-if="eventList.length === 0"
      v-t="'emptyPlaceholder'"
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

      <div class="footer">
        <button
          v-if="eventList.length > 0"
          v-t="'showMore'"
          class="show-more"
          @click="isAllEventsModalDisplayed = true"
        />
      </div>
    </div>
  </section>

  <teleport
    v-if="isAllEventsModalDisplayed"
    to="body"
  >
    <DiaryAllEventsModal
      @refresh="refresh"
      @close="isAllEventsModalDisplayed = false"
    />
  </teleport>
</template>

<script>
import DiaryHeader from '@components/Dashboard/Diary/DiaryHeader.vue'
import DiaryEventItem from '@components/Dashboard/Diary/DiaryEventItem.vue'
import { nbDiaryEventInWidget } from '@/constants/dashboardConstants'
import { getEvents } from '@/api/dashboard/agenda.service'
import dayjs from 'dayjs'
import DiaryAllEventsModal from '@components/Dashboard/Diary/DiaryAllEventsModal.vue'

export default {
  name: 'DiaryWidget',
  components: { DiaryAllEventsModal, DiaryHeader, DiaryEventItem },
  data () {
    return {
      unReadOnly: false,
      eventList: [],
      nbNewEvents: 0,
      isLoading: false,
      error: false,
      isAllEventsModalDisplayed: false
    }
  },
  computed: {
    fromDate () {
      return dayjs()
    },
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
    this.loadDiaryEvents()
  },
  methods: {
    refresh () {
      this.loadDiaryEvents()
    },
    loadDiaryEvents () {
      this.isLoading = true
      getEvents(this.fromDate, nbDiaryEventInWidget, this.unReadOnly).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.error = false
          this.eventList = data.events
          this.nbNewEvents = data.nbUnreadEvents
        } else {
          this.error = true
          console.error('Error')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

section {
  width: min(355px, 100vw);
}

.period {
  text-transform: capitalize;
  font-size: 0.875em;
  margin-top: 4px;
}

.footer {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;

  button {
    margin-right: 4px;
    border: 1px solid $color-border;
    border-radius: 4px;
    height: 29px;
    cursor: pointer;
    padding: 9px 10px;
    background-color: white;
    display: flex;
    align-items: center;
  }
}
</style>

<i18n locale="fr">
{
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "emptyPlaceholder": "Aucun événement",
  "showMore": "Voir tous les événements"
}
</i18n>
