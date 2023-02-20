<template>
  <Layout v-if="selectedSchool">
    <h1 :aria-label="$t('serviceTitle')" />
    <div
      class="header"
      :class="{'phone' : mq.phone || mq.tablet}"
    >
      <StatsActivesUsers
        v-if="!(mq.phone || mq.tablet)"
        :start-time="selectedStartDate"
        :end-time="selectedEndDate"
        :selected-school="selectedSchool"
      />
      <section class="selectors">
        <DateRangePicker
          v-if="minDate !== undefined"
          :initial-range="{start: selectedStartDate, end: selectedEndDate}"
          :max-date="maxDate"
          :min-date="minDate"
          @updateDates="updateDates"
        />
        <PentilaDropdown
          v-if="managedSchoolList.length > 1"
          v-model="selectedSchool"
          class="school-dropdown"
          :list="managedSchoolList"
          display-field="schoolName"
        />
      </section>
    </div>

    <StatsActivesUsers
      v-if="mq.phone || mq.tablet"
      :start-time="selectedStartDate"
      :end-time="selectedEndDate"
      :selected-school="selectedSchool"
    />

    <StatsChart
      :start-time="selectedStartDate"
      :end-time="selectedEndDate"
      :selected-school="selectedSchool"
    />

    <StatsChart
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
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/BannerLayout'
import StatsActivesUsers from '@components/Statistics/StatsActivesUsers.vue'
import GlobalStat from '@components/Statistics/GlobalStat.vue'
import StatsDoughnut from '@components/Statistics/StatsDoughnut.vue'
import StatsChart from '@components/Statistics/StatsChart.vue'
import dayjs from 'dayjs'
import DateRangePicker from '@components/Base/DateRangePicker.vue'

export default {
  name: 'Statistics',
  components: { DateRangePicker, StatsChart, StatsActivesUsers, StatsDoughnut, GlobalStat, Layout },
  inject: ['mq'],
  data () {
    return {
      selectedStartDate: dayjs().subtract(7, 'days'),
      selectedEndDate: dayjs()
    }
  },
  computed: {
    managedSchoolList () {
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
      return this.$store.state.cdt.configuration.startDateProject ? dayjs(this.$store.state.cdt.configuration.startDateProject).toDate() : undefined
    }
  },
  created () {
    if (this.managedSchoolList === undefined) {
      this.$store.dispatch('administration/getAdministrationSchools')
    }

    if (this.minDate === undefined) {
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

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &.phone{
    justify-content: flex-end;
  }
}

.selectors {
  display: flex;

  .school-dropdown {
    margin-left: 15px;
    border: 1px solid $color-border;
    border-radius: 6px;
  }
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
  "serviceTitle": "Statistiques"
}
</i18n>
