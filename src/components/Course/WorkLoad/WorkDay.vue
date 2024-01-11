<template>
  <div class="day-works">
    <div
      v-if="displayDayLabel"
      class="day-label"
      :class="{'theme-text-color': isToday}"
    >
      {{ dayLabel }}
    </div>
    <div
      v-if="dayWorks.length === 0"
      v-t="'emptyPlaceholder'"
      class="empty-placeholder"
    />
    <ul v-else>
      <li
        v-for="work in dayWorks"
        :key="work.homeworkId"
      >
        <WorkItem :work="work" />
      </li>
    </ul>
  </div>
</template>

<script>
import WorkItem from '@components/Course/WorkLoad/WorkItem.vue'
import dayjs from 'dayjs'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants'

export default {
  name: 'WorkDay',
  components: { WorkItem },
  props: {
    date: {
      type: Object,
      required: true
    },
    workList: {
      type: Array,
      required: true
    },
    displayDayLabel: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    isToday () {
      return this.date.isSame(dayjs(), 'day')
    },
    dayLabel () {
      return this.date.format('ddd DD/MM')
    },
    dayWorks () {
      return this.workList.filter(work => {
        const workDate = dayjs(work.toDate, DATE_EXCHANGE_FORMAT)
        return workDate.isAfter(this.date.startOf('day')) && workDate.isBefore(this.date.endOf('day'))
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.day-works {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.day-label {
  text-align: center;
  font-weight: bold;
}

.empty-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  @extend %content-placeholder;
}

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem
}
</style>

<i18n locale="fr">
{
  "emptyPlaceholder": "Aucun travail"
}
</i18n>
