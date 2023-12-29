<template>
  <div class="school-slot">
    <h3> {{ 'P' + (position + 1) }}</h3>
    <div class="time-selection">
      <span v-t="'from'" />
      <TimeSelection
        :range="{start: slot.slotStartHour, end: slot.slotEndHour}"
        @update:range="updateRange"
      />
    </div>
    <WeprodeButton
      v-t="'delete'"
      @click="$emit('delete')"
    />
  </div>
</template>

<script>
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'
import TimeSelection from '@components/NotUsualSlotManager/EditSlotModal/TimeSelection.vue'

export default {
  name: 'SchoolSlotItem',
  components: { WeprodeButton, TimeSelection },
  props: {
    slot: {
      type: Object,
      required: true
    },
    position: {
      type: Number,
      required: true
    }
  },
  emits: ['delete', 'update:slot'],
  methods: {
    updateRange (range) {
      const newSlot = { ...this.slot }
      newSlot.slotStartHour = range.start
      newSlot.slotEndHour = range.end
      this.$emit('update:slot', newSlot)
    }
  }
}
</script>

<style lang="scss" scoped>
.school-slot{
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.time-selection {
  display: flex;
  align-items: center;

  span {
    margin-right: 1rem;
  }
}
</style>

<i18n locale="fr">
{
  "from": "De",
  "delete": "Supprimer"
}
</i18n>
