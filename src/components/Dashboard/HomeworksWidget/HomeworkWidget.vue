<template>
  <section
    data-test="homeWork-widget"
  >
    <HomeworkHeader
      :nb-homeworks-undone="nbHomeworksUndone"
      :undone-only="undoneOnly"
      @update-undone-only="updateUndoneOnlyValue"
    />
    <WeprodeSpinner
      v-if="isLoading"
      style="z-index: 1"
    />
    <div
      v-if="error === true"
      v-t="'Dashboard.HomeworkWidget.errorPlaceholder'"
      class="placeholder"
    />
    <div
      v-else-if="homeworkList.length === 0 && !isFirstLoad"
      class="placeholder"
    >
      {{ $t('Dashboard.HomeworkWidget.emptyPlaceholder') }}
    </div>
    <div v-else>
      <ul class="homeworks-by-day">
        <li
          v-for="day in homeworksByDay"
          :key="day.dayId"
        >
          <div class="period">
            {{ day.dayName }}
          </div>

          <ul class="homework-list">
            <li
              v-for="homework in day.homeworkList"
              :key="homework.homeworkId"
            >
              <HomeworkItem
                :homework="homework"
                :can-update-status="canUpdateStatus"
                @update-done-status="updateHomeworkDoneStatus(homework, $event)"
              />
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import HomeworkHeader from '@components/Dashboard/HomeworksWidget/HomeworkHeader.vue'
import HomeworkItem from '@components/Dashboard/HomeworksWidget/HomeworkItem.vue'
import WeprodeUtils from '@utils/weprode.utils'
import dayjs from 'dayjs'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants'
import { getStudentHomeworks } from '@/api/homework.service'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import { nbHomeworksInWidget } from '@/constants/dashboardConstants'

export default {
  name: 'HomeworkWidget',
  components: { HomeworkHeader, HomeworkItem, WeprodeSpinner },
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      error: false,
      isLoading: false,
      isFirstLoad: true,
      undoneOnly: false,
      homeworkList: [],
      nbHomeworksUndone: 0
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.user
    },
    canUpdateStatus () {
      return this.currentUser.userId === this.userId
    },
    homeworksToDisplay () { // return the nbHomeworksInWidget firsts homeworks
      const homeworksToDisplay = WeprodeUtils.sortArrayWithString(this.homeworkList, false, 'toDate')
      return homeworksToDisplay.slice(0, nbHomeworksInWidget)
    },
    homeworksByDay () {
      const homeworksByDay = []
      this.homeworksToDisplay.forEach((homework) => {
        const homeworkDay = 366 * dayjs(homework.toDate).year() + 31 * dayjs(homework.toDate).month() + dayjs(homework.toDate).date()
        const dayIndex = homeworksByDay.map(homework => homework.dayId).indexOf(homeworkDay)
        if (dayIndex !== -1) {
          homeworksByDay[dayIndex].homeworkList.push(homework)
        } else {
          homeworksByDay.push({ dayId: homeworkDay, dayName: dayjs(homework.toDate).format(this.$t('Dashboard.HomeworkWidget.for') + ' dddd DD MMM'), homeworkList: [homework] })
        }
      })
      return homeworksByDay
    }
  },
  watch: {
    userId () {
      this.getHomeworks()
    }
  },
  created () {
    this.getHomeworks()
  },
  methods: {
    updateUndoneOnlyValue (value) {
      this.undoneOnly = value
      this.getHomeworks()
    },
    getHomeworks () {
      this.isLoading = true
      getStudentHomeworks(this.userId, dayjs().format(DATE_EXCHANGE_FORMAT), dayjs().add(1, 'year').format(DATE_EXCHANGE_FORMAT), this.undoneOnly).then((data) => {
        this.isLoading = false
        this.isFirstLoad = false
        if (data.success) {
          this.error = false
          this.homeworkList = data.homeworks
          this.nbHomeworksUndone = data.nbUndoneHomeworks
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
    updateHomeworkDoneStatus (homework, isDone) {
      if (homework.isDone !== isDone) {
        homework.isDone = isDone
        this.nbHomeworksUndone += (isDone ? -1 : 1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

section {
  min-width: min($homework-widget-min-width, 100%);
  width: 100%;
  position: relative;
  @extend %widget;
}

.placeholder {
  @extend %content-placeholder;
}

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;

  li:not(:last-child) {
    margin-bottom: 5px;
  }
}

.period {
  font-size: 0.875em;
}
</style>
