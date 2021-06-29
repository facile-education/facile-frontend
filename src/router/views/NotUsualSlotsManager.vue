<template>
  <div
    v-if="currentUser.userId !== 0 && currentUser.schoolList.length !== 0"
    class="non-classical-slots"
  >
    <SelectedSchool />
    <div class="slot-type-selection">
      <SlotTypeItem
        v-for="(slotType, index) in slotTypes"
        :key="index"
        class="slot-type"
        :slot-type="slotType"
      />
    </div>
    <UserCompletion user-type="student" />
    <div class="calendar-container">
      <Calendar
        v-if="currentSlotType"
        :current-slot-type="currentSlotType"
      />
    </div>
  </div>
  <UnauthenticatedPage v-else />
</template>

<script>

import SlotTypeItem from '@/components/NotUsualSlotManager/SlotTypeItem'
import Calendar from '@/components/NotUsualSlotManager/Calendar'
import notUsualSlotConstants from '@/constants/notUsualSlots'
import UserCompletion from '@/components/NotUsualSlotManager/UserCompletion'
import SelectedSchool from '@/components/NotUsualSlotManager/SelectedSchool'
import UnauthenticatedPage from '@/router/views/UnauthenticatedPage'

export default {
  name: 'NotUsualSlotManager',
  components: { UnauthenticatedPage, SelectedSchool, UserCompletion, Calendar, SlotTypeItem },
  data () {
    return {
      slotTypes: notUsualSlotConstants.slotTypes,
      selectedSchool: undefined
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.user
    },
    currentSlotType () {
      return this.$store.state.notUsualSlots.currentSlotType
    }
  },
  created () {
    this.$store.dispatch('user/initUserInformations')
    this.$store.dispatch('user/getPersonalDetails')
  }
}
</script>

<style scoped>
.non-classical-slots {
  width: 100%;
  height: 100%;
  font-family: "Roboto", sans-serif;
  padding: 0 20px;
}

.slot-type-selection {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.calendar-container {
  height: 75vh;
  padding: 20px 10px 0 10px;
}

</style>
