<template>
  <div
    :data-test="'slot-type-item-' + slotType.type"
    class="slot-type-item"
    :class="{'toolbar-display' : $device.phone && currentSlotType}"
    :style="'background-color: ' + slotType.color + ';'"
    @click="itemClicked"
  >
    {{ slotType.label }}
    <div
      v-if="isSelected && !($device.phone && currentSlotType)"
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

<style lang="scss" scoped>

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

  &.toolbar-display {
    width: 100%;
    margin: 10px;
    height: 33px;
  }
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
