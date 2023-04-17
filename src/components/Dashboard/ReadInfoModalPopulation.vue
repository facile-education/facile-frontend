<template>
  <button
    class="population"
    @click="isExtended=!isExtended"
  >
    <span>
      {{ population.name }}
    </span>
    <span class="right">
      <span>
        {{ populationReadMembers.length + '/' + population.members.length }}
      </span>
      <BaseIcon
        :class="isExtended ? 'icon-extend': 'icon-collapse'"
        name="chevron-up"
      />
    </span>
  </button>

  <ul v-if="isExtended">
    <!-- TODO: use userId as key-->
    <li
      v-for="(member, index) in population.members"
      :key="index"
    >
      <ReadInfoModalUser :user="member" />
    </li>
  </ul>
</template>

<script>
import BaseIcon from '@components/Base/BaseIcon.vue'
import ReadInfoModalUser from '@components/Dashboard/News/ReadInfoModalUser.vue'

export default {
  name: 'ReadInfoModalPopulation',
  components: { ReadInfoModalUser, BaseIcon },
  props: {
    population: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isExtended: false
    }
  },
  computed: {
    populationReadMembers () {
      return this.population.members.filter(member => member.hasRead === true)
    }
  }
}
</script>

<style lang="scss" scoped>

button {
  cursor: pointer;
  background-color: transparent;
  border-radius: 0;
  padding: 0;
  margin: 0;
  border: none;
}

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.population {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 5px;
  font-size: 1.25rem;
}

.icon-collapse, .icon-extend {
  transition:  transform .6s;
  margin-left: 1rem;
}

.icon-extend {
  transform: rotate(180deg);
}

.icon-collapse {
  transform: rotate(90deg);
}
</style>
