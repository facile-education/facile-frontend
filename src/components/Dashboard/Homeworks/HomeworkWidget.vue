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
      v-else-if="homeworkList.length === 0"
      v-t="'emptyPlaceholder'"
      class="placeholder"
    />
    <ul
      v-else
      class="homeworks-by-day"
    >
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
              @updateDoneStatus="homework.isDone = $event"
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
  </section>
</template>

<script>
import dayjs from 'dayjs'
import { getHomeworks } from '@/api/dashboard/homeworks.service'
import HomeworkItem from '@components/Dashboard/Homeworks/HomeworkItem.vue'
import HomeworkHeader from '@components/Dashboard/Homeworks/HomeworkHeader.vue'
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
      isLoading: false,
      error: false,
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
      getHomeworks(this.userId, dayjs().format('YYYY-MM-DD HH:mm'), this.undoneOnly).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.error = false
          this.homeworkList = data.homeworks
          // TODO this.nbHomeworksUndone = data.nbHomeworksUndone
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
@import "@design";

section {
  width: min(355px, 100vw);
  position: relative;
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
