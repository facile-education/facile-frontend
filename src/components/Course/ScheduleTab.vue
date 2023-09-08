<template>
  <div
    class="schedule-tab"
    :class="{'split-view': !mq.phone && selectedSession, 'phone': mq.phone}"
  >
    <DailySchedule
      v-show="!mq.phone || !isMobileSessionDetailsDisplayed"
      ref="schedule"
      class="daily-schedule"
    />

    <div
      class="session-details"
      :class="{'hidden': !selectedSession}"
    >
      <button
        v-if="mq.phone"
        class="back-button"
        @click="unselectSession"
      >
        <img
          src="@/assets/icons/calendar.svg"
          alt=""
        >
        <span v-t="'back'" />
      </button>

      <SessionDetails :session="selectedSession" />
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'

import DailySchedule from '@/components/Course/DailySchedule.vue'
const SessionDetails = defineAsyncComponent(() => import('@/components/Course/SessionDetails.vue'))

export default {
  name: 'ScheduleTab',
  components: {
    SessionDetails,
    DailySchedule
  },
  inject: ['mq'],
  data () {
    return {
      isMobileSessionDetailsDisplayed: false
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
    unselectSession () {
      this.$store.dispatch('course/unselectSession')
      this.$refs.schedule.unselectEvent()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.schedule-tab {
  position: relative;
  overflow: hidden;

  .session-details.hidden {
    display: none;
  }

  &.phone {
    .session-details {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      min-height: 100%;
      background-color: white;
      z-index: 1;
      transition: all 0.5s ease-in-out;

      &.hidden {
        display: unset;
        transform: translateX(100vw);
      }
    }
  }
}

.split-view {
    display: flex;
    gap: 50px;

  .daily-schedule {
    width: 30%;
    height: 800px;
  }

  .session-details {
    width: 70%;
    height: 800px;
  }
}

.back-button {
  width: 100%;
  background-color: transparent;
  cursor: pointer;
  display: flex;
  padding: 4px 8px;
  margin-bottom: 10px;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-radius: 6px;
  border: 1px solid $color-border;

  img {
    margin-right: 1rem;
  }
}

</style>

<i18n locale="fr">
{
  "back": "Revenir au semainier"
}
</i18n>
