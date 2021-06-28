<template>
  <div class="non-classical-slots">
    <div class="slot-type-selection">
      <SlotTypeItem
        v-for="(slotType, index) in slotTypes"
        :key="index"
        class="slot-type"
        :slot-type="slotType"
      />
    </div>
    <div class="calendar-container">
      <Calendar
        v-if="currentSlotType"
        :current-slot-type="currentSlotType"
      />
    </div>
  </div>
</template>

<script>

import SlotTypeItem from '@/components/NotUsualSlotManager/SlotTypeItem'
import Calendar from '@/components/NotUsualSlotManager/Calendar'
import notUsualSlotConstants from '@/constants/notUsualSlots'

export default {
  name: 'NotUsualSlotManager',
  components: { Calendar, SlotTypeItem },
  data () {
    return {
      slotTypes: notUsualSlotConstants.slotTypes
    }
  },
  computed: {
    currentSlotType () {
      return this.$store.state.notUsualSlots.currentSlotType
    }
  }
}
</script>

<style scoped>
.non-classical-slots {
  width: 100%;
  height: 100%;
  font-family: "Roboto", sans-serif;
}

.slot-type-selection {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.calendar-container {
  height: 75vh;
  padding: 20px 10px 0 10px;
}

</style>
