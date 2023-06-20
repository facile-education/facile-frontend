<template>
  <button
    class="population"
    @click="isExtended=!isExtended"
  >
    <span>
      {{ population.populationName }}
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

  <Transition name="slide-fade">
    <ul v-if="isExtended">
      <li
        v-for="member in sortedReadMembers"
        :key="member.userId"
      >
        <ReadInfoModalUser :user="member" />
      </li>
      <li
        v-for="member in sortedUnReadMembers"
        :key="member.userId"
      >
        <ReadInfoModalUser :user="member" />
      </li>
    </ul>
  </Transition>
</template>

<script>
import BaseIcon from '@components/Base/BaseIcon.vue'
import ReadInfoModalUser from '@components/Dashboard/ReadInfos/ReadInfoModalUser.vue'
import { getFullName } from '@utils/commons.util'
import PentilaUtils from 'pentila-utils'

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
    formattedPopulation () {
      const formattedPopulation = { ...this.population }
      formattedPopulation.members.forEach(member => {
        member.fullName = getFullName(member)
      })
      return formattedPopulation
    },
    populationReadMembers () {
      return this.formattedPopulation.members.filter(member => member.hasRead === true)
    },
    populationUnReadMembers () {
      return this.formattedPopulation.members.filter(member => member.hasRead === false)
    },
    sortedReadMembers () {
      return PentilaUtils.Array.sortWithString(this.populationReadMembers, false, 'fullName')
    },
    sortedUnReadMembers () {
      return PentilaUtils.Array.sortWithString(this.populationUnReadMembers, false, 'fullName')
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
  overflow-y: hidden;
}

.population {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 5px;
  font-size: 1.15rem;
}

.icon-collapse, .icon-extend {
  transition:  transform .4s;
  margin-left: 1rem;
}

.icon-extend {
  transform: rotate(180deg);
}

.icon-collapse {
  transform: rotate(90deg);
}

.slide-fade-enter-active {
  transition: all .3s ease-in;
}
.slide-fade-leave-active {
  transition: all .3s ease-out;
}

.slide-fade-enter-from, .slide-fade-leave-to {
  max-height: 0;
}
.slide-fade-enter-to, .slide-fade-leave-from {
  /* TODO: make max-height adaptive to content height */
  max-height: 300px;
}
</style>
