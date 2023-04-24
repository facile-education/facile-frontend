<template>
  <section>
    <ScheduleHeader
      :current-date="currentDate"
      @goBefore="goBefore"
      @goAfter="goAfter"
    />

    <div
      v-for="session in sessions"
      :key="session.sessionId"
      class="session"
    >
      <div
        v-if="isTeacher"
        class="session-infos"
        :class="{'pointer': (session.sessionUrl != undefined)}"
        title="session.title"
        @click="redirectToUrl(session.sessionUrl)"
      >
        <p class="start-session">
          {{ getHour(session.startDate) }} - {{ getHour(session.endDate) }}
        </p>

        <!-- group name OR subject -->
        <p
          v-if="isTeacher"
          class="session-subject nero-text theme-color"
        >
          {{ session.groupName }}
        </p>
        <p
          v-else
          class="session-subject"
        >
          {{ getSubject(session) }}
        </p>

        <!-- title OR teachers -->
        <p
          v-if="isTeacher"
          class="subject"
        >
          {{ session.subject }}
        </p>
        <p
          v-else
          class="teacher-name"
        >
          {{ session.teachers }}
        </p>
        <p class="room-number">
          {{ $t('room') }}:{{ session.room }}
        </p>
        <div
          v-if="session.isCancelled"
          class="cancelled-session"
        >
          <i class="icon-cancelled-session" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import { getUserSchedule } from '@/api/dashboard.service'
import ScheduleHeader from '@components/Dashboard/Schedule/ScheduleHeader.vue'
export default {
  name: 'ScheduleWidget',
  components: { ScheduleHeader },
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      sessions: [],
      currentDate: dayjs()
    }
  },
  watch: {
    userId () {
      this.getUserSchedule(true)
    }
  },
  created () {
    this.getUserSchedule(true)
  },
  methods: {
    goBefore () {
      this.currentDate = this.currentDate.add(-1, 'day')
      this.getUserSchedule(false)
    },
    goAfter () {
      this.currentDate = this.currentDate.add(1, 'day')
      this.getUserSchedule(true)
    },
    getUserSchedule (goForward) {
      getUserSchedule(this.userId, this.currentDate, goForward).then(
        (data) => {
          if (data.success) {
            this.sessions = data.eventList
            this.currentDate = dayjs(data.date, 'YYYY-MM-DD HH:mm')
          }
        }
      )
    },
    redirectToUrl (targetUrl) {
      if (targetUrl !== undefined && targetUrl !== '') {
        this.$window.location.href = targetUrl
      }
    },
    getHour (sessionDate) {
      return dayjs(sessionDate, 'YYYY-MM-DD HH:mm').format('HH:mm')
    },
    getSubject (session) {
      if (session.cdtSessionId !== undefined) {
        return session.subject
      } else {
        return session.title
      }
    },
    isTeacher () {
      return this.$store.state.user.isTeacher
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

section {
  width: min(355px, 100vw);
  position: relative;
}

.placeholder {
  height: 106px;
}

.session {
  border-left: 3px solid black;
  margin-bottom: 5px;
  &:hover.pointer {
    cursor: pointer
  }
  p {
    margin: 0;
    margin-left: 3px;
    font-size: 0.7em;
  }
}

</style>

<i18n locale="fr">
{
  "room": "Salle"
}
</i18n>
