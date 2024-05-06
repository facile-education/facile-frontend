<template>
  <section>
    <h2 v-t="'ScheduleManager.YearDates.schoolYear'" />
    <div class="dates">
      <div class="my-date start-date">
        <label v-t="'ScheduleManager.YearDates.startDateLabel'" />
        <CustomDatePicker
          class="date-picker"
          :selected-date="startDate"
          :is-required="true"
          @update:selected-date="$emit('update:startDate', $event)"
        />
        <WeprodeErrorMessage
          :error-message="formErrorList.schoolYearStartDate"
        />
      </div>
      <div class="my-date semester-date">
        <label v-t="'ScheduleManager.YearDates.semesterDateLabel'" />
        <CustomDatePicker
          class="date-picker"
          :selected-date="semesterDate"
          :is-required="true"
          @update:selected-date="$emit('update:semesterDate', $event)"
        />
        <WeprodeErrorMessage
          :error-message="formErrorList.semesterDate"
        />
      </div>
      <div class="my-date end-date">
        <label v-t="'ScheduleManager.YearDates.endDateLabel'" />
        <CustomDatePicker
          class="date-picker"
          :selected-date="endDate"
          :is-required="true"
          @update:selected-date="$emit('update:endDate', $event)"
        />
        <WeprodeErrorMessage
          :error-message="formErrorList.endDate"
        />
      </div>
    </div>
  </section>
</template>

<script>
import CustomDatePicker from '@components/Base/CustomDatePicker.vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import dayjs from 'dayjs'

import WeprodeErrorMessage from '@/components/Base/Weprode/WeprodeErrorMessage.vue'

export default {
  name: 'YearDates',
  components: { CustomDatePicker, WeprodeErrorMessage },
  props: {
    startDate: {
      type: Object,
      default: dayjs()
    },
    semesterDate: {
      type: Object,
      default: dayjs()
    },
    endDate: {
      type: Object,
      default: dayjs()
    }
  },
  emits: ['update:startDate', 'update:semesterDate', 'update:endDate'],
  setup: () => ({ v$: useVuelidate() }),
  validations: {
    startDate: {
      required
    },
    semesterDate: { // Should be > startDate and < endDate
      required,
      function (value) {
        return (value.diff(this.startDate) >= 0) && (value.diff(this.endDate) <= 0)
      }
    },
    endDate: { // Should be > startDate
      required,
      function (value) {
        return value.diff(this.startDate) >= 0
      }
    }
  },
  computed: {
    dayjs () {
      return dayjs
    },
    formErrorList () {
      return {
        startDate: (this.v$.startDate.$invalid && this.v$.startDate.$dirty)
          ? this.$t('ScheduleManager.YearDates.required')
          : '',
        semesterDate: (this.v$.semesterDate.$invalid && this.v$.semesterDate.$dirty)
          ? (this.v$.semesterDate.$errors[0].$validator === 'required' ? this.$t('ScheduleManager.YearDates.required') : this.$t('ScheduleManager.YearDates.betweenStartAndEnd'))
          : '',
        endDate: (this.v$.endDate.$invalid && this.v$.endDate.$dirty)
          ? (this.v$.endDate.$errors[0].$validator === 'required' ? this.$t('ScheduleManager.YearDates.required') : this.$t('ScheduleManager.YearDates.afterStartDate'))
          : ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.my-date {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.date-picker {
  margin-left: 1rem;
}

@media screen and (min-width: 700px) {
  .dates {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .my-date {
    flex-direction: column;
  }

  .date-picker {
    margin-left: 0;
  }
}

</style>
