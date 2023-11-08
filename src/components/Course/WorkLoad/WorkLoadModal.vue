<template>
  <WeprodeWindow
    :modal="true"
    :full-screen="mq.phone || mq.tablet"
    :max-width="1000"
    data-test="workLoadModal"
    :hidden-footer="true"
    @close="$emit('close')"
  >
    <template #header>
      <span>{{ $t('WorkLoadFor') + (!isWholeClass ? $tc('nbSelectedStudents', selectedStudents.length) : '') + courseName }}</span>
    </template>

    <template #body>
      <DayNavigation
        v-if="mq.phone"
        :selected-date="selectedDate"
        @go-previous="goBefore"
        @go-after="goAfter"
        @select-date="selectDate"
      />
      <Timeline
        v-else
        :initial-date="selectedDate"
        @select-week="onSelectWeek"
      />

      <div class="work-list">
        <div
          v-if="isLoading"
          class="placeholder"
        >
          <WeprodeSpinner style="z-index: 1" />
        </div>
        <div
          v-if="error === true"
          v-t="'errorPlaceholder'"
          class="placeholder"
        />
        <WorkList
          v-else-if="workList"
          :work-list="workList"
          :selected-date="selectedDate"
          :school-days="schoolDays"
        />
      </div>
    </template>
  </WeprodeWindow>
</template>

<script>
import WeprodeSpinner from '@components/Base/Weprode/WeprodeSpinner.vue'
import WeprodeWindow from '@components/Base/Weprode/WeprodeWindow.vue'
import DayNavigation from '@components/Dashboard/ScheduleWidget/DayNavigation.vue'
import dayjs from 'dayjs'
import { defineAsyncComponent } from 'vue'

import { getWorkLoad } from '@/api/homework.service'
const Timeline = defineAsyncComponent(() => import('@components/Horaires/Timeline.vue'))
const WorkList = defineAsyncComponent(() => import('@components/Course/WorkLoad/WorkList.vue'))

export default {
  name: 'WorkLoadModal',
  components: { WorkList, DayNavigation, Timeline, WeprodeWindow, WeprodeSpinner },
  inject: ['mq'],
  props: {
    courseId: {
      type: Number,
      required: true
    },
    courseName: {
      type: String,
      required: true
    },
    selectedStudents: {
      type: Array,
      default: () => { return [] }
    },
    homeworkDate: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  data () {
    return {
      workList: undefined,
      error: false,
      isLoading: false,
      selectedDate: undefined
    }
  },
  computed: {
    configuration () {
      return this.$store.state.calendar.configuration // TODO: do not display service until configuration is loaded
    },
    schoolDays () {
      return this.configuration.schoolDays
    },
    isWholeClass () {
      return this.selectedStudents.length === 0
    },
    intervalToDisplay () {
      const intervalToDisplay = {}
      if (this.mq.phone) {
        intervalToDisplay.startDate = this.selectedDate.startOf('day')
        intervalToDisplay.endDate = this.selectedDate.endOf('day')
      } else {
        intervalToDisplay.startDate = this.selectedDate.startOf('week')
        intervalToDisplay.endDate = this.selectedDate.endOf('week')
      }
      return intervalToDisplay
    }
  },
  created () {
    this.selectDate(this.homeworkDate)
  },
  methods: {
    selectDate (dayjsDate) {
      this.selectedDate = dayjsDate
      this.getWorkLoad()
    },
    getWorkLoad () {
      const courseId = this.isWholeClass ? this.courseId : 0
      this.isLoading = true
      getWorkLoad(courseId, this.selectedStudents, this.intervalToDisplay.startDate, this.intervalToDisplay.endDate).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.error = false
          this.workList = data.homeworks
        } else {
          this.error = true
          console.error('Error')
        }
      },
      (err) => {
        this.isLoading = false
        this.error = err
        console.error(err)
      })
    },
    goBefore () {
      const minDate = dayjs(this.configuration.schoolYearStartDate, 'YYYY-MM-DD')
      let dateToGo = this.selectedDate.add(-1, 'day')

      while ((!this.isInSchoolDays(dateToGo) || this.isInHolidays(dateToGo)) && dateToGo.isAfter(minDate)) { // Skip Weekend and holidays
        dateToGo = dateToGo.add(-1, 'day')
      }

      this.selectDate(dateToGo)
    },
    goAfter () {
      const maxDate = dayjs(this.configuration.schoolYearEndDate, 'YYYY-MM-DD')
      let dateToGo = this.selectedDate.add(1, 'day')

      while ((!this.isInSchoolDays(dateToGo) || this.isInHolidays(dateToGo)) && dateToGo.isBefore(maxDate)) { // Skip Weekend and holidays
        dateToGo = dateToGo.add(1, 'day')
      }

      this.selectDate(dateToGo)
    },
    onSelectWeek (week) {
      this.selectDate(dayjs(week.firstDayOfWeek))
    },
    isInSchoolDays (date) {
      return this.schoolDays.includes(date.day())
    },
    isInHolidays (date) {
      for (const holiday of this.configuration.holidays) {
        const holidayStartDate = dayjs(holiday.startDate, 'YYYY-MM-DD')
        const holidayEndDate = dayjs(holiday.endDate, 'YYYY-MM-DD')

        if (date.isAfter(holidayStartDate) && date.isBefore(holidayEndDate)) {
          return true
        }
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.work-list {
  position: relative;
  margin-top: 1rem;
}

.placeholder {
  @extend %widget-placeholder;
}
</style>

<i18n locale="fr">
{
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "nbSelectedStudents": "aucun élève de | {count} élève de | {count} élèves de ",
  "WorkLoadFor": "Charge de travail de "
}
</i18n>
