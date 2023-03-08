<template>
  <Layout>
    <AllDiaryEventsHeader
      :nb-new-events="nbNewEvents"
      :un-read-only="unReadOnly"
      @toggleReadOnly="toggleReadOnly"
      @createEvent="refresh"
    />

    <div class="body">
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
        ref="scroll"
        class="events-by-month"
        @scroll="handleScroll"
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
            :is-last="isLastDisplayed(event)"
            @updateEvent="updateList"
            @deleteEvent="updateList"
            @getNextEvents="loadDiaryEvents"
          />
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/BannerLayout.vue'
import DiaryEventItem from '@components/Dashboard/Diary/DiaryEventItem.vue'
import dayjs from 'dayjs'
import { getEvents } from '@/api/dashboard/agenda.service'
import { diaryEventModalPaginationSize } from '@/constants/dashboardConstants'
import AllDiaryEventsHeader from '@components/Dashboard/Diary/AllDiaryEvents/AllDiaryEventsHeader.vue'
let oldScrollTop = 0

export default {
  name: 'AllDiaryEvents',
  components: { AllDiaryEventsHeader, DiaryEventItem, Layout },
  data () {
    return {
      unReadOnly: false,
      isLoading: false,
      nbNewEvents: 0,
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
    isLastDisplayed (event) {
      return this.eventList[this.eventList.length - 1].eventId === event.eventId // Assume display order is the same as eventListOrder
    },
    toggleReadOnly () {
      this.unReadOnly = !this.unReadOnly
      this.refresh()
    },
    updateList () {
      this.refresh()
    },
    refresh () {
      // Reset pagination
      this.fromDate = dayjs()
      this.eventList = []
      this.loadDiaryEvents()
    },
    loadDiaryEvents () {
      console.log('loadDiaryEvents from date ' + this.fromDate.format('DD/MM/YYYY HH:mm'))
      this.isLoading = true
      getEvents(this.fromDate, diaryEventModalPaginationSize, this.unReadOnly).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.error = false
          this.eventList = this.eventList.concat(data.events)
          this.nbNewEvents = data.nbUnreadEvents
          // Update pagination
          if (data.events.length > 0) {
            this.fromDate = dayjs(data.events[data.events.length - 1].startDate).add(1, 'hour') // Assume they are sorted by date, so take the last event date
          }
        } else {
          this.error = true
          console.error('Error getting events')
        }
      })
    },
    handleScroll () {
      const scroll = this.$refs.scroll
      if (scroll.scrollTop > oldScrollTop) { // if we go down
        const nbPixelsBeforeBottom = scroll.scrollHeight - (scroll.scrollTop + scroll.clientHeight)

        if (nbPixelsBeforeBottom === 0) {
          if (!this.isLoading) {
            this.loadDiaryEvents() // Get next events
          }
        }
      }
      oldScrollTop = scroll.scrollTop
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
  "errorPlaceholder": "Oups, une erreur est survenue..."
}
</i18n>
