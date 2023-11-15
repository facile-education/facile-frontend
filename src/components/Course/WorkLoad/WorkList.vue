<template>
  <ul class="work-list">
    <li
      v-for="(day, index) in displayedDays"
      :key="index"
      class="day-works"
    >
      <WorkDay
        :date="getDayDate(day)"
        :work-list="workList"
        :display-day-label="displayWeek"
      />
    </li>
  </ul>
</template>

<script>
import WorkDay from '@components/Course/WorkLoad/WorkDay.vue'

export default {
  name: 'WorkList',
  components: { WorkDay },
  inject: ['mq'],
  props: {
    workList: {
      type: Array,
      required: true
    },
    selectedDate: {
      type: Object,
      required: true
    },
    schoolDays: {
      type: Array,
      required: true
    }
  },
  computed: {
    displayWeek () {
      return !this.mq.phone
    },
    displayedDays () {
      return this.displayWeek ? this.schoolDays : [this.selectedDate.day()]
    }
  },
  methods: {
    getDayDate (day) {
      return this.selectedDate.day(day)
    }
  }
}
</script>

<style lang="scss" scoped>
.work-list {
  display: flex;
  gap: 0.5rem;
  min-height: 20vh;
}

.day-works {
  flex: 1;
}

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
</style>
