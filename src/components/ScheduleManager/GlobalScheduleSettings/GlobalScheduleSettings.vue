<template>
  <div class="global-schedule-settings">
    <h1 :aria-label="$t('ScheduleManager.GlobalScheduleSettings.serviceTitle')" />
    <WeprodeSpinner
      v-if="isLoading"
      style="z-index: 1"
    />
    <div
      v-if="error === true"
      v-t="'ScheduleManager.GlobalScheduleSettings.errorPlaceholder'"
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
          v-t="'ScheduleManager.GlobalScheduleSettings.submit'"
          @click="submit"
        />
      </footer>
    </div>
  </div>
</template>

<script>
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'
import Holidays from '@components/ScheduleManager/GlobalScheduleSettings/Holidays.vue'
import WeeksParity from '@components/ScheduleManager/GlobalScheduleSettings/WeeksParity.vue'
import YearDates from '@components/ScheduleManager/GlobalScheduleSettings/YearDates.vue'
import { useVuelidate } from '@vuelidate/core'
import dayjs from 'dayjs'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants'
import { getGlobalConfiguration, saveGlobalConfiguration } from '@/api/schedule.service'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'

export default {
  name: 'GlobalScheduleSettings',
  components: { WeprodeButton, WeeksParity, Holidays, YearDates, WeprodeSpinner },
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
          this.schoolYearStartDate = dayjs(data.configuration.schoolYearStartDate, DATE_EXCHANGE_FORMAT)
          this.schoolYearSemesterDate = dayjs(data.configuration.schoolYearSemesterDate, DATE_EXCHANGE_FORMAT)
          this.schoolYearEndDate = dayjs(data.configuration.schoolYearEndDate, DATE_EXCHANGE_FORMAT)
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
          this.$store.dispatch('popups/pushPopup', { message: this.$t('ScheduleManager.GlobalScheduleSettings.success'), type: 'success' })
          this.loadConfiguration()
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('ScheduleManager.GlobalScheduleSettings.error'), type: 'error' })
          console.error('Error')
        }
      }, (err) => {
        this.$store.dispatch('popups/pushPopup', { message: this.$t('ScheduleManager.GlobalScheduleSettings.error'), type: 'error' })
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
