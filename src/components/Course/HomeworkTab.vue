<template>
  <div class="homework-tab">
    <WeekHomeworks
      :label="$t('currentWeek')"
      :nb-undone="nbCurrentWeekUndone"
      :displayed="displayedSection === 'currentWeek'"
      :params="{dates: currentWeekDates, userId: userId}"
      @display="displayedSection = 'currentWeek'"
    />
    <WeekHomeworks
      :label="$t('nextWeek')"
      :nb-undone="nbNextWeekUndone"
      :displayed="displayedSection === 'nextWeek'"
      :params="{dates: nextWeekDates, userId: userId}"
      @display="displayedSection = 'nextWeek'"
    />
    <WeekHomeworks
      v-if="schoolYearEndDate"
      :label="$t('later')"
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
        minDate: dayjs().startOf('day').format('YYYY-MM-DD HH:mm'),
        maxDate: dayjs().day(6).format('YYYY-MM-DD HH:mm')
      },
      nextWeekDates: {
        minDate: dayjs().day(0).add(7, 'day').format('YYYY-MM-DD HH:mm'),
        maxDate: dayjs().day(6).add(7, 'day').format('YYYY-MM-DD HH:mm')
      }
    }
  },
  computed: {
    schoolYearEndDate () {
      return this.$store.state.calendar.configuration ? dayjs(this.$store.state.calendar.configuration.schoolYearEndDate, 'YYYY-MM-DD') : undefined
    },
    laterDates () {
      const maxDate = this.schoolYearEndDate
      return {
        minDate: dayjs().day(0).add(14, 'day').format('YYYY-MM-DD HH:mm'),
        maxDate: maxDate ? maxDate.format('YYYY-MM-DD HH:mm') : undefined
      }
    }
  },
  created () {
    if (!this.schoolYearEndDate) {
      this.$store.dispatch('calendar/getConfiguration')
    }
    this.displayedSection = 'currentWeek'
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

<i18n locale="fr">
{
  "later": "Plus tard :",
  "nextWeek": "La semaine prochaine :",
  "currentWeek": "Cette semaine :"
}
</i18n>
