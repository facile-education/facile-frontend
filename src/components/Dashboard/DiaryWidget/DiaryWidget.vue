<template>
  <section>
    <DiaryHeader
      :nb-new-events="nbNewEvents"
      :un-read-only="unReadOnly"
      @updateUnreadOnly="updateUnreadOnlyValue"
      @createEvent="refresh"
    />
    <PentilaSpinner
      v-if="isLoading"
      style="z-index: 1"
    />
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
          v-for="event in month.eventList"
          :key="event.eventId"
          :event="event"
          @markAsRead="event.hasRead=true"
          @updateEvent="refresh"
          @deleteEvent="refresh"
        />
      </div>

      <div class="footer">
        <button
          v-t="'showMore'"
          class="show-more"
          @click="showMore"
        />
      </div>
    </div>
  </section>
</template>

<script>
import DiaryHeader from '@components/Dashboard/DiaryWidget/DiaryHeader.vue'
import DiaryEventItem from '@components/Dashboard/DiaryWidget/DiaryEventItem.vue'
import { nbDiaryEventInWidget } from '@/constants/dashboardConstants'
import { getEvents } from '@/api/dashboard/agenda.service'
import dayjs from 'dayjs'

export default {
  name: 'DiaryWidget',
  components: { DiaryHeader, DiaryEventItem },
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
    updateUnreadOnlyValue (value) {
      this.unReadOnly = value
      this.refresh()
    },
    refresh () {
      this.loadDiaryEvents()
    },
    loadDiaryEvents () {
      this.isLoading = true
      getEvents(0, nbDiaryEventInWidget, this.unReadOnly).then((data) => {
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
    },
    showMore () {
      this.$router.push({ name: 'AllEvents' })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

section {
  width: min(355px, 100vw);
  position: relative;
  @extend %widget;
}

.placeholder {
  height: 106px;
}

.period {
  text-transform: capitalize;
  font-size: 0.875em;
  margin-top: 4px;
}

.footer {
  @extend %widget-footer;
}
</style>

<i18n locale="fr">
{
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "emptyPlaceholder": "Aucun événement à venir",
  "showMore": "Voir tous les événements"
}
</i18n>
