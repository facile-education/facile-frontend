<template>
  <div class="main">
    <div
      class="daily-schedule"
    >
      <p>daily schedule</p>
    </div>
    <!-- <DailySchedule
      class="daily-schedule"
    /> -->
    <div class="session-infos">
      <div class="top">
        <SessionContent
          class="session-content"
        />
        <div class="given-homeworks" />
      </div>
      <div class="notes" />
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

import SessionContent from '@/components/Course/SessionContent.vue'

export default {
  name: 'ScheduleTab',
  components: {
    SessionContent
  },
  inject: ['mq'],
  data () {
    return {
      pan: 0,
      selectedDate: dayjs(),
      selectedEvent: undefined,
      updatedSession: undefined
    }
  },
  computed: {
    configuration () {
      return this.$store.state.horaires.configuration
    },
    isConfigurationLoaded () {
      return this.$store.state.horaires.configuration.isLoaded
    },
    eventList () {
      return this.$store.state.course.sessionList
    },
    isLoading () {
      return this.$store.state.horaires.isLoading || !this.configuration.isLoaded
    }
  },
  created () {
    if (!this.isConfigurationLoaded) {
      this.$store.dispatch('horaires/getConfiguration').then((res) => {
        this.$store.dispatch('course/getSessionList')
      })
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

  .main {
    display: flex;
  }
  .daily-schedule {
    width: 20%;
    height: 800px;
    border: 1px solid black;
    margin: 10px;
  }
  .session-infos {
    width: 80%;
    height: 800px;
    display: flex;
    flex-direction: column;
    border: 1px solid black;
    margin: 10px;
  }
  .session-content {
    border: 1px black;
  }
  .given-homeworks {
    border: 1px black;
  }
  .notes {
    border: 1px black;
  }
</style>

<i18n locale="fr">
{
  "action": "Editer"
}
</i18n>
