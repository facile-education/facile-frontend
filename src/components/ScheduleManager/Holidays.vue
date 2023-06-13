<template>
  <section>
    <h2 v-t="'holidays'" />

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

    <PentilaButton
      v-if="!isFormDisplayed"
      v-t="'addHoliday'"
      class="add-button"
      @click="isFormDisplayed = true"
    />
    <HolidayForm
      v-if="isFormDisplayed"
      class="holiday-form"
      @addHoliday="addHoliday"
      @cancel="isFormDisplayed = false"
    />
  </section>
</template>

<script>
import HolidayItem from '@components/ScheduleManager/HolidayItem.vue'
import HolidayForm from '@components/ScheduleManager/HolidayForm.vue'

export default {
  name: 'Holidays',
  components: { HolidayForm, HolidayItem },
  props: {
    holidays: {
      type: Array,
      required: true
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
ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.add-button, .holiday-form {
  margin-top: 1rem;
}

</style>

<i18n locale="fr">
{
  "holidays": "Vacances",
  "addHoliday": "Ajouter des vacances"
}
</i18n>
