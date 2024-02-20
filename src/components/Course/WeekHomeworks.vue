<template>
  <section>
    <header>
      <h2>{{ label }}</h2>
      <a
        v-t="{ path: 'works', args: { count: nbUndone } }"
        href="#"
        class="theme-text-color"
        @click="$emit('display')"
      />
    </header>

    <div
      v-if="displayed"
      class="content"
    >
      <WeprodeSpinner
        v-if="isLoading"
        style="z-index: 1"
      />
      <div
        v-if="error === true"
        v-t="'Course.WeekHomeworks.errorPlaceholder'"
        class="placeholder"
      />
      <div
        v-else-if="homeworks && homeworks.length === 0"
        v-t="'Course.WeekHomeworks.emptyPlaceholder'"
        class="placeholder"
      />
      <ul
        v-else-if="homeworks && homeworks.length > 0"
        class="homeworks-by-day-list"
      >
        <li
          v-for="day in homeworksByDay"
          :key="day.dayId"
          class="homeworks-day"
        >
          <div class="day-label">
            {{ day.label }}
          </div>
          <ul>
            <li
              v-for="homework in day.homeworkList"
              :key="homework.homeworkId"
            >
              <StudentHomework
                :homework="homework"
                :can-update-status="canUpdateStatus"
                @change-done-status="changeDoneStatus(homework, $event)"
              />
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import StudentHomework from '@components/Course/StudentHomework.vue'
import dayjs from 'dayjs'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants'
import { getStudentHomeworks, getStudentUndoneCount } from '@/api/homework.service'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'

export default {
  name: 'WeekHomeworks',
  components: { StudentHomework, WeprodeSpinner },
  props: {
    label: {
      type: String,
      required: true
    },
    displayed: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      required: true
    }
  },
  emits: ['display'],
  data () {
    return {
      homeworks: undefined,
      nbUndone: 0,
      isLoading: false,
      error: false
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.user
    },
    canUpdateStatus () {
      return this.currentUser.userId === this.currentUserId
    },
    sortedHomeworks () {
      if (this.homeworks) {
        return [...this.homeworks].sort((homeworkA, homeworkB) => {
          return (dayjs(homeworkA.toDate, DATE_EXCHANGE_FORMAT).isAfter(dayjs(homeworkB.toDate, DATE_EXCHANGE_FORMAT))) ? 1 : -1
        })
      } else {
        return undefined
      }
    },
    homeworksByDay () {
      const homeworksByDay = []
      this.sortedHomeworks.forEach((homework) => {
        const homeworkDay = 366 * dayjs(homework.toDate).year() + 31 * dayjs(homework.toDate).month() + dayjs(homework.toDate).date()
        const dayIndex = homeworksByDay.map(homework => homework.dayId).indexOf(homeworkDay)

        if (dayIndex !== -1) {
          homeworksByDay[dayIndex].homeworkList.push(homework)
        } else {
          homeworksByDay.push({ dayId: homeworkDay, label: dayjs(homework.toDate).format(this.$t('Course.WeekHomeworks.for') + ' dddd DD MMM'), homeworkList: [homework] })
        }
      })

      return homeworksByDay
    },
    currentUserId () {
      return this.params.userId
    }
  },
  watch: {
    displayed: {
      immediate: true,
      handler () {
        if (this.displayed && this.homeworks === undefined) {
          this.getHomeworkList()
        }
      }
    },
    currentUserId () {
      this.getNbUndone()
      if (this.displayed) {
        this.getHomeworkList()
      }
    }
  },
  created () {
    this.getNbUndone()
  },
  methods: {
    getNbUndone () {
      getStudentUndoneCount(
        this.params.userId,
        this.params.dates.minDate.format(DATE_EXCHANGE_FORMAT),
        this.params.dates.maxDate.format(DATE_EXCHANGE_FORMAT)
      ).then((data) => {
        if (data.success) {
          this.nbUndone = data.nbUndoneHomeworks
        }
      })
    },
    getHomeworkList () {
      this.isLoading = true
      getStudentHomeworks(
        this.params.userId,
        this.params.dates.minDate.format(DATE_EXCHANGE_FORMAT),
        this.params.dates.maxDate.format(DATE_EXCHANGE_FORMAT),
        false
      ).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.error = false
          this.homeworks = data.homeworks
        } else {
          this.error = true
          console.error('Failed to load homeworks')
        }
      }, (err) => {
        this.isLoading = false
        this.error = true
        console.error(err)
      })
    },
    changeDoneStatus (homework, isDone) {
      homework.isDone = isDone
      isDone ? this.nbUndone-- : this.nbUndone++
      // TODO: Only change value without call a WS
      this.$store.dispatch('course/getStudentUndoneCount', this.params.userId) // For the tab notification pellet
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

header {
  height: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  align-self: stretch;

  h2 {
    margin: 0;
    @extend %font-heading-xs;
  }

  a {
    @extend %font-heading-xs;
  }
}

.content {
  position: relative;
  min-height: 56px;
}

.placeholder {
  @extend %content-placeholder;
}

.homeworks-by-day-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  align-self: stretch;
}

.homeworks-day {
  margin-top: 2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  ul {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
}

.day-label {
  padding: 1rem 0 0.5rem 0;
  border-top: 1px solid $neutral-80;
  text-transform: uppercase;

  @extend %font-heading-xs;
}

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
</style>
