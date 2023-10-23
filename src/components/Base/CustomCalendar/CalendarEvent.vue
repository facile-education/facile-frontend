<template>
  <div
    class="calendar-event"
    :data-test="cy"
  >
    <div
      class="fc-event-title"
    >
      <span>{{ event.event.title }}</span>
      <span
        v-if="appEvent.nbRegisteredStudents === undefined"
        class="room"
      >{{ appEvent.room }}
      </span>
      <span
        v-if="appEvent.capacity"
        class="capacity"
      >{{ formattedCapacity }}
      </span>
    </div>
    <div
      v-if="appEvent.teachers"
      class="fc-event-teacher"
      :title="formattedTeachersLabel"
    >
      {{ formattedTeachersLabel }}
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'CalendarEvent',
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  computed: {
    appEvent () {
      return this.event.event.extendedProps
    },
    currentUser () {
      return this.$store.state.user
    },
    formattedSlot () {
      return 'P' + this.event.event.extendedProps.slotNumber
    },
    formattedStartHour () {
      return dayjs(this.event.event.start).format('HH:mm')
    },
    formattedEndHour () {
      return dayjs(this.event.event.end).format('HH:mm')
    },
    formattedTeachersLabel () {
      let label = ''
      this.appEvent.teachers.forEach(teacher => {
        if (this.currentUser && this.currentUser.userId !== teacher.userId) {
          const name = teacher.firstName.substring(0, 1) + '. ' + teacher.lastName
          label += (label === '') ? name : ', ' + name
        }
      })
      return label
    },
    formattedCapacity () {
      return (this.appEvent.capacity - this.appEvent.nbRegisteredStudents) + '/' + this.appEvent.capacity
    },
    cy () {
      return dayjs(this.event.event.start).format('MM-DD_HH:mm')
    }
  }
}
</script>

<style lang="scss" scoped>
.calendar-event {
  font-size: 0.85rem;
  line-height: 1.1rem;
  cursor: pointer;
}

.fc-event-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 10px;
  margin-bottom : 5px;

  .capacity {
    margin-left: 5px;
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
    font-weight: normal;
    font-size: 0.75rem;
  }
  .room {
    font-weight: normal;
    font-size: 0.75rem;
  }
}

.fc-event-capacity {
  font-style: italic;
}
</style>
