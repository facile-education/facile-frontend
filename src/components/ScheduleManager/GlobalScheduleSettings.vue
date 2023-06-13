<template>
  <div class="global-schedule-settings">
    <h1 :aria-label="$t('serviceTitle')" />
    <PentilaSpinner
      v-if="isLoading"
      style="z-index: 1"
    />
    <div
      v-if="error === true"
      v-t="'errorPlaceholder'"
      class="placeholder"
    />
    <div v-else>
      {{ configuration }}
      <section>
        <h2 v-t="'schoolYear'" />
        <div class="dates">
          <div class="start-date">
            <div v-t="'startDateLabel'" />
            <CustomDatePicker
              :selected-date="schoolYearStartDate"
              :is-required="true"
              @selectDate="updateStartDate"
            />
            <PentilaErrorMessage
              :error-message="formErrorList.schoolYearStartDate"
            />
          </div>
          <div class="semester-date">
            <div v-t="'semesterDateLabel'" />
            <CustomDatePicker
              :selected-date="schoolYearSemesterDate"
              :is-required="true"
              @selectDate="updateSemesterDate"
            />
            <PentilaErrorMessage
              :error-message="formErrorList.semesterDate"
            />
          </div>
          <div class="end-date">
            <div v-t="'endDateLabel'" />
            <CustomDatePicker
              :selected-date="schoolYearEndDate"
              :is-required="true"
              @selectDate="updateEndDate"
            />
            <PentilaErrorMessage
              :error-message="formErrorList.endDate"
            />
          </div>
        </div>
      </section>

      <section>
        <h2 v-t="'holidays'" />
      </section>

      <section>
        <h2 v-t="'weekParity'" />
      </section>

      <PentilaButton
        v-t="'submit'"
        @click="submit"
      />
    </div>
  </div>
</template>

<script>
import { getGlobalConfiguration, saveGlobalConfiguration } from '@/api/schedule.service'
import CustomDatePicker from '@components/Base/CustomDatePicker.vue'
import dayjs from 'dayjs'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

export default {
  name: 'GlobalScheduleSettings',
  components: { CustomDatePicker },
  setup: () => ({ v$: useVuelidate() }),
  data () {
    return {
      isLoading: false,
      error: false,

      configuration: undefined,
      schoolYearStartDate: dayjs(),
      schoolYearSemesterDate: dayjs(),
      schoolYearEndDate: dayjs(),
      holidays: [],
      h1Weeks: '',
      h2Weeks: ''
    }
  },
  validations: {
    schoolYearStartDate: {
      required
    },
    schoolYearSemesterDate: { // Should be > startDate and < endDate
      required,
      function (value) {
        return (value.diff(this.schoolYearStartDate) >= 0) && (value.diff(this.schoolYearEndDate) <= 0)
      }
    },
    schoolYearEndDate: { // Should be > startDate
      required,
      function (value) {
        return value.diff(this.schoolYearStartDate) >= 0
      }
    }
  },
  computed: {
    formErrorList () {
      return {
        startDate: (this.v$.schoolYearStartDate.$invalid && this.v$.schoolYearStartDate.$dirty)
          ? this.$t('required')
          : '',
        semesterDate: (this.v$.schoolYearSemesterDate.$invalid && this.v$.schoolYearSemesterDate.$dirty)
          ? (this.v$.schoolYearSemesterDate.$errors[0].$validator === 'required' ? this.$t('required') : this.$t('betweenStartAndEnd'))
          : '',
        endDate: (this.v$.schoolYearEndDate.$invalid && this.v$.schoolYearEndDate.$dirty)
          ? (this.v$.schoolYearEndDate.$errors[0].$validator === 'required' ? this.$t('required') : this.$t('afterStartDate'))
          : ''
      }
    }
  },
  created () {
    this.loadConfiguration()
  },
  methods: {
    loadConfiguration () {
      this.isLoading = true
      getGlobalConfiguration().then((data) => {
        this.isLoading = false
        if (data.success) {
          this.error = false
          this.configuration = data.configuration
          this.schoolYearStartDate = dayjs(data.configuration.schoolYearStartDate, 'YYYY-MM-DD')
          this.schoolYearSemesterDate = dayjs(data.configuration.schoolYearSemesterDate, 'YYYY-MM-DD')
          this.schoolYearEndDate = dayjs(data.configuration.schoolYearEndDate, 'YYYY-MM-DD')
          this.holidays = JSON.parse(data.configuration.holidays)
          this.h1Weeks = data.configuration.h1Weeks
          this.h2Weeks = data.configuration.h2Weeks
        } else {
          this.error = true
          console.error('Error')
        }
      }, (err) => {
        this.error = true
        console.error(err)
      })
    },
    updateConfiguration () {
      saveGlobalConfiguration(this.schoolYearStartDate, this.schoolYearSemesterDate, this.schoolYearEndDate, this.holidays, this.h1Weeks, this.h2Weeks).then((data) => {
        if (data.success) {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('success'), type: 'success' })
          this.loadConfiguration()
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('error'), type: 'error' })
          console.error('Error')
        }
      })
    },
    updateStartDate (date) {
      this.schoolYearStartDate = dayjs(date)
    },
    updateSemesterDate (date) {
      this.schoolYearSemesterDate = dayjs(date)
    },
    updateEndDate (date) {
      this.schoolYearEndDate = dayjs(date)
    },
    submit () {
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else {
        this.updateConfiguration()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.global-schedule-settings {
  position: relative;
}

.placeholder {
  height: 45px;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 1rem;
}
</style>

<i18n locale="fr">
{
  "serviceTitle": "Paramètres globeaux d'emploi du temps",
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "schoolYear": "Année scolaire",
  "holidays": "Vacances",
  "weekParity": "Parité des semaines",
  "required": "Champ requis",
  "betweenStartAndEnd": "Cette date doit se situer entre le début et la fin d'année scolaire",
  "afterStartDate": "Cette date doit se situer après le début de l'année scolaire",
  "submit": "Valider",
  "success": "Configuration mise à jour",
  "error": "Échec de l'enregistrement"
}
</i18n>
