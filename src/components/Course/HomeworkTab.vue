<template>
  <div class="main">
    TODO Remettre un devoir
    Components : tab notif + checkbox background
    <div class="toolbar">
      <h3 class="title">
        {{ $t('thisWeek') }}
        <a
          v-t="{ path: 'works', args: { count: nbHomeworks } }"
          href="#"
          @click="loadCurrentWeek()"
        />
      </h3>
    </div>
    <div
      v-if="homeworks && homeworks.length === 0"
      class="main-label"
    >
      <p>{{ $t('noHomeworks') }}</p>
    </div>
    <div
      v-else
      class="homeworks"
    >
      <template
        v-for="day in homeworksByDay"
        :key="day.dayId"
      >
        <span class="target-date">{{ day.label }}</span>
        <StudentHomework
          v-for="homework in day.homeworkList"
          :key="homework.homeworkId"
          :homework="homework"
        />
      </template>
    </div>
    <h3 class="title">
      {{ $t('nextWeek') }}
      <a
        v-t="{ path: 'works', args: { count: nbNextHomeworks } }"
        href="#"
        @click="loadNextWeek()"
      />
    </h3>
    <h3 class="title">
      {{ $t('later') }}
      <a
        v-t="{ path: 'works', args: { count: nbLaterHomeworks } }"
        href="#"
        @click="loadLaterHomeworks()"
      />
    </h3>
  </div>
</template>

<script>
import StudentHomework from '@components/Course/StudentHomework.vue'
import dayjs from 'dayjs'

import { getStudentHomeworks, getStudentUndoneCount } from '@/api/homework.service'

export default {
  name: 'HomeworkTab',
  components: { StudentHomework },
  data () {
    return {
      nbHomeworks: 0,
      nbLaterHomeworks: 0,
      nbNextHomeworks: 0
    }
  },
  computed: {
    homeworks () {
      return this.$store.state.course.homeworkList
    },
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
    },
    studentId () {
      // TODO if parent
      return this.$store.state.user.userId
    }
  },
  created () {
    this.loadCurrentWeek()

    getStudentUndoneCount(this.studentId, dayjs().format('YYYY-MM-DD HH:mm'), dayjs().day(6).format('YYYY-MM-DD HH:mm')).then((data) => {
      if (data.success) {
        this.nbHomeworks = data.nbUndoneHomeworks
      }
    })

    getStudentUndoneCount(this.studentId, dayjs().day(0).add(7, 'day').format('YYYY-MM-DD HH:mm'), dayjs().day(6).add(7, 'day').format('YYYY-MM-DD HH:mm')).then((data) => {
      if (data.success) {
        this.nbNextHomeworks = data.nbUndoneHomeworks
      }
    })

    getStudentUndoneCount(this.studentId, dayjs().day(0).add(14, 'day').format('YYYY-MM-DD HH:mm'), dayjs().day(6).add(50, 'day').format('YYYY-MM-DD HH:mm')).then((data) => {
      if (data.success) {
        this.nbLaterHomeworks = data.nbUndoneHomeworks
      }
    })
  },
  methods: {
    loadCurrentWeek () {
      this.updateHomeworkList(dayjs().startOf('day'), dayjs().day(6))
    },
    loadLaterHomeworks () {
      // TODO Max date
      this.updateHomeworkList(dayjs().day(0).add(14, 'day'), dayjs().day(6).add(50, 'day'))
    },
    loadNextWeek () {
      this.updateHomeworkList(dayjs().day(0).add(7, 'day'), dayjs().day(6).add(7, 'day'))
    },
    updateHomeworkList (minDate, maxDate) {
      getStudentHomeworks(this.$store.state.user.userId, minDate.format('YYYY-MM-DD HH:mm'), maxDate.format('YYYY-MM-DD HH:mm'), false).then((data) => {
        if (data.success) {
          this.$store.commit('course/setHomeworkList', data.homeworks)
        }
      })
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
  @extend %font-heading-xs;
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
  "later": "Plus tard :",
  "nextWeek": "La semaine prochaine :",
  "noHomeworks": "Aucun travail à faire",
  "thisWeek": "Cette semaine :",
  "works": "Aucun travail | {count} Travail | {count} Travaux"
}
</i18n>
