<template>
  <div class="stats">
    <ChartParameters />
    <Chart />
  </div>
</template>

<script>
import Chart from '@/components/Statistics/Chart.vue'
import ChartParameters from '@/components/Statistics/ChartParameters.vue'

// https://alligator.io/vuejs/vue-chart-js/

// 1 Etablissement :
// {"stats":[
// {"data":[{" ":"17612","date":"2018-05-27"},{" ":"26527","date":"2018-05-28"},{" ":"22865","date":"2018-05-29"},{" ":"21088","date":"2018-05-30"},{" ":"22075","date":"2018-05-31"},{" ":"16678","date":"2018-06-01"},{" ":"8067","date":"2018-06-02"},{" ":"12477","date":"2018-06-03"},{" ":"19742","date":"2018-06-04"},{" ":"15703","date":"2018-06-05"},{" ":"12294","date":"2018-06-06"},{" ":"12488","date":"2018-06-07"},{" ":"8639","date":"2018-06-08"},{" ":"3665","date":"2018-06-09"},{" ":"4873","date":"2018-06-10"},{" ":"8198","date":"2018-06-11"},{" ":"6084","date":"2018-06-12"},{" ":"4386","date":"2018-06-13"},{" ":"4145","date":"2018-06-14"},{" ":"3259","date":"2018-06-15"},{" ":"1877","date":"2018-06-16"},{" ":"2408","date":"2018-06-17"},{" ":"2974","date":"2018-06-18"},{" ":"2766","date":"2018-06-19"},{" ":"2113","date":"2018-06-20"},{" ":"2074","date":"2018-06-21"},{" ":"1769","date":"2018-06-22"},{" ":"1076","date":"2018-06-23"},{" ":"1312","date":"2018-06-24"},{" ":"1997","date":"2018-06-25"},{" ":"988","date":"2018-06-26"}],
// "metadata":["date"," "]}]}

// 2 profils :
// {"stats":[
// {"data":[{"Elèves":"14108","date":"2018-05-27","Enseignants":"2300"},{"Elèves":"20158","date":"2018-05-28","Enseignants":"4056"},{"Elèves":"17046","date":"2018-05-29","Enseignants":"3649"},{"Elèves":"15961","date":"2018-05-30","Enseignants":"3108"},{"Elèves":"16614","date":"2018-05-31","Enseignants":"3348"},{"Elèves":"12372","date":"2018-06-01","Enseignants":"2539"},{"Elèves":"6201","date":"2018-06-02","Enseignants":"1101"},{"Elèves":"9857","date":"2018-06-03","Enseignants":"1576"},{"Elèves":"14530","date":"2018-06-04","Enseignants":"2981"},{"Elèves":"11280","date":"2018-06-05","Enseignants":"2545"},{"Elèves":"8686","date":"2018-06-06","Enseignants":"2006"},{"Elèves":"8881","date":"2018-06-07","Enseignants":"1924"},{"Elèves":"5707","date":"2018-06-08","Enseignants":"1454"},{"Elèves":"2603","date":"2018-06-09","Enseignants":"565"},{"Elèves":"3473","date":"2018-06-10","Enseignants":"752"},{"Elèves":"5169","date":"2018-06-11","Enseignants":"1315"},{"Elèves":"3690","date":"2018-06-12","Enseignants":"996"},{"Elèves":"2583","date":"2018-06-13","Enseignants":"707"},{"Elèves":"2416","date":"2018-06-14","Enseignants":"726"},{"Elèves":"1962","date":"2018-06-15","Enseignants":"567"},{"Elèves":"1355","date":"2018-06-16","Enseignants":"282"},{"Elèves":"1645","date":"2018-06-17","Enseignants":"370"},{"Elèves":"1624","date":"2018-06-18","Enseignants":"553"},{"Elèves":"1486","date":"2018-06-19","Enseignants":"504"},{"Elèves":"1152","date":"2018-06-20","Enseignants":"317"},{"Elèves":"1080","date":"2018-06-21","Enseignants":"342"},{"Elèves":"916","date":"2018-06-22","Enseignants":"279"},{"Elèves":"690","date":"2018-06-23","Enseignants":"179"},{"Elèves":"905","date":"2018-06-24","Enseignants":"157"},{"Elèves":"1068","date":"2018-06-25","Enseignants":"328"},{"Elèves":"486","date":"2018-06-26","Enseignants":"194"}],
// "metadata":["date","Elèves","Enseignants"]}]}

export default {
  name: 'Statistics',
  components: {
    ChartParameters,
    Chart
  }
}
</script>

<style lang="scss" scoped>
.stats {
  padding: 10px;
  height: 100%;
  overflow: auto;
}
</style>
