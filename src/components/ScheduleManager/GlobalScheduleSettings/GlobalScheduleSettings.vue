<template>
  <div class="global-schedule-settings">
    <h1 :aria-label="$t('serviceTitle')" />
    <WeprodeSpinner
      v-if="isLoading"
      style="z-index: 1"
    />
    <div
      v-if="error === true"
      v-t="'errorPlaceholder'"
      class="placeholder"
    />
    <div v-else>
      <YearDates
        v-model:start-date="schoolYearStartDate"
        v-model:semester-date="schoolYearSemesterDate"
        v-model:end-date="schoolYearEndDate"
      />

      <Holidays
        v-model:holidays="holidays"
        :school-year-start-date="schoolYearStartDate"
        :school-year-end-date="schoolYearEndDate"
      />

      <WeeksParity
        v-model:h1Weeks="h1Weeks"
        v-model:h2Weeks="h2Weeks"
      />

      <footer>
        <WeprodeButton
          v-t="'submit'"
          @click="submit"
        />
      </footer>
    </div>
  </div>
</template>

<script>
import Holidays from '@components/ScheduleManager/GlobalScheduleSettings/Holidays.vue'
import WeeksParity from '@components/ScheduleManager/GlobalScheduleSettings/WeeksParity.vue'
import YearDates from '@components/ScheduleManager/GlobalScheduleSettings/YearDates.vue'
import { useVuelidate } from '@vuelidate/core'
import dayjs from 'dayjs'

import { getGlobalConfiguration, saveGlobalConfiguration } from '@/api/schedule.service'

export default {
  name: 'GlobalScheduleSettings',
  components: { WeeksParity, Holidays, YearDates },
  setup: () => ({ v$: useVuelidate() }),
  data () {
    return {
      isLoading: false,
      error: false,

      schoolYearStartDate: dayjs(),
      schoolYearSemesterDate: dayjs(),
      schoolYearEndDate: dayjs(),
      holidays: [],
      h1Weeks: '',
      h2Weeks: ''
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
          this.schoolYearStartDate = dayjs(data.configuration.schoolYearStartDate, 'YYYY-MM-DD')
          this.schoolYearSemesterDate = dayjs(data.configuration.schoolYearSemesterDate, 'YYYY-MM-DD')
          this.schoolYearEndDate = dayjs(data.configuration.schoolYearEndDate, 'YYYY-MM-DD')
          this.holidays = data.configuration.holidays
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
      }, (err) => {
        this.$store.dispatch('popups/pushPopup', { message: this.$t('error'), type: 'error' })
        console.error(err)
      })
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

footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>

<i18n locale="fr">
{
  "serviceTitle": "Paramètres globaux d'emploi du temps",
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "submit": "Valider la configuration",
  "success": "Configuration mise à jour",
  "error": "Échec de l'enregistrement"
}
</i18n>
