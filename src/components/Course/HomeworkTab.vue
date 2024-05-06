<template>
  <div class="homework-tab">
    <WeekHomeworks
      :label="$t('Course.HomeworkTab.currentWeek')"
      :nb-undone="nbCurrentWeekUndone"
      :displayed="displayedSection === 'currentWeek'"
      :params="{dates: currentWeekDates, userId: userId}"
      @display="displayedSection = 'currentWeek'"
    />
    <WeekHomeworks
      :label="$t('Course.HomeworkTab.nextWeek')"
      :nb-undone="nbNextWeekUndone"
      :displayed="displayedSection === 'nextWeek'"
      :params="{dates: nextWeekDates, userId: userId}"
      @display="displayedSection = 'nextWeek'"
    />
    <WeekHomeworks
      v-if="schoolYearEndDate"
      :label="$t('Course.HomeworkTab.later')"
      :nb-undone="nbLaterUndone"
      :displayed="displayedSection === 'later'"
      :params="{dates: laterDates, userId: userId}"
      @display="displayedSection = 'later'"
    />
  </div>
</template>

<script>
import WeekHomeworks from '@components/Course/WeekHomeworks.vue'
import dayjs from 'dayjs'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants'

export default {
  name: 'HomeworkTab',
  components: { WeekHomeworks },
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      displayedSection: undefined,
      nbCurrentWeekUndone: 0,
      nbNextWeekUndone: 0,
      nbLaterUndone: 0,
      currentWeekDates: {
        minDate: dayjs().startOf('day'),
        maxDate: dayjs().day(6)
      },
      nextWeekDates: {
        minDate: dayjs().day(0).add(7, 'day'),
        maxDate: dayjs().day(6).add(7, 'day')
      }
    }
  },
  computed: {
    schoolYearEndDate () {
      return this.$store.state.calendar.configuration ? dayjs(this.$store.state.calendar.configuration.schoolYearEndDate, DATE_EXCHANGE_FORMAT) : undefined
    },
    laterDates () {
      const maxDate = this.schoolYearEndDate
      return {
        minDate: dayjs().day(0).add(14, 'day'),
        maxDate
      }
    }
  },
  created () {
    if (!this.schoolYearEndDate) {
      this.$store.dispatch('calendar/getConfiguration')
    }

    if (this.$route.query.homeworkId) {
      const homeworkDate = dayjs(this.$route.query.toDate, 'YYYY-MM-DD')

      if (homeworkDate.isBefore(this.nextWeekDates.minDate)) {
        this.displayedSection = 'currentWeek'
      } else if (homeworkDate.isBefore(this.laterDates.minDate)) {
        this.displayedSection = 'nextWeek'
      } else {
        this.displayedSection = 'later'
      }
    } else {
      this.displayedSection = 'currentWeek'
    }
  }
}
</script>

<style lang="scss" scoped>

.homework-tab {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

</style>
