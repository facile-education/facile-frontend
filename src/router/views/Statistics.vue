<template>
  <Layout v-if="selectedSchool">
    <h1 :aria-label="$t('serviceTitle')" />
    <div class="header">
      <StatsActivesUsers
        :start-time="selectedStartDate"
        :end-time="selectedEndDate"
        :selected-school="selectedSchool"
      />
      <section class="selectors">
        <!--        <DatepickerNav-->
        <!--          class="date-picker"-->
        <!--          :selected-date="selectedDate"-->
        <!--          @selectDate="onSelectDate"-->
        <!--        />-->
        <PentilaDropdown
          v-if="managedSchoolList.length > 1"
          v-model="selectedSchool"
          :list="managedSchoolList"
          display-field="schoolName"
        />
      </section>
    </div>

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

export default {
  name: 'Statistics',
  components: { StatsChart, StatsActivesUsers, StatsDoughnut, GlobalStat, Layout },
  data () {
    return {
      selectedStartDate: dayjs().subtract(3, 'month'),
      selectedEndDate: dayjs()
      // lineLabels: undefined,
      // lineDatasets: undefined,
      // lineLabelsCompare: undefined,
      // lineDatasetsCompare: undefined,
      /* lineLabelsCompare: ['2018-05-27', '2018-05-28', '2018-05-29', '2018-05-30', '2018-05-31',
        '2018-06-01', '2018-06-02', '2018-06-03', '2018-06-04', '2018-06-05', '2018-06-06',
        '2018-06-07', '2018-06-08', '2018-06-09', '2018-06-10', '2018-06-11', '2018-06-12',
        '2018-06-13', '2018-06-14', '2018-06-15', '2018-06-16', '2018-06-17', '2018-06-18',
        '2018-06-19', '2018-06-20', '2018-06-21', '2018-06-22', '2018-06-23', '2018-06-24',
        '2018-06-25', '2018-06-26'],
      lineDatasetsCompare: [
        {
          label: 'Elèves',
          data: [14108, 20158, 17046, 15961, 16614, 12372, 6201, 9857, 14530,
            11280, 8686, 8881, 5707, 2603, 3473, 5169, 3690, 2583, 2416, 1962,
            1355, 1645, 1624, 1486, 1152, 1080, 916, 690, 905, 328, 486],
          pointBorderColor: 'white',
          pointBackgroundColor: 'red',
          borderColor: [
            'red'
          ],
          // borderWidth: 1
          backgroundColor: 'rgba(255, 0, 0, 0.25)'
        },
        {
          label: 'Enseignants',
          data: [2300, 4056, 3649, 3108, 3348, 2539, 1101, 1576, 2981,
            2545, 2006, 1924, 1454, 565, 752, 1315, 996, 707, 726, 567,
            282, 370, 553, 504, 317, 342, 279, 179, 157, 1068, 194],
          pointBorderColor: 'white',
          pointBackgroundColor: 'blue',
          backgroundColor: 'rgba(0, 231, 255, 0.25)',
          borderColor: [
            'blue'
          ]
          // borderWidth: 1
        }
      ], */
      // pieLabels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
      // pieDatasets: [{
      //  label: 'Dataset 1',
      //  data: [36, 44, 90, 23, 5],
      //  backgroundColor: ['rgba(255, 0, 0, 0.45)', 'rgba(255, 130, 0, 0.45)', 'rgba(255, 255, 0, 0.45)', 'rgba(0, 235, 0, 0.45)', 'rgba(0, 231, 255, 0.45)']
      // }],
      // pieLabels: undefined,
      // pieDatasets: undefined,
      // pieTotal: 0,
      // doughnutLabels: undefined,
      // doughnutDatasets: undefined,
      // doughnutTotal: 0
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
  }
  // created () {
  //   axios.get('/api/jsonws/statistics-portlet.generalstat/get-homeworks-count', {
  //     params: {
  //       schoolId: 328701,
  //       endDate: '2022-02-01 00:00',
  //       startDate: '2022-01-01 00:00'
  //     }
  //   }).then(response => {
  //     this.pieLabels = response.data.labels
  //     this.pieDatasets = response.data.datasets
  //     this.pieTotal = response.data.totalCount
  //   })
  //
  //   axios.get('/api/jsonws/statistics-portlet.generalstat/get-files-count', {
  //     params: {
  //       schoolId: 328701,
  //       endDate: '2022-02-01 00:00',
  //       startDate: '2022-01-01 00:00'
  //     }
  //   }).then(response => {
  //     this.doughnutLabels = response.data.labels
  //     this.doughnutDatasets = response.data.datasets
  //     this.doughnutTotal = response.data.totalCount
  //   })
  //
  //   // Comparator is either "profile", "school", "service" or any other value for no comparison
  //   axios.get('/api/jsonws/statistics-portlet.generalstat/get-sessions-count', {
  //     params: {
  //       comparator: '',
  //       schoolId: 328701,
  //       endDate: '2022-02-01 00:00',
  //       startDate: '2022-01-01 00:00'
  //     }
  //   }).then(response => {
  //     this.lineLabels = response.data.labels
  //     this.lineDatasets = response.data.datasets
  //   })
  //
  //   axios.get('/api/jsonws/statistics-portlet.generalstat/get-sessions-count', {
  //     params: {
  //       comparator: 'profile',
  //       schoolId: 328701,
  //       endDate: '2022-02-01 00:00',
  //       startDate: '2022-01-01 00:00'
  //     }
  //   }).then(response => {
  //     this.lineLabelsCompare = response.data.labels
  //     this.lineDatasetsCompare = response.data.datasets
  //   })
  // }
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.doughnuts {
  display: flex;

  .doughnut {
    flex: 1;
  }
}

.general-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 264px
}
</style>

<i18n locale="fr">
{
  "serviceTitle": "Statistiques"
}
</i18n>
