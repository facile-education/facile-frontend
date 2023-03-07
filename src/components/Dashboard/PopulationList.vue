<template>
  <ul>
    <li
      v-for="(population, index) in populationList"
      :key="index"
    >
      {{ population.populationName }}
    </li>
  </ul>
</template>

<script>
export default {
  name: 'PopulationList',
  props: {
    populationList: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
</style>
