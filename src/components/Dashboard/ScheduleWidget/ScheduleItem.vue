<template>
  <div
    class="schedule-item"
    @click="$emit('click')"
  >
    <div class="hours" v-if="displayHours">
      <div class="hour">
        {{ formatHour(session.startDate) }}
      </div>
      <div class="hour">
        {{ formatHour(session.endDate) }}
      </div>
    </div>
    <div
      class="session"
      :style="'background-color: ' + session.color + '; border-color: ' + session.color"
    >
      <div class="transparent-part">
        <!-- Teacher: course, room and subject -->
        <!-- Student and parent: subject, room and teachers -->
        <strong
          v-if="isTeacher"
        > {{ sessionTitle }}
        </strong>
        <strong
          v-else
        > {{ session.subject }}
        </strong>

        <div class="metadata room">
          {{ session.room }}
        </div>

        <div
          v-if="isTeacher"
          class="metadata subject"
        >
          {{ session.subject }}
        </div>
        <div
          v-else
          class="metadata teacher"
        >
          {{ teacherLabel }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTeachersLabel } from '@utils/commons.util'
import dayjs from 'dayjs'

export default {
  name: 'ScheduleItem',
  props: {
    session: {
      type: Object,
      required: true
    },
    displayHours: {
      type: Boolean,
      default: true
    }
  },
  emits: ['click'],
  computed: {
    isTeacher () {
      return this.$store.state.user.isTeacher
    },
    sessionTitle () {
      return this.session.sessionId !== undefined ? this.session.groupName : this.session.title
    },
    teacherLabel () {
      return getTeachersLabel(this.session.teachers)
    }
  },
  methods: {
    formatHour (date) {
      return dayjs(date).format('HH:mm')
    }
  }
}
</script>

<style lang="scss" scoped>

.schedule-item {
  display: flex;
  height: 70px;
  width: 100%;
  --hour-width: 40px
}

.hours {
  height: 100%;
  width: var(--hour-width);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .hour {
    font-size: 0.8rem;
  }
}

.session {
  height: 100%;
  width: calc(100% - var(--hour-width));
  border-left: 5px solid;
  border-radius: 3px;
  font-size: 0.8rem;
}

.transparent-part {
  height: 100%;
  width: 100%;
  background-color: #FFFFFFDD;
  padding: 0.2rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

strong, .metadata {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

</style>

<i18n locale="fr">
{
  "room": "Salle: "
}
</i18n>
