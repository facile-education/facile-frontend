<template>
  <section>
    <header>
      <h2 v-t="'ScheduleManager.Holidays.holidays'" />
      <InformationIcon
        class="info"
        :text="$t('ScheduleManager.Holidays.holidaysInfos')"
      />
    </header>

    <ul class="holiday-list">
      <li
        v-for="holiday in holidays"
        :key="holiday.name"
      >
        <HolidayItem
          :holiday="holiday"
          @delete="deleteHoliday(holiday)"
        />
      </li>
    </ul>

    <WeprodeButton
      v-if="!isFormDisplayed"
      v-t="'ScheduleManager.Holidays.addHoliday'"
      class="add-button"
      @click="isFormDisplayed = true"
    />
    <HolidayForm
      v-if="isFormDisplayed"
      class="holiday-form"
      :min-date="(schoolYearStartDate && schoolYearStartDate!==schoolYearEndDate) ? schoolYearStartDate : undefined"
      :max-date="(schoolYearEndDate && schoolYearStartDate!==schoolYearEndDate) ? schoolYearEndDate : undefined"
      @add-holiday="addHoliday"
      @cancel="isFormDisplayed = false"
    />
  </section>
</template>

<script>
import InformationIcon from '@components/Base/InformationIcon.vue'
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'
import HolidayForm from '@components/ScheduleManager/GlobalScheduleSettings/HolidayForm.vue'
import HolidayItem from '@components/ScheduleManager/GlobalScheduleSettings/HolidayItem.vue'
import dayjs from 'dayjs'

export default {
  name: 'Holidays',
  components: { WeprodeButton, InformationIcon, HolidayForm, HolidayItem },
  props: {
    holidays: {
      type: Array,
      required: true
    },
    schoolYearStartDate: {
      type: Object,
      default: dayjs()
    },
    schoolYearEndDate: {
      type: Object,
      default: dayjs()
    }
  },
  emits: ['update:holidays'],
  data () {
    return {
      isFormDisplayed: false
    }
  },
  methods: {
    addHoliday (holiday) {
      const newHolidays = [...this.holidays]
      newHolidays.push(holiday)
      this.$emit('update:holidays', newHolidays)
      this.isFormDisplayed = false
    },
    deleteHoliday (holiday) {
      const newHolidays = [...this.holidays]
      const index = newHolidays.indexOf(holiday)
      if (index !== -1) {
        newHolidays.splice(index, 1)
        this.$emit('update:holidays', newHolidays)
      } else {
        console.error('Cannot remove ', holiday, 'from holidaysList: ', this.holidays)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  display: flex;
  align-items: center;

  .info {
    margin-left: 1rem;
  }
}

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.add-button, .holiday-form {
  margin-top: 1rem;
}

</style>
