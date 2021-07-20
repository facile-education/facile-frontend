<template>
  <div
    class="slot-type-item"
    :style="'background-color: ' + slotType.color + ';'"
    @click="itemClicked"
  >
    {{ slotType.label }}
    <div
      v-if="isSelected"
      class="is-selected"
    />
  </div>
</template>

<script>
export default {
  name: 'SlotTypeItem',
  props: {
    slotType: {
      type: Object,
      required: true
    }
  },
  computed: {
    currentSlotType () {
      return this.$store.state.notUsualSlots.currentSlotType
    },
    isSelected () {
      return this.currentSlotType && this.slotType.type === this.currentSlotType.type
    }
  },
  methods: {
    itemClicked () {
      if (this.$device.phone && this.currentSlotType) {
        this.$store.dispatch('notUsualSlots/setCurrentSlotType', undefined) // Unselect slotType to go back in menu
      } else {
        this.$store.dispatch('notUsualSlots/setCurrentSlotType', this.slotType)
      }
    }
  }
}
</script>

<style scoped>

.slot-type-item{
  position: relative;
  margin: 10px 0;
  width: 165px;
  height: 49px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1em;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 24px;
}

.is-selected {
  position: absolute;
  left: 0;
  bottom: -10px;
  width: 100%;
  height: 2px;
  background-color: inherit;
  border-radius: 1px;
}
</style>
