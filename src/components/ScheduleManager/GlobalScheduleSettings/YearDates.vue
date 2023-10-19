<template>
  <section>
    <h2 v-t="'schoolYear'" />
    <div class="dates">
      <div class="my-date start-date">
        <label v-t="'startDateLabel'" />
        <CustomDatePicker
          class="date-picker"
          :selected-date="startDate"
          :is-required="true"
          @selectDate="$emit('update:startDate', dayjs($event))"
        />
        <WeprodeErrorMessage
          :error-message="formErrorList.schoolYearStartDate"
        />
      </div>
      <div class="my-date semester-date">
        <label v-t="'semesterDateLabel'" />
        <CustomDatePicker
          class="date-picker"
          :selected-date="semesterDate"
          :is-required="true"
          @selectDate="$emit('update:semesterDate', dayjs($event))"
        />
        <WeprodeErrorMessage
          :error-message="formErrorList.semesterDate"
        />
      </div>
      <div class="my-date end-date">
        <label v-t="'endDateLabel'" />
        <CustomDatePicker
          class="date-picker"
          :selected-date="endDate"
          :is-required="true"
          @selectDate="$emit('update:endDate', dayjs($event))"
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

export default {
  name: 'YearDates',
  components: { CustomDatePicker },
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
          ? this.$t('required')
          : '',
        semesterDate: (this.v$.semesterDate.$invalid && this.v$.semesterDate.$dirty)
          ? (this.v$.semesterDate.$errors[0].$validator === 'required' ? this.$t('required') : this.$t('betweenStartAndEnd'))
          : '',
        endDate: (this.v$.endDate.$invalid && this.v$.endDate.$dirty)
          ? (this.v$.endDate.$errors[0].$validator === 'required' ? this.$t('required') : this.$t('afterStartDate'))
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

<i18n locale="fr">
{
  "schoolYear": "Année scolaire",
  "startDateLabel": "Début d'année scolaire",
  "semesterDateLabel": "Date de changement de semestre",
  "endDateLabel": "Fin d'année scolaire",
  "required": "Champ requis",
  "betweenStartAndEnd": "Cette date doit se situer entre le début et la fin d'année scolaire",
  "afterStartDate": "Cette date doit se situer après le début de l'année scolaire"
}
</i18n>
