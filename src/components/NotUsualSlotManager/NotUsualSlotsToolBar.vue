<template>
  <div class="toolbar">
    <div class="first-line">
      <SlotTypeItem
        v-if="currentSlotType !== undefined"
        :slot-type="currentSlotType"
      />
      <DatepickerNav
        v-if="!mq.desktop"
        class="date-picker"
        :selected-date="selectedDate"
        @select-date="onSelectDate"
      />
    </div>
    <div class="second-line">
      <UserCompletion
        v-if="currentSlotType"
        user-type="student"
        data-test="user-completion-input"
        :placeholder="$t('NotUsualSlots.studentNamePlaceHolder')"
        :model-value="queriedUser ? [queriedUser] : []"
        @update:model-value="getUserSlots"
      />
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { defineAsyncComponent } from 'vue'
const UserCompletion = defineAsyncComponent(() => import('@components/NotUsualSlotManager/UserCompletion'))
const DatepickerNav = defineAsyncComponent(() => import('@components/Horaires/DatepickerNav'))
const SlotTypeItem = defineAsyncComponent(() => import('@components/NotUsualSlotManager/SlotTypeItem'))

export default {
  name: 'NotUsualSlotsToolBar',
  components: { UserCompletion, DatepickerNav, SlotTypeItem },
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
    getUserSlots (value) {
      this.$store.dispatch('notUsualSlots/setQueriedUser', value[0])
    }
  }
}
</script>

<style lang="scss" scoped>
.toolbar {
  width: 100%;
  margin-bottom: 1rem;
}

.first-line {
  display: flex;
  align-items: center;
}
</style>
