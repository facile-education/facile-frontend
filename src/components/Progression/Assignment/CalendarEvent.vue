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
      return this.event.extendedProps.assignedItemId !== 0 &&
        this.event.extendedProps.assignedItemId !== this.store.state.progression.affectedItem.itemId
    }
  },
  created () {
    this.isSelected = this.event.extendedProps.assignedItemId === this.store.state.progression.affectedItem.itemId
  },
  methods: {
    toggleSelection () {
      if (this.isAssignedToOtherItem) {
        return
      }
      this.isSelected = !this.isSelected
      if (this.isSelected) {
        console.log('adding session ', this.event.extendedProps)
        this.store.dispatch('progression/addSelectedSession', this.event.extendedProps)
      } else {
        console.log('removing session ', this.event.extendedProps)
        this.store.dispatch('progression/removeSelectedSession', this.event.extendedProps)
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
  &.assigned-to-other {
    opacity: 50%;
  }
}
</style>
