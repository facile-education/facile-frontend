<template>
  <Widget>
    <template #header>
      <span class="widget-header">
        <BaseIcon
          class="header-icon"
          name="newspaper"
        />
        {{ $t('edt') }}
      </span>
    </template>

    <template #default>
      <div class="arrows">
        <div
          class="arrow"
          @click="goBefore"
        >
          <img
            src="@assets/arrow-left.svg"
            :alt="$t('goBefore')"
            :title="$t('goBefore')"
          >
        </div>
        <span>{{ formatCurrentDate(currentDate) }}</span>
        <div
          class="arrow"
          @click="goAfter"
        >
          <img
            src="@assets/arrow-right.svg"
            :alt="$t('goAfter')"
            :title="$t('goAfter')"
          >
        </div>
      </div>

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
    </template>
  </Widget>
</template>

<script>
import dayjs from 'dayjs'
import { getUserSchedule } from '@/api/dashboard.service'
import Widget from '@components/Dashboard/Widget'
import BaseIcon from '@components/Base/BaseIcon'
export default {
  name: 'EDTWidget',
  components: { BaseIcon, Widget },
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
    formatDate (date) {
      return date.format('YYYY-MM-DD HH:mm')
    },
    formatCurrentDate (date) {
      return date.format('ddd DD MMM YY')
    },
    goBefore () {
      this.currentDate = this.currentDate.add(-1, 'day')
      this.getUserSchedule(false)
    },
    goAfter () {
      this.currentDate = this.currentDate.add(1, 'day')
      this.getUserSchedule(true)
    },
    getUserSchedule (goForward) {
      // TODO : manage parents watching their child's schedule
      getUserSchedule(this.userId, this.formatDate(this.currentDate), goForward).then(
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
    isPassed (session) {
      return dayjs(session.endDate, 'YYYY-MM-DD HH:mm').isBefore(dayjs())
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

  .arrows {
    display: flex;
    justify-content: space-evenly;
    .arrow {
      width: 30px;
      height: 30px;
    }
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
  "edt": "EDT",
  "goBefore": "Jour précédent",
  "goAfter": "Jour suivant",
  "room": "Salle"
}
</i18n>
