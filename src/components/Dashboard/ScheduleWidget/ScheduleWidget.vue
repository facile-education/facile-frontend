<template>
  <section>
    <ScheduleHeader
      v-if="currentDisplayedDate"
      :current-date="currentDisplayedDate"
      @goBefore="goBefore"
      @goAfter="goAfter"
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
      v-else-if="sessionList.length === 0"
      v-t="'emptyPlaceholder'"
      class="placeholder"
    />
    <ol
      v-else
      class="session-list"
    >
      <li
        v-for="session in sessionList"
        :key="session.sessionId"
      >
        <ScheduleItem :session="session" />
      </li>
    </ol>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import { getUserSchedule } from '@/api/dashboard.service'
import ScheduleHeader from '@components/Dashboard/ScheduleWidget/ScheduleHeader.vue'
import ScheduleItem from '@components/Dashboard/ScheduleWidget/ScheduleItem.vue'
export default {
  name: 'ScheduleWidget',
  components: { ScheduleItem, ScheduleHeader },
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
      error: false,
      currentDisplayedDate: undefined,
      sessionList: []
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
    goBefore () {
      this.getUserSchedule(this.currentDisplayedDate.add(-1, 'day'), false)
    },
    goAfter () {
      this.getUserSchedule(this.currentDisplayedDate.add(1, 'day'), this.goForward)
    },
    getUserSchedule (date, goForward) {
      this.isLoading = true
      getUserSchedule(this.userId, date, goForward).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.error = false
          this.sessionList = data.eventList
          this.currentDisplayedDate = dayjs(data.date, 'YYYY-MM-DD HH:mm')
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
@import '@design';

section {
  min-width: min($schedule-widget-min-width, 100%);
  width: 100%;
  position: relative;
  @extend %widget;
}

.placeholder {
  height: 106px;
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
