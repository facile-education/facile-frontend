<template>
  <canvas id="planet-chart" />
</template>

<script>
import Chart from 'chart.js'

export default {
  name: 'Chart',
  data () {
    return {
      context: undefined,
      planetChartData: {
        type: 'line',
        data: {
          labels: ['2018-05-27', '2018-05-28', '2018-05-29', '2018-05-30', '2018-05-31',
            '2018-06-01', '2018-06-02', '2018-06-03', '2018-06-04', '2018-06-05', '2018-06-06',
            '2018-06-07', '2018-06-08', '2018-06-09', '2018-06-10', '2018-06-11', '2018-06-12',
            '2018-06-13', '2018-06-14', '2018-06-15', '2018-06-16', '2018-06-17', '2018-06-18',
            '2018-06-19', '2018-06-20', '2018-06-21', '2018-06-22', '2018-06-23', '2018-06-24',
            '2018-06-25', '2018-06-26'],
          datasets: [
            { // one line graph
              label: 'Elèves',
              data: [14108, 20158, 17046, 15961, 16614, 12372, 6201, 9857, 14530,
                11280, 8686, 8881, 5707, 2603, 3473, 5169, 3690, 2583, 2416, 1962,
                1355, 1645, 1624, 1486, 1152, 1080, 916, 690, 905, 328, 486],
              pointBorderColor: 'white',
              pointBackgroundColor: 'red',
              borderColor: [
                'red'
              ],
              borderWidth: 1
            },
            { // another line graph
              label: 'Enseignants',
              data: [2300, 4056, 3649, 3108, 3348, 2539, 1101, 1576, 2981,
                2545, 2006, 1924, 1454, 565, 752, 1315, 996, 707, 726, 567,
                282, 370, 553, 504, 317, 342, 279, 179, 157, 1068, 194],
              pointBorderColor: 'white',
              pointBackgroundColor: 'blue',
              borderColor: [
                'blue'
              ],
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          // maintainAspectRatio: false,
          lineTension: 1,
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                padding: 25
              }
            }]
          }
        }
      }
    }
  },
  mounted () {
    this.context = document.getElementById('planet-chart')
    this.createChart(this.planetChartData)
  },
  methods: {
    createChart (chartData) {
      var gradient = this.context.getContext('2d').createLinearGradient(0, 0, 0, 450)
      var gradient2 = this.context.getContext('2d').createLinearGradient(0, 0, 0, 450)

      gradient.addColorStop(0, 'rgba(255, 0,0, 0.5)')
      gradient.addColorStop(0.5, 'rgba(255, 0, 0, 0.25)')
      gradient.addColorStop(1, 'rgba(255, 0, 0, 0)')

      gradient2.addColorStop(0, 'rgba(0, 231, 255, 0.9)')
      gradient2.addColorStop(0.5, 'rgba(0, 231, 255, 0.25)')
      gradient2.addColorStop(1, 'rgba(0, 231, 255, 0)')

      chartData.data.datasets[0].backgroundColor = gradient
      chartData.data.datasets[1].backgroundColor = gradient2

      const myChart = new Chart(this.context, {
        type: chartData.type,
        data: chartData.data,
        options: chartData.options
      })
      console.log(myChart)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
