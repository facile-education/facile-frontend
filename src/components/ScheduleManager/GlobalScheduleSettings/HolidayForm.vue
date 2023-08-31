<template>
  <div class="holiday-form">
    <div class="name">
      <PentilaInput
        v-model="name"
        :placeholder="$t('namePlaceHolder') + '*'"
      />
      <PentilaErrorMessage
        :error-message="formErrorList.name"
      />
    </div>

    <div class="dates">
      <DateRangePicker
        :initial-range="{start: startDate, end: endDate}"
        :min-date="minDate.toDate()"
        :max-date="maxDate.toDate()"
        @updateDates="updateDates"
      />
      <PentilaErrorMessage
        :error-message="formErrorList.startDate || formErrorList.endDate"
      />
    </div>

    <div class="buttons">
      <PentilaButton
        v-t="'submit'"
        @click="submit"
      />
      <PentilaButton
        v-t="'cancel'"
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

export default {
  name: 'HolidayForm',
  components: { DateRangePicker },
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
          ? this.$t('required')
          : '',
        startDate: (this.v$.startDate.$invalid && this.v$.startDate.$dirty)
          ? this.$t('required')
          : '',
        endDate: (this.v$.endDate.$invalid && this.v$.endDate.$dirty)
          ? (this.v$.endDate.$errors[0].$validator === 'required' ? this.$t('required') : this.$t('afterStartDate'))
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
          startDate: this.startDate.format('YYYY-MM-DD'),
          endDate: this.endDate.format('YYYY-MM-DD')
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

<i18n locale="fr">
{
  "namePlaceHolder": "Nom",
  "submit": "Créer",
  "cancel": "Annuler",
  "required": "Champ requis",
  "afterStartDate": "Cette date doit se situer après la date de début"
}
</i18n>
