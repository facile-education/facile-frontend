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
    <img
      v-if="showSelectionIcon && isSelected"
      class="selected-icon"
      src="@assets/icons/check2.svg"
      alt="selected icon"
    >
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
    },
    selectedEvent: {
      type: Object,
      default: () => {}
    },
    showSelectionIcon: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isSelected () {
      return this.selectedEvent ? this.selectedEvent.event.extendedProps.sessionId === this.event.event.extendedProps.sessionId : false
    },
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
  height: 100%;
  padding: 6px min(1rem, 1vw);
  font-size: 0.85rem;
  line-height: 1.1rem;
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.fc-event-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;

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

.selected-icon {
  position: absolute;
  bottom: 8px;
  right: 8px;
}
</style>
