<template>
  <Layout v-if="selectedSchool">
    <h1 :aria-label="$t('serviceTitle')" />
    <NeroToolbar>
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
        @updateDates="updateDates"
      />
      <PentilaDropdown
        v-if="managedSchoolList.length > 1"
        v-model="selectedSchool"
        class="school-dropdown"
        :list="managedSchoolList"
        display-field="schoolName"
        :sort="!isGlobalAdmin"
      />
    </NeroToolbar>

    <div class="stats">
      <StatsActivesUsers
        v-if="mq.phone || mq.tablet"
        :start-time="selectedStartDate"
        :end-time="selectedEndDate"
        :selected-school="selectedSchool"
      />

      <VisitsChart
        :start-time="selectedStartDate"
        :end-time="selectedEndDate"
        :selected-school="selectedSchool"
        comparator="profile"
      />

      <ActionsChart
        :start-time="selectedStartDate"
        :end-time="selectedEndDate"
        :selected-school="selectedSchool"
        comparator="profile"
      />

      <div class="doughnuts">
        <StatsDoughnut
          class="doughnut"
          :start-time="selectedStartDate"
          :end-time="selectedEndDate"
          :selected-school="selectedSchool"
          service="documents"
        />

        <StatsDoughnut
          class="doughnut"
          :start-time="selectedStartDate"
          :end-time="selectedEndDate"
          :selected-school="selectedSchool"
          service="homeworks"
        />
      </div>

      <div class="general-stats">
        <GlobalStat
          class="general-stat"
          :start-time="selectedStartDate"
          :end-time="selectedEndDate"
          :selected-school="selectedSchool"
          service="messaging"
          color="#E74C3C"
        />
        <GlobalStat
          class="general-stat"
          :start-time="selectedStartDate"
          :end-time="selectedEndDate"
          :selected-school="selectedSchool"
          service="schoolNews"
          color="#306CD3"
        />
        <GlobalStat
          class="general-stat"
          :start-time="selectedStartDate"
          :end-time="selectedEndDate"
          :selected-school="selectedSchool"
          service="news"
          color="#306CD3"
        />
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/BannerLayout'
import NeroToolbar from '@/components/Nero/NeroToolbar'
import StatsActivesUsers from '@components/Statistics/StatsActivesUsers'
import GlobalStat from '@components/Statistics/GlobalStat'
import StatsDoughnut from '@components/Statistics/StatsDoughnut'
import VisitsChart from '@components/Statistics/VisitsChart'
import ActionsChart from '@components/Statistics/ActionsChart'
import dayjs from 'dayjs'
import DateRangePicker from '@components/Base/DateRangePicker'

export default {
  name: 'Statistics',
  components: { DateRangePicker, NeroToolbar, VisitsChart, ActionsChart, StatsActivesUsers, StatsDoughnut, GlobalStat, Layout },
  inject: ['mq'],
  data () {
    return {
      allSchools: { schoolName: this.$t('allSchools'), schoolId: 0 },
      selectedStartDate: dayjs().subtract(7, 'days'),
      selectedEndDate: dayjs()
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
      return this.$store.state.cdt.configuration.startDateProject ? dayjs(this.$store.state.cdt.configuration.startDateProject).toDate() : dayjs().subtract(2, 'year').toDate() // arbitrary min date
    }
  },
  created () {
    if (this.managedSchoolList === undefined) {
      this.$store.dispatch('administration/getAdministrationSchools')
    }

    if (this.$store.state.cdt.configuration.startDateProject === undefined) {
      this.$store.dispatch('cdt/getConfiguration')
    }
  },
  methods: {
    updateDates (range) {
      this.selectedStartDate = dayjs(range.start)
      this.selectedEndDate = dayjs(range.end)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.range-picker {
  margin-left: auto;
  margin-right: 50px;
}

.service-body {
  overflow: hidden;
}

.stats {
  overflow: auto;
  // 20 px = toolbar margin
  height: calc(100% - (#{$toolbar-height} + 20px ));
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
  margin-top: 2em;
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
