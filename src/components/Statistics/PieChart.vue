<template>
  <canvas id="pie-chart" />
</template>

<script>
import { Chart, registerables } from 'chart.js'

export default {
  name: 'PieChart',
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
        type: 'pie',
        // type: 'doughnut',
        data: {
          labels: [],
          datasets: []
        },
        options: {
          responsive: true
        }
      }
    }
  },
  mounted () {
    Chart.register(...registerables)
    const context = document.getElementById('pie-chart').getContext('2d')
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
