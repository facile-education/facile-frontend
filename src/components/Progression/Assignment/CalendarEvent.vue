<template>
  <div
    class="calendar-event"
    :class="{'selected': isSelected}"
    @click="toggleSelection"
  >
    <div
      class="labels"
    >
      <div
        class="event-title"
        :data-cy="event.extendedProps.cy"
      >
        {{ event.title }}
      </div>
      <div
        v-if="event.extendedProps.teachers"
        class="event-teacher"
        :title="event.extendedProps.teachers"
      >
        {{ event.extendedProps.teachers }}
      </div>
      <div class="event-room">
        {{ event.extendedProps.room }}
      </div>
    </div>
    <div
      class="check"
    >
      <PentilaCheckbox
        :value="isSelected"
        label=""
      />
    </div>
  </div>
</template>

<script>
import PentilaCheckbox from 'pentila-components'

export default {
  name: 'CalendarEvent',
  components: { PentilaCheckbox },
  props: {
    event: {
      type: Object,
      required: true
    },
    store: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isSelected: false
    }
  },
  created () {
    console.log('event', this.store)
    this.store.dispatch('progression/resetSelectedSessions')
  },
  methods: {
    toggleSelection () {
      this.isSelected = !this.isSelected
      if (this.isSelected) {
        this.$store.dispatch('progression/addSelectedSession', this.event.sessionId)
      } else {
        this.$store.dispatch('progression/removeSelectedSession', this.event.sessionId)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.calendar-event {
  border: 2px solid transparent;
  display: flex;
  justify-content: space-between;
  &.selected {
    border: 2px solid blue;
  }
}
</style>
