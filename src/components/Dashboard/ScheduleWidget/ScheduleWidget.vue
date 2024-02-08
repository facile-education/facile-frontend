<template>
  <section
    data-test="schedule-widget"
  >
    <ScheduleHeader
      v-if="currentDisplayedDate"
      :current-date="currentDisplayedDate"
      @redirect="redirect"
      @go-before="goBefore"
      @go-after="goAfter"
      @select-date="selectDate"
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
      v-else-if="sessionList.length === 0 && !isFirstLoad"
      v-t="'emptyPlaceholder'"
      class="placeholder"
    />
    <ol
      v-else
      class="session-list"
    >
      <li
        v-for="session in sortedSessionList"
        :key="session.sessionId"
      >
        <ScheduleItem :session="session" />
      </li>
    </ol>
  </section>
</template>

<script>
import ScheduleHeader from '@components/Dashboard/ScheduleWidget/ScheduleHeader.vue'
import ScheduleItem from '@components/Dashboard/ScheduleWidget/ScheduleItem.vue'
import dayjs from 'dayjs'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants'
import { getUserSchedule } from '@/api/dashboard.service'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import { SCHEDULE } from '@/constants/appConstants'
export default {
  name: 'ScheduleWidget',
  components: { ScheduleItem, ScheduleHeader, WeprodeSpinner },
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      goForward: true, // Option to determine if we display the next day containing course or the current date
      isLoading: false,
      isFirstLoad: true,
      error: false,
      currentDisplayedDate: undefined,
      sessionList: []
    }
  },
  computed: {
    sortedSessionList () {
      const sortedSessionList = [...this.sessionList]
      return sortedSessionList.sort((sessionA, sessionB) => {
        return (dayjs(sessionA.startDate, DATE_EXCHANGE_FORMAT).isAfter(dayjs(sessionB.startDate, DATE_EXCHANGE_FORMAT))) ? 1 : -1
      })
    }
  },
  watch: {
    userId () {
      this.getUserSchedule(dayjs(), this.goForward)
    }
  },
  created () {
    this.getUserSchedule(dayjs(), this.goForward)
  },
  methods: {
    redirect () {
      this.$router.push({ name: SCHEDULE, query: { initialDisplayDate: this.currentDisplayedDate.format('YYYY/MM/DD') } })
    },
    goBefore () {
      this.getUserSchedule(this.currentDisplayedDate.add(-1, 'day'), false)
    },
    goAfter () {
      this.getUserSchedule(this.currentDisplayedDate.add(1, 'day'), this.goForward)
    },
    selectDate (date) {
      this.getUserSchedule(date, true)
    },
    getUserSchedule (date, goForward) {
      this.isLoading = true
      getUserSchedule(this.userId, date, goForward).then((data) => {
        this.isLoading = false
        this.isFirstLoad = false
        if (data.success) {
          this.error = false
          this.sessionList = data.eventList
          this.currentDisplayedDate = dayjs(data.date, DATE_EXCHANGE_FORMAT)
        } else {
          this.error = true
          console.error('Error')
        }
      }, (err) => {
        this.isLoading = false
        this.error = true
        console.error(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

section {
  min-width: min($schedule-widget-min-width, 100%);
  width: 100%;
  position: relative;
  @extend %widget;
}

.placeholder {
  @extend %content-placeholder;
}

ol {
  margin: 0;
  padding: 0;
  list-style-type: none;

  li:not(:last-child) {
    margin-bottom: 5px;
  }
}

</style>

<i18n locale="fr">
{
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "emptyPlaceholder": "Aucun cours"
}
</i18n>
