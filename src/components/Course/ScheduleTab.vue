<template>
  <div
    class="schedule-tab"
    :class="{'phone': mq.phone}"
  >
    <DailySchedule
      ref="schedule"
      class="daily-schedule"
      @select-event="selectEvent"
    />

    <SessionDetails
      v-if="!mq.phone"
      :session="selectedSession"
      class="session-infos"
    />

    <PentilaWindow
      v-else-if="isSessionInfoModalDisplayed"
      class="session-infos-modal"
      :class="{'phone': mq.phone}"
      :modal="true"
      @close="closeSessionInfoModal"
    >
      <template #body>
        <SessionDetails
          class="session-infos"
          :session="selectedSession"
        />
      </template>
    </PentilaWindow>
  </div>
</template>

<script>
import SessionDetails from '@components/Course/SessionDetails.vue'

import DailySchedule from '@/components/Course/DailySchedule.vue'

export default {
  name: 'ScheduleTab',
  components: {
    SessionDetails,
    DailySchedule
  },
  inject: ['mq'],
  data () {
    return {
      isSessionInfoModalDisplayed: false
    }
  },
  computed: {
    selectedSession () {
      return this.$store.state.course.selectedSession
    }
  },
  created () {
    if (!this.configuration) {
      this.$store.dispatch('calendar/getConfiguration')
    }
  },
  methods: {
    selectEvent () {
      if (this.mq.phone) {
        this.openSessionInfoModal()
      }
    },
    unselectEvent () {
      this.$store.dispatch('course/unselectSession')
      this.$refs.schedule.unselectEvent()
    },
    openSessionInfoModal () {
      this.$store.dispatch('misc/incrementModalCount')
      this.isSessionInfoModalDisplayed = true
    },
    closeSessionInfoModal () {
      this.unselectEvent()
      this.$store.dispatch('misc/decreaseModalCount')
      this.isSessionInfoModalDisplayed = false
    }
  }
}
</script>

<style lang="scss">
.session-infos-modal .window-body {
    overflow: auto;
}
</style>

<style lang="scss" scoped>

.schedule-tab:not(.phone) {
    display: flex;
    gap: 50px;

  .daily-schedule {
    width: 30%;
    height: 800px;
  }

  .session-infos {
    width: 70%;
    height: 800px;
  }
}

</style>
