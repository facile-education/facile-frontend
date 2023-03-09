<template>
  <Layout>
    <AllDiaryEventsHeader
      :nb-new-events="nbNewEvents"
      :un-read-only="unReadOnly"
      @toggleReadOnly="toggleReadOnly"
      @createEvent="refresh"
    />

    <div
      class="body"
      :class="{'details-display' : isDetailsPanelDisplayed}"
    >
      <div class="event-list">
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
              :is-selection-mode="isDetailsPanelDisplayed"
              :is-selected="selectedEvent && selectedEvent.eventId === event.eventId"
              :is-last="isLastDisplayed(event)"
              @select="selectedEvent=event"
              @markAsRead="event.hasRead=true"
              @updateEvent="updateList"
              @deleteEvent="updateList"
              @getNextEvents="loadDiaryEvents"
            />
          </div>
        </div>
      </div>

      <DiaryEventDetails
        v-if="selectedEvent && isDetailsPanelDisplayed"
        :init-event="selectedEvent"
        @update="refresh"
        @delete="deleteEvent"
      />
      <div
        v-if="!selectedEvent && isDetailsPanelDisplayed"
        v-t="'detailsPlaceholder'"
        class="details-placeholder"
      />
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
import DiaryEventDetails from '@components/Dashboard/Diary/DiaryEventDetails.vue'
let oldScrollTop = 0

export default {
  name: 'AllDiaryEvents',
  components: { DiaryEventDetails, AllDiaryEventsHeader, DiaryEventItem, Layout },
  inject: ['mq'],
  data () {
    return {
      unReadOnly: false,
      isLoading: false,
      nbNewEvents: 0,
      error: undefined,
      eventList: [],
      fromDate: dayjs(),
      selectedEvent: undefined
    }
  },
  computed: {
    isDetailsPanelDisplayed () {
      return !(this.mq.phone || this.mq.tablet)
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
    this.$store.dispatch('misc/incrementModalCount')
    this.loadDiaryEvents()
  },
  mounted () {
    window.addEventListener('keydown', this.keyMonitor)
  },
  beforeUnmount () {
    window.removeEventListener('keydown', this.keyMonitor)
  },
  methods: {
    isLastDisplayed (event) {
      return this.eventList[this.eventList.length - 1].eventId === event.eventId // Assume display order is the same as eventListOrder
    },
    toggleReadOnly () {
      this.unReadOnly = !this.unReadOnly
      if (this.unReadOnly) { // Unselect selected event when we enter in unreadOnly mode (assume that the selected event is read and should not be selected anymore)
        this.selectedEvent = undefined
      }
      this.refresh()
    },
    updateList () {
      this.refresh()
    },
    deleteEvent () {
      this.selectedEvent = undefined
      this.refresh()
    },
    refresh () {
      // Reset pagination
      this.fromDate = dayjs()
      this.eventList = []
      this.loadDiaryEvents()
    },
    loadDiaryEvents () {
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

          // Handle selection
          if (this.isDetailsPanelDisplayed && this.selectedEvent === undefined && this.eventList.length > 0 && !this.unReadOnly) {
            this.selectedEvent = this.eventList[0]
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
    },
    keyMonitor (event) {
      if (this.isDetailsPanelDisplayed && this.eventList.length > 0) {
        if (event.key === 'ArrowDown') {
          this.selectNextItem()
        } else if (event.key === 'ArrowUp') {
          this.selectPreviousItem()
        }
      }
    },
    selectNextItem () {
      if (this.selectedEvent === undefined) {
        this.selectedEvent = this.eventList[0]
      } else if (this.eventList.map(event => event.eventId).indexOf(this.selectedEvent.eventId) === this.eventList.length - 1) { // The last event
        // Do nothing
      } else {
        const currentIndex = this.eventList.map(event => event.eventId).indexOf(this.selectedEvent.eventId)
        this.selectedEvent = this.eventList[currentIndex + 1]
      }
    },
    selectPreviousItem () {
      if (this.selectedEvent === undefined) {
        this.selectedEvent = this.eventList[this.eventList.length - 1]
      } else if (this.eventList.map(event => event.eventId).indexOf(this.selectedEvent.eventId) === 0) { // The first event
        // Do nothing
      } else {
        const currentIndex = this.eventList.map(event => event.eventId).indexOf(this.selectedEvent.eventId)
        this.selectedEvent = this.eventList[currentIndex + -1]
      }
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

.body.details-display{
  display: flex;
  padding-top: 20px;

  .event-list {
    width: 33%;
    margin-right: 20px;
  }

  .details-placeholder {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20vh;
    font-size: 1.25em;
  }
}
</style>

<i18n locale="fr">
{
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "detailsPlaceholder": "Veuillez séléctionner un événement"
}
</i18n>
