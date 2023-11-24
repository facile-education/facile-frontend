<template>
  <section
    data-test="diary-widget"
  >
    <DiaryHeader
      :nb-new-events="nbNewEvents"
      :un-read-only="unReadOnly"
      @update-unread-only="updateUnreadOnlyValue"
      @create-event="refresh"
    />
    <WeprodeSpinner
      v-if="isLoading"
      style="z-index: 1"
    />
    <div
      v-if="error === true"
      v-t="'errorPlaceholder'"
      class="placeholder"
    />
    <div
      v-else-if="eventList.length === 0 && !isFirstLoad"
      v-t="unReadOnly ? 'unReadEmptyPlaceholder' : 'emptyPlaceholder'"
      class="placeholder"
    />
    <div v-else>
      <div class="events-by-month">
        <div
          v-for="(month, index) in eventsByMonth"
          :key="index"
        >
          <div class="period">
            {{ month.monthName }}
          </div>
          <DiaryEventItem
            v-for="myEvent in month.eventList"
            :key="myEvent.eventId"
            :event="myEvent"
            @mark-as-read="markAsRead(myEvent)"
            @update-event="refresh"
            @delete-event="refresh"
            @refresh="refresh"
          />
        </div>
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
import DiaryEventItem from '@components/Dashboard/DiaryWidget/DiaryEventItem.vue'
import DiaryHeader from '@components/Dashboard/DiaryWidget/DiaryHeader.vue'
import dayjs from 'dayjs'

import { getEvents } from '@/api/dashboard/agenda.service'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import { nbDiaryEventInWidget } from '@/constants/dashboardConstants'

export default {
  name: 'DiaryWidget',
  components: { DiaryHeader, DiaryEventItem, WeprodeSpinner },
  data () {
    return {
      unReadOnly: false,
      eventList: [],
      nbNewEvents: 0,
      isLoading: false,
      isFirstLoad: true,
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
      getEvents(dayjs(), 0, nbDiaryEventInWidget, this.unReadOnly).then((data) => {
        this.isLoading = false
        this.isFirstLoad = false
        if (data.success) {
          this.error = false
          this.eventList = data.events
          this.nbNewEvents = data.nbUnreadEvents
        } else {
          this.error = true
          console.error('Error')
        }
      }, (err) => {
        this.isLoading = false
        this.error = true
        console.error(err)
      })
    },
    showMore () {
      this.$router.push({ name: 'AllEvents' })
    },
    markAsRead (event) {
      event.hasRead = true
      this.nbNewEvents--
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

section {
  min-width: min($diary-widget-min-width, 100%);
  width: 100%;
  position: relative;
  @extend %widget;
}

.placeholder {
  @extend %widget-placeholder;
}

@media screen and (min-width: calc($diary-widget-min-width + $announcements-widget-min-width + 3rem + $side-menu-width)) {
  .events-by-month {
    height: $announcement-item-min-height;
    overflow-y: auto;
  }
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
  "unReadEmptyPlaceholder": "Aucun nouvel événement",
  "showMore": "Voir tous les événements"
}
</i18n>
