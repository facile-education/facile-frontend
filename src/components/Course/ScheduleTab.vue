<template>
  <div class="schedule-tab">
    <DailySchedule
      class="daily-schedule"
    />

    <SessionInfo class="session-infos" />
  </div>
</template>

<script>
import SessionInfo from '@components/Course/SessionInfo.vue'

import DailySchedule from '@/components/Course/DailySchedule.vue'

export default {
  name: 'ScheduleTab',
  components: {
    SessionInfo,
    DailySchedule
  },
  inject: ['mq'],
  created () {
    if (!this.configuration) {
      this.$store.dispatch('calendar/getConfiguration')
    }
  }
}
</script>

<style lang="scss" scoped>
.schedule-tab {
  display: flex;
  gap: 50px;
}

.daily-schedule {
  width: 30%;
}

.session-infos {
  width: 70%;
  height: 800px;
}
</style>
