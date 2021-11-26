<template>
  <div
    class="calendar-event"
    :class="{'selected': isSelected, 'assigned-to-other': isAssignedToOtherItem}"
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
      <input
        v-model="isSelected"
        type="checkbox"
        :disabled="isAssignedToOtherItem"
        label=""
      >
    </div>
  </div>
</template>

<script>

export default {
  name: 'CalendarEvent',
  components: { },
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
  computed: {
    isAssignedToOtherItem () {
      // Session is greyed if it has been affected to an other item
      // AND if current affected item is not a homework
      return this.event.extendedProps.assignedItemId !== 0 &&
        this.event.extendedProps.assignedItemId !== this.store.state.progression.assignedItem.itemId &&
        !this.store.state.progression.assignedItem.isHomework
    }
  },
  created () {
    // Session is selected if:
    // it is initially assigned to the current item OR it belongs to the assignments OR if it has been assigned
    // AND it has not been removed
    this.isSelected = (this.event.extendedProps.assignedItemId === this.store.state.progression.assignedItem.itemId ||
    this.store.state.progression.assignedItem.assignments.map(assignment => assignment.sessionId).indexOf(this.event.extendedProps.sessionId) !== -1 ||
    this.store.state.progression.addedAssignedSessions.map(session => session.sessionId).indexOf(this.event.extendedProps.sessionId) !== -1) &&
    !this.store.state.progression.removedAssignedSessions.map(session => session.sessionId).indexOf(this.event.extendedProps.sessionId) !== -1
  },
  methods: {
    toggleSelection () {
      if (this.isAssignedToOtherItem) {
        return
      }
      this.isSelected = !this.isSelected
      if (this.isSelected) {
        this.store.dispatch('progression/addAffectedSession', this.event.extendedProps)
      } else {
        this.store.dispatch('progression/removeAffectedSession', this.event.extendedProps)
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
  &.assigned-to-other {
    opacity: 50%;
  }
}
.fc-timegrid-col-events.fc-timegrid-event-harness {
  border: 2px solid transparent !important;
  .calendar-event.selected {
    border: 2px solid blue !important;
  }
}
</style>
