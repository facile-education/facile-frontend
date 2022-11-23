<template>
  <canvas id="line-chart" />
</template>

<script>
import { Chart, registerables } from 'chart.js'

export default {
  name: 'Chart',
  props: {
    labels: {
      type: Array,
      required: true
    },
    datasets: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      chart: {
        type: 'line',
        data: {
          labels: [],
          datasets: []
        },
        options: {
          responsive: true,
          fill: true,
          maintainAspectRatio: true,
          lineTension: 0.3,
          interaction: {
            intersect: false,
            mode: 'index'
          }
          // scales: {
          //  yAxes: [{
          //    ticks: {
          //      beginAtZero: true,
          //      padding: 25
          //    }
          //  }]
          // }
        }
      }
    }
  },
  mounted () {
    Chart.register(...registerables)
    const context = document.getElementById('line-chart').getContext('2d')
    this.chart.data.labels = this.labels
    this.chart.data.datasets = this.datasets
    this.createChart(context)
  },
  methods: {
    createChart (context) {
      const chart = new Chart(context, {
        type: this.chart.type,
        data: this.chart.data,
        options: this.chart.options
      })
      console.log(chart)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
