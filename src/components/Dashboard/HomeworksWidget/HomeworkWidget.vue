<template>
  <section>
    <HomeworkHeader
      :nb-homeworks-undone="nbHomeworksUndone"
      :undone-only="undoneOnly"
      @updateUndoneOnly="updateUndoneOnlyValue"
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
      v-else-if="homeworkList.length === 0 && !isFirstLoad"
      v-t="'emptyPlaceholder'"
      class="placeholder"
    />
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
                @updateDoneStatus="updateHomeworkDoneStatus(homework, $event)"
              />
            </li>
          </ul>
        </li>
      </ul>

      <div class="footer">
        <button
          v-t="'showMore'"
          class="show-more"
          @click="$router.push({ name: 'Planning' })"
        />
      </div>
    </div>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import { getFutureStudentHomeworks } from '@/api/homework.service'
import HomeworkItem from '@components/Dashboard/HomeworksWidget/HomeworkItem.vue'
import HomeworkHeader from '@components/Dashboard/HomeworksWidget/HomeworkHeader.vue'
import { nbHomeworksInWidget } from '@/constants/dashboardConstants'
import PentilaUtils from 'pentila-utils'

export default {
  name: 'HomeworkWidget',
  components: { HomeworkHeader, HomeworkItem },
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
    homeworksToDisplay () { // return the nbHomeworksInWidget firsts homeworks
      PentilaUtils.Array.sortWithString(this.homeworkList, false, 'toDate')
      return this.homeworkList.slice(0, nbHomeworksInWidget)
    },
    homeworksByDay () {
      const homeworksByDay = []
      this.homeworksToDisplay.forEach((homework) => {
        const homeworkDay = 366 * dayjs(homework.toDate).year() + 31 * dayjs(homework.toDate).month() + dayjs(homework.toDate).date()
        const dayIndex = homeworksByDay.map(homework => homework.dayId).indexOf(homeworkDay)
        if (dayIndex !== -1) {
          homeworksByDay[dayIndex].homeworkList.push(homework)
        } else {
          homeworksByDay.push({ dayId: homeworkDay, dayName: dayjs(homework.toDate).format(this.$t('for') + ' dddd DD MMM'), homeworkList: [homework] })
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
      getFutureStudentHomeworks(this.userId, this.undoneOnly).then((data) => {
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
  height: 106px;
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

.footer {
  @extend %widget-footer;
}
</style>

<i18n locale="fr">
{
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "emptyPlaceholder": "Aucun devoir à faire!!",
  "for": "Pour",
  "showMore": "Voir tous les devoirs"
}
</i18n>
