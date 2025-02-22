<template>
  <div class="holiday-form">
    <div class="name">
      <WeprodeInput
        v-model="name"
        :placeholder="$t('ScheduleManager.HolidayForm.namePlaceHolder') + '*'"
      />
      <WeprodeErrorMessage
        :error-message="formErrorList.name"
      />
    </div>

    <div class="dates">
      <DateRangePicker
        :initial-range="{start: startDate, end: endDate}"
        :min-date="minDate.toDate()"
        :max-date="maxDate.toDate()"
        @update-dates="updateDates"
      />
      <WeprodeErrorMessage
        :error-message="formErrorList.startDate || formErrorList.endDate"
      />
    </div>

    <div class="buttons">
      <WeprodeButton
        v-t="'ScheduleManager.HolidayForm.submit'"
        @click="submit"
      />
      <WeprodeButton
        v-t="'ScheduleManager.HolidayForm.cancel'"
        @click="$emit('cancel')"
      />
    </div>
  </div>
</template>

<script>
import DateRangePicker from '@components/Base/DateRangePicker.vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import dayjs from 'dayjs'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants'
import WeprodeErrorMessage from '@/components/Base/Weprode/WeprodeErrorMessage.vue'
import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'

export default {
  name: 'HolidayForm',
  components: { DateRangePicker, WeprodeErrorMessage, WeprodeInput },
  props: {
    minDate: {
      type: Object,
      default: undefined
    },
    maxDate: {
      type: Object,
      default: undefined
    }
  },
  emits: ['addHoliday', 'cancel'],
  setup: () => ({ v$: useVuelidate() }),
  data () {
    return {
      name: undefined,
      startDate: dayjs(),
      endDate: dayjs()
    }
  },
  validations: {
    name: {
      required
    },
    startDate: {
      required
    },
    endDate: { // Should be > startDate
      required,
      function (value) {
        return value.diff(this.startDate) >= 0
      }
    }
  },
  computed: {
    formErrorList () {
      return {
        name: (this.v$.name.$invalid && this.v$.name.$dirty)
          ? this.$t('ScheduleManager.HolidayForm.required')
          : '',
        startDate: (this.v$.startDate.$invalid && this.v$.startDate.$dirty)
          ? this.$t('ScheduleManager.HolidayForm.required')
          : '',
        endDate: (this.v$.endDate.$invalid && this.v$.endDate.$dirty)
          ? (this.v$.endDate.$errors[0].$validator === 'required' ? this.$t('ScheduleManager.HolidayForm.required') : this.$t('ScheduleManager.HolidayForm.afterStartDate'))
          : ''
      }
    }
  },
  methods: {
    updateDates (range) {
      this.startDate = dayjs(range.start)
      this.endDate = dayjs(range.end)
    },
    submit () {
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else {
        this.$emit('addHoliday', {
          name: this.name,
          startDate: this.startDate.format(DATE_EXCHANGE_FORMAT),
          endDate: this.endDate.format(DATE_EXCHANGE_FORMAT)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.holiday-form {
  width: 100%;
  flex-direction: column;
  display: flex;
  gap: 1rem;
}

.name {
  flex: 1;
}

.buttons{
  display: flex;
  align-items: center;
  gap: 10px
}

@media screen and (min-width: 700px) {
  .holiday-form {
    flex-direction: initial;
    align-items: center;
  }
}

</style>
