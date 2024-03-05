<template>
  <div
    class="population-list"
    @mouseover="populationList.length > 1 ? listDisplayed = true : ''"
    @mouseleave="listDisplayed = false"
  >
    <div
      v-if="populationList.length === 1"
      class="lonely-population"
      :title="populationList[0].populationName"
    >
      {{ populationList[0].populationName }}
    </div>

    <button
      v-else
      @focus="listDisplayed = true"
      @blur="listDisplayed = false"
    >
      {{ $t('Base.PopulationList.populations', {n: populationList.length}) }}
    </button>

    <ul v-if="listDisplayed">
      <li
        v-for="(population, index) in populationList"
        :key="index"
      >
        {{ population.populationName }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'PopulationList',
  props: {
    populationList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      listDisplayed: false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.population-list {
  position: relative;
  @extend %font-regular-m;
  z-index: 100;
}

.lonely-population {
  white-space: nowrap;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: 6px;
  padding: 5px 8px;
  color: #646464;
  background-color: #F5F5F5;
}

button {
  border-radius: 6px;
  padding: 5px;
  color: #646464 !important;
  background-color: #F5F5F5;
  border: none;
  cursor: pointer;
  margin-top: 1px;
}

ul {
  position: absolute;
  top: 100%;
  left: 0;
  width: min(80vw, 350px);
  max-height: 60vh;
  overflow-y: auto;
  background-color: white;
  margin: 0;
  padding: 10px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  list-style-type: none;
}

li {
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
}

</style>
