<template>
  <div
    class="calendar-event"
    :data-cy="cy"
  >
    <div
      class="fc-event-title"
    >
      <span>{{ event.event.title }}</span>
      <span class="hours"> {{ formattedStartHour }} - {{ formattedEndHour }}</span>
    </div>
    <div
      v-if="appEvent.teachers"
      class="fc-event-teacher"
      :title="formattedTeachersLabel"
    >
      {{ formattedTeachersLabel }}
    </div>
    <div class="fc-event-capacity">
      {{ formattedRoomAndPlacesLabel }}
    </div>
    <div
      v-if="appEvent.nbRegisteredStudents === undefined"
      class="fc-event-room"
    >
      {{ appEvent.room }}
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

import i18n from '@/i18n'

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
    formattedStartHour () {
      return dayjs(this.event.event.start).format('HH:mm')
    },
    formattedEndHour () {
      return dayjs(this.event.event.end).format('HH:mm')
    },
    formattedTeachersLabel () {
      let label = ''
      this.appEvent.teachers.forEach(teacher => {
        const name = teacher.firstName.substring(0, 1) + '. ' + teacher.lastName
        label += (label === '') ? name : ', ' + name
      })
      return label
    },
    formattedRoomAndPlacesLabel () {
      return this.appEvent.capacity !== undefined ? (i18n.global.t('NotUsualSlots.capacity') + (this.appEvent.capacity - this.appEvent.nbRegisteredStudents) + '/' + this.appEvent.capacity) : ''
    },
    cy () {
      return dayjs(this.event.event.start, 'YYYY-MM-DD HH:mm').format('MM-DD_HH:mm')
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
  align-items: center;

  .hours {
    margin-left: 5px;
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
    font-weight: normal;
    font-size: 0.75rem;
  }
}

.fc-event-capacity {
  font-style: italic;
}
</style>
