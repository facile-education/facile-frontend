<template>
  <p>Paramètres globaux</p>
  <div class="dates">
    <div class="date">
      <div v-t="'startDateLabel'" />
      <CustomDatePicker
        :selected-date="schoolYearStartDate"
        @selectDate="updateStartDate"
      />
    </div>
    <div class="date">
      <div v-t="'semesterDateLabel'" />
      <CustomDatePicker
        :selected-date="schoolYearSemesterDate"
        @selectDate="updateSemesterDate"
      />
    </div>
    <div class="date">
      <div v-t="'endDateLabel'" />
      <CustomDatePicker
        :selected-date="schoolYearEndDate"
        @selectDate="updateEndDate"
      />
    </div>
  </div>
  <PentilaInput
    v-model="h1Weeks"
    :placeholder="$t('h1Weeks')"
  />
  <PentilaInput
    v-model="h2Weeks"
    :placeholder="$t('h2Weeks')"
  />
  <PentilaButton
    :label="$t('save')"
    @click="save"
  />
</template>

<script>

import CustomDatePicker from '@components/Base/CustomDatePicker.vue'
import dayjs from 'dayjs'

import { getScheduleConfiguration, saveScheduleConfiguration } from '@/api/scheduleManager.service'

export default {
  name: 'GlobalScheduleConfiguration',
  components: {
    CustomDatePicker
  },
  data () {
    return {
      schoolYearStartDate: dayjs(),
      schoolYearSemesterDate: dayjs(),
      schoolYearEndDate: dayjs(),
      h1Weeks: '',
      h2Weeks: '',
      holidays: []
    }
  },
  computed: {
    isGlobalAdmin () {
      return (this.$store.state.user.isAdministrator || this.$store.state.user.isENTAdmin)
    }
  },
  created () {
    getScheduleConfiguration().then((data) => {
      if (data.success) {
        this.schoolYearStartDate = data.configuration.schoolYearStartDate
        this.schoolYearSemesterDate = data.configuration.schoolYearSemesterDate
        this.schoolYearEndDate = data.configuration.schoolYearEndDate
        this.h1Weeks = data.configuration.h1Weeks
        this.h2Weeks = data.configuration.h2Weeks
        this.holidays = data.configuration.holidays
      }
    }
    )
  },
  methods: {
    updateStartDate (date) {
      this.schoolYearStartDate = dayjs(date)

      // Update semester and end date if needed
      if (this.schoolYearStartDate.isAfter(this.schoolYearSemesterDate)) {
        this.schoolYearSemesterDate = this.schoolYearStartDate
      }
      if (this.schoolYearStartDate.isAfter(this.schoolYearEndDate)) {
        this.schoolYearEndDate = this.schoolYearStartDate
      }
    },
    updateSemesterDate (date) {
      this.schoolYearSemesterDate = dayjs(date)

      // Update semester and end date if needed
      if (this.schoolYearSemesterDate.isAfter(this.schoolYearEndDate)) {
        this.schoolYearEndDate = this.schoolYearSemesterDate
      }
    },
    updateEndDate (date) {
      this.endDate = dayjs(date)
    },
    submit () {
      saveScheduleConfiguration(this.schoolYearStartDate, this.schoolYearSemesterDate, this.schoolYearEndDate, this.holidays, this.h1Weeks, this.h2Weeks).then(data => {
        if (data.success) {
          const message = this.$t('save-success')
          this.$store.dispatch('popups/pushPopup', { message, type: 'info' })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@media screen and (min-width: 700px) {
  .dates {
    display: flex;
    justify-content: space-around;
  }

  .start-date, .end-date {
    flex: 1;
  }
}

.date {
  margin-bottom: 15px;
}
</style>

<i18n locale="fr">
{
  "startDateLabel": "Début d'année scolaire",
  "semesterDateLabel": "Limite de semestre",
  "endDateLabel": "Fin d'année scolaire",
  "h1Weeks": "Semaines H1",
  "h2Weeks": "Semaines H2",
  "save": "Enregistrer",
  "save-success": "Paramètres globaux enregistrés"
}
</i18n>
