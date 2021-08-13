<template>
  <NeroToolbar>
    <div class="toolbar">
      <div class="first-line">
        <SlotTypeItem
          v-if="currentSlotType !== undefined"
          :slot-type="currentSlotType"
        />
        <DatepickerNav
          v-if="mq.phone"
          class="date-picker"
          :selected-date="selectedDate"
          @selectDate="onSelectDate"
        />
      </div>
      <div class="second-line">
        <UserCompletion
          v-if="currentSlotType"
          user-type="student"
          :placeholder="$t('NotUsualSlots.studentNamePlaceHolder')"
          :initial-user-list="queriedUser ? [queriedUser] : []"
          @selectUser="getUserSlots"
        />
      </div>
    </div>
  </NeroToolbar>
</template>

<script>
import SlotTypeItem from '@components/NotUsualSlotManager/SlotTypeItem'
import DatepickerNav from '@components/Horaires/DatepickerNav'
import dayjs from 'dayjs'
import UserCompletion from '@components/NotUsualSlotManager/UserCompletion'
import NeroToolbar from '@components/Nero/NeroToolbar'
export default {
  name: 'NotUsualSlotsToolBar',
  components: { NeroToolbar, UserCompletion, DatepickerNav, SlotTypeItem },
  inject: ['mq'],
  props: {
    selectedDate: {
      type: Object,
      default: dayjs()
    }
  },
  emits: ['selectDate'],
  computed: {
    currentSlotType () {
      return this.$store.state.notUsualSlots.currentSlotType
    },
    queriedUser () {
      return this.$store.state.notUsualSlots.queriedUser
    }
  },
  methods: {
    onSelectDate (date) {
      this.$emit('selectDate', date)
    },
    getUserSlots (user) {
      this.$store.dispatch('notUsualSlots/setQueriedUser', user)
    }
  }
}
</script>

<style lang="scss" scoped>
.toolbar {
  width: 100%;
}

.first-line {
  display: flex;
  align-items: center;
}
</style>
