<template>
  <ul>
    <li
      v-for="(population, index) in populationList"
      :key="index"
      :title="population.populationName"
      tabindex="0"
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
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

li {
  max-width: 15vw;
  margin-right: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: 6px;
  padding: 5px 8px;
  color: #646464;
  background-color: #F5F5F5;
}
</style>
