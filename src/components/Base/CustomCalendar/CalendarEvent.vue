<template>
  <div
    class="calendar-event"
    :data-cy="event.event.extendedProps.cy"
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
      :title="event.event.extendedProps.teachers"
    >
      {{ event.event.extendedProps.teachers }}
    </div>
    <div class="fc-event-room">
      {{ event.event.extendedProps.room }}
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
    formattedStartHour () {
      return dayjs(this.event.event.start).format('HH:mm')
    },
    formattedEndHour () {
      return dayjs(this.event.event.end).format('HH:mm')
    }
  }
}
</script>

<style lang="scss" scoped>
.calendar-event {
  font-size: 0.85rem;
  line-height: 1.1rem;
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
