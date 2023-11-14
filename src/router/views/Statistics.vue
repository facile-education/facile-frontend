<template>
  <div v-if="selectedSchool">
    <div class="statistics">
      <h1 :aria-label="$t('serviceTitle')" />

      <div>
        <div
          v-if="managedSchoolList.length > 1"
          class="school-container"
        >
          <WeprodeDropdown
            v-model="selectedSchool"
            class="school-dropdown"
            :list="managedSchoolList"
            display-field="schoolName"
            :sort="!isGlobalAdmin"
          />
        </div>
        <div class="toolbar">
          <StatsActivesUsers
            v-if="!(mq.phone || mq.tablet)"
            :start-time="selectedStartDate"
            :end-time="selectedEndDate"
            :selected-school="selectedSchool"
          />
          <DateRangePicker
            v-if="minDate !== undefined"
            :initial-range="{start: selectedStartDate, end: selectedEndDate}"
            :max-date="maxDate"
            :min-date="minDate"
            class="range-picker"
            @update-dates="updateDates"
          />
        </div>
      </div>

      <div class="stats">
        <StatsActivesUsers
          v-if="mq.phone || mq.tablet"
          :start-time="selectedStartDate"
          :end-time="selectedEndDate"
          :selected-school="selectedSchool"
          class="stat"
        />

        <VisitsChart
          :start-time="selectedStartDate"
          :end-time="selectedEndDate"
          :selected-school="selectedSchool"
          comparator="profile"
          class="stat"
        />

        <ActionsChart
          :start-time="selectedStartDate"
          :end-time="selectedEndDate"
          :selected-school="selectedSchool"
          comparator="profile"
          class="stat"
        />

        <div class="doughnuts">
          <StatsDoughnut
            class="doughnut stat"
            :start-time="selectedStartDate"
            :end-time="selectedEndDate"
            :selected-school="selectedSchool"
            service="documents"
          />

          <StatsDoughnut
            class="doughnut stat"
            :start-time="selectedStartDate"
            :end-time="selectedEndDate"
            :selected-school="selectedSchool"
            service="homeworks"
          />

          <StatsDoughnut
            class="doughnut stat"
            :start-time="selectedStartDate"
            :end-time="selectedEndDate"
            :selected-school="selectedSchool"
            service="schoolLife"
          />
        </div>

        <div class="general-stats">
          <GlobalStat
            class="general-stat stat"
            :start-time="selectedStartDate"
            :end-time="selectedEndDate"
            :selected-school="selectedSchool"
            service="messaging"
            color="#E74C3C"
          />
          <GlobalStat
            class="general-stat stat"
            :start-time="selectedStartDate"
            :end-time="selectedEndDate"
            :selected-school="selectedSchool"
            service="schoolNews"
            color="#306CD3"
          />
          <GlobalStat
            class="general-stat stat"
            :start-time="selectedStartDate"
            :end-time="selectedEndDate"
            :selected-school="selectedSchool"
            service="news"
            color="#306CD3"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DateRangePicker from '@components/Base/DateRangePicker'
import ActionsChart from '@components/Statistics/ActionsChart'
import GlobalStat from '@components/Statistics/GlobalStat'
import StatsActivesUsers from '@components/Statistics/StatsActivesUsers'
import StatsDoughnut from '@components/Statistics/StatsDoughnut'
import VisitsChart from '@components/Statistics/VisitsChart'
import dayjs from 'dayjs'

import { getGlobalConfiguration } from '@/api/schedule.service'
import WeprodeDropdown from '@/components/Base/Weprode/WeprodeDropdown.vue'

export default {
  name: 'Statistics',
  components: { DateRangePicker, VisitsChart, ActionsChart, StatsActivesUsers, StatsDoughnut, GlobalStat, WeprodeDropdown },
  inject: ['mq'],
  emits: ['update:layout'],
  data () {
    return {
      allSchools: { schoolName: this.$t('allSchools'), schoolId: 0 },
      selectedStartDate: dayjs().subtract(7, 'days'),
      selectedEndDate: dayjs(),
      globalScheduleConfiguration: undefined
    }
  },
  computed: {
    isGlobalAdmin () {
      return (this.$store.state.user.isAdministrator || this.$store.state.user.isENTAdmin)
    },
    managedSchoolList () {
      if (this.isGlobalAdmin && this.$store.state.administration.schoolList !== undefined) {
        return [this.allSchools, ...this.$store.state.administration.schoolList]
      }

      return this.$store.state.administration.schoolList
    },
    selectedSchool: {
      get () {
        return this.$store.state.administration.selectedSchool
      },
      set (school) {
        this.$store.commit('administration/setSelectedSchool', school)
      }
    },
    maxDate () {
      return dayjs().toDate()
    },
    minDate () {
      return this.globalScheduleConfiguration ? dayjs(this.globalScheduleConfiguration.startDateProject).toDate() : dayjs().subtract(2, 'year').toDate() // arbitrary min date
    }
  },
  beforeCreate () {
    this.$emit('update:layout', 'BannerLayout')
  },
  created () {
    if (this.managedSchoolList === undefined) {
      this.$store.dispatch('administration/getAdministrationSchools')
    }

    this.getGlobalScheduleConfig()
  },
  methods: {
    updateDates (range) {
      this.selectedStartDate = dayjs(range.start)
      this.selectedEndDate = dayjs(range.end)
    },
    getGlobalScheduleConfig () {
      getGlobalConfiguration().then((data) => {
        if (data.success) {
          this.globalScheduleConfiguration = data.configuration
        } else {
          console.error('Error')
        }
      }, (err) => {
        console.error(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.statistics {
  display: flex;
  height: 100%;
  flex-direction: column;
}

.school-container {
  width: 100%;
  text-align: right;
  margin-bottom: 1rem;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap;
}

.stats {
  flex: 1;
  overflow: auto;
  // 20 px = toolbar margin
  height: calc(100% - (#{$toolbar-height} + 20px ));
}

.stat {
  margin-top: 20px;
}

@media screen and (min-width: 774px) {  // Inline if enough space
  .doughnuts {
    display: flex;
    align-items: center;
    gap: 50px;

    .doughnut {
      flex: 1;
    }
  }
}

.general-stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 25px 50px;
}
</style>

<i18n locale="fr">
{
  "allSchools": "Tous les établissements",
  "serviceTitle": "Statistiques"
}
</i18n>
