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
          :initial-range="{start: selectedStartDate, end: selectedEndDate}"
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
        :start-time="selectedStartDate"
        :end-time="selectedEndDate"
        :selected-school="selectedSchool"
        service="messaging"
      />
      <GlobalStat
        :start-time="selectedStartDate"
        :end-time="selectedEndDate"
        :selected-school="selectedSchool"
        service="news"
      />
      <GlobalStat
        :start-time="selectedStartDate"
        :end-time="selectedEndDate"
        :selected-school="selectedSchool"
        service="news"
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
import DateRangePicker from '@components/Statistics/DateRangePicker.vue'

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
    }
  },
  created () {
    if (this.managedSchoolList === undefined) {
      this.$store.dispatch('administration/getAdministrationSchools')
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
  }
}

@media screen and (min-width: 774px) {  // Inline if enough space
  .doughnuts {
    display: flex;
    align-items: center;

    .doughnut {
      flex: 1;
    }
  }
}

.general-stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>

<i18n locale="fr">
{
  "serviceTitle": "Statistiques"
}
</i18n>
