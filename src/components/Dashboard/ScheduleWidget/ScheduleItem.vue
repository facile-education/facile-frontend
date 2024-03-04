<template>
  <div
    class="schedule-item"
    @click="$emit('click')"
  >
    <div
      v-if="displayHours"
      class="hours"
    >
      <div class="hour">
        {{ formatHour(session.startDate) }}
      </div>
      <div class="hour">
        {{ formatHour(session.endDate) }}
      </div>
    </div>
    <div
      class="session"
      :style="{ backgroundColor: session.color, borderColor: session.color, width: !displayHours ? '100%' : 'calc(100% - var(--hour-width))' }"
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
          <span
            v-for="(teacher, index) in teachers"
            :key="index"
          >
            <a
              href="#"
              style="color: black;"
              class="toggle-user-card"
              @click.stop="openUserCardModal(teacher)"
            >
              {{ teacher.name }}
            </a>
            <span v-if="index < teachers.length - 1">, </span>
          </span>
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
    teachers () {
      return getTeachersLabel(this.session.teachers)
    }
  },
  methods: {
    formatHour (date) {
      return dayjs(date).format('HH:mm')
    },
    openUserCardModal (teacher) {
      this.$store.dispatch('userCard/initUserCard', teacher)
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
