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
    <UserCompletion
      user-type="student"
      :placeholder="$t('NotUsualSlots.studentNamePlaceHolder')"
      @selectUser="getUserSlots"
    />
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

import notUsualSlotConstants from '@/constants/notUsualSlots'
import moment from 'moment'
import SlotTypeItem from '@/components/NotUsualSlotManager/SlotTypeItem'
import Calendar from '@/components/NotUsualSlotManager/Calendar'
import UserCompletion from '@/components/NotUsualSlotManager/UserCompletion'
import SelectedSchool from '@/components/NotUsualSlotManager/SelectedSchool'
import UnauthenticatedPage from '@/router/views/UnauthenticatedPage'

export default {
  name: 'NotUsualSlotManager',
  components: { UnauthenticatedPage, SelectedSchool, UserCompletion, Calendar, SlotTypeItem },
  data () {
    return {
      slotTypes: notUsualSlotConstants.slotTypes,
      selectedSchool: undefined,
      minDate: undefined,
      maxDate: undefined
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

    this.minDate = moment().startOf('week') // setMinDate to week begin
    this.maxDate = moment().endOf('week') // setMxnDate to week end
  },
  methods: {
    getUserSlots (user) {
      this.$store.dispatch('getStudentSessions', { user, minDate: this.minDate, maxDate: this.maxDate }) // TODO handle non-students users
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.non-classical-slots {
  width: 100%;
  height: 100%;
  font-family: "Roboto", sans-serif;
  color: $color-cadyco-dark-text;
}

.slot-type-selection {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.calendar-container {
  height: 75vh;
  padding-top: 20px;
}

</style>
