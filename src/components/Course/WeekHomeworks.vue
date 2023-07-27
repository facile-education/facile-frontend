<template>
  <section>
    <div class="toolbar">
      <h2 class="title">
        {{ label }}
        <a
          v-t="{ path: 'works', args: { count: nbUndone } }"
          href="#"
          class="theme-text-color"
          @click="$emit('display')"
        />
      </h2>
    </div>
    <div
      v-if="displayed"
      class="homework-list"
    >
      <div
        v-if="homeworks && homeworks.length === 0"
        class="main-label"
      >
        <p>{{ $t('noHomeworks') }}</p>
      </div>
      <div
        v-else-if="homeworks"
        class="homeworks"
      >
        <div
          v-for="day in homeworksByDay"
          :key="day.dayId"
        >
          <span class="target-date">{{ day.label }}</span>
          <StudentHomework
            v-for="homework in day.homeworkList"
            :key="homework.homeworkId"
            :homework="homework"
            @change-done-status="changeDoneStatus(homework, $event)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import StudentHomework from '@components/Course/StudentHomework.vue'
import dayjs from 'dayjs'

import { getStudentHomeworks, getStudentUndoneCount } from '@/api/homework.service'

export default {
  name: 'WeekHomeworks',
  components: { StudentHomework },
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
      nbUndone: 0
    }
  },
  computed: {
    homeworksByDay () {
      const homeworksByDay = []
      this.homeworks.forEach((homework) => {
        const homeworkDay = 366 * dayjs(homework.toDate).year() + 31 * dayjs(homework.toDate).month() + dayjs(homework.toDate).date()
        const dayIndex = homeworksByDay.map(homework => homework.dayId).indexOf(homeworkDay)

        if (dayIndex !== -1) {
          homeworksByDay[dayIndex].homeworkList.push(homework)
        } else {
          homeworksByDay.push({ dayId: homeworkDay, label: dayjs(homework.toDate).format(this.$t('for') + ' dddd DD MMM'), homeworkList: [homework] })
        }
      })

      return homeworksByDay
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
    }
  },
  created () {
    this.getNbUndone()
  },
  methods: {
    getNbUndone () {
      getStudentUndoneCount(this.params.userId, this.params.dates.minDate, this.params.dates.maxDate).then((data) => {
        if (data.success) {
          this.nbUndone = data.nbUndoneHomeworks
        }
      })
    },
    getHomeworkList () {
      getStudentHomeworks(this.params.userId, this.params.dates.minDate, this.params.dates.maxDate, false).then((data) => {
        if (data.success) {
          this.homeworks = data.homeworks
          // TODO: handle errors
        }
      })
    },
    changeDoneStatus (homework, isDone) {
      homework.isDone = isDone
      isDone ? this.nbUndone-- : this.nbUndone++
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.main-label {
  text-align: center;
  padding: 1rem;

  border-radius: 6px;
  background: $neutral-20;

  @extend %font-regular-l;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  align-self: stretch;
}

.title {
  display: flex;
  align-items: center;
  gap: 8px;
  @extend %font-heading-xs;

  a {
    @extend %font-regular-s;
  }
}

.homeworks {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  align-self: stretch;
}

.target-date {
  margin-top: 0.5rem;
  color: $neutral-80;

  @extend %font-medium-m;
}
</style>

<i18n locale="fr">
{
  "for": "Pour ",
  "noHomeworks": "Aucun travail à faire",
  "works": "Aucun nouveau travail | {count} Travail | {count} Travaux"
}
</i18n>
