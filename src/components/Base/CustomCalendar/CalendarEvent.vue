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
      v-if="event.event.extendedProps.teachers"
      class="fc-event-teacher"
      :title="formattedTeachersLabel"
    >
      {{ formattedTeachersLabel }}
    </div>
    <div class="fc-event-room">
      {{ event.event.extendedProps.room }}
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getTeachersLabel } from '@utils/commons.util'

export default {
  name: 'CalendarEvent',
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  computed: {
    formattedStartHour () {
      return dayjs(this.event.event.start).format('HH:mm')
    },
    formattedEndHour () {
      return dayjs(this.event.event.end).format('HH:mm')
    },
    formattedTeachersLabel () {
      return getTeachersLabel(this.event.event.extendedProps.teachers)
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
</style>
