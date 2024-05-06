<template>
  <ServicesWrapper
    :is-title-visible="false"
  >
    <AllDiaryEventsHeader
      :nb-new-events="nbNewEvents"
      :un-read-only="unReadOnly"
      @toggle-read-only="toggleReadOnly"
      @create-event="refresh"
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
          <WeprodeSpinner />
        </div>
        <div
          v-if="error === true"
          v-t="'AllDiaryEvents.errorPlaceholder'"
          class="placeholder"
        />
        <div
          v-else-if="eventList.length === 0"
          v-t="'AllDiaryEvents.emptyPlaceholder'"
          class="placeholder"
        />
        <div
          v-else
          ref="scroll"
          class="scroll"
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
              @mark-as-read="markEventAsRead(event)"
              @update-event="updateList"
              @delete-event="updateList"
              @get-next-events="loadDiaryEvents"
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
        v-t="'AllDiaryEvents.detailsPlaceholder'"
        class="details-placeholder"
      />
    </div>
  </ServicesWrapper>
</template>

<script>
import AllDiaryEventsHeader from '@components/Dashboard/DiaryWidget/AllDiaryEvents/AllDiaryEventsHeader.vue'
import DiaryEventDetails from '@components/Dashboard/DiaryWidget/DiaryEventDetails.vue'
import DiaryEventItem from '@components/Dashboard/DiaryWidget/DiaryEventItem.vue'
import dayjs from 'dayjs'

import { getEvents } from '@/api/dashboard/agenda.service'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import { allDiaryEventsPaginationSize } from '@/constants/dashboardConstants'

import ServicesWrapper from '../../components/ServicesWrapper/ServicesWrapper.vue'
let oldScrollTop = 0

export default {
  name: 'AllDiaryEvents',
  components: { DiaryEventDetails, AllDiaryEventsHeader, DiaryEventItem, WeprodeSpinner, ServicesWrapper },
  inject: ['mq'],
  emits: ['update:layout'],
  data () {
    return {
      unReadOnly: false,
      isLoading: false,
      nbNewEvents: 0,
      error: undefined,
      eventList: [],
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
  beforeCreate () {
    this.$emit('update:layout', 'BannerLayout')
  },
  created () {
    this.loadDiaryEvents()
  },
  mounted () {
    window.addEventListener('keydown', this.keyMonitor)
  },
  beforeUnmount () {
    window.removeEventListener('keydown', this.keyMonitor)
  },
  methods: {
    markEventAsRead (event) {
      event.hasRead = true
      this.nbNewEvents--
    },
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
      this.eventList = []
      this.loadDiaryEvents()
    },
    loadDiaryEvents () {
      this.isLoading = true
      getEvents(dayjs(), this.eventList.length, allDiaryEventsPaginationSize, this.unReadOnly).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.error = false
          this.eventList = this.eventList.concat(data.events)
          this.nbNewEvents = data.nbUnreadEvents

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

        if (nbPixelsBeforeBottom <= 5) {
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
        this.selectedEvent = this.eventList[currentIndex - 1]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.period {
  text-transform: capitalize;
  font-size: 0.875em;
  margin-top: 4px;
}

.body {
  height: calc(100% - $all-events-header-height);
}

.event-list {
  height: 100%;
}

.scroll {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.body.details-display{
  display: flex;
  padding-top: 20px;

  .event-list {
    width: 33%;
    position: relative;
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
