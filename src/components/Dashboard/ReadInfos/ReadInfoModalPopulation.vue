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
      <CustomIcon
        :class="isExtended ? 'icon-extend': 'icon-collapse'"
        icon-name="icon-chevron-right-s"
      />
    </span>
  </button>

  <Transition name="slide-fade">
    <ul v-if="isExtended">
      <li
        v-for="member in sortedReadMembers"
        :key="member.userId"
      >
        <InfoModalUser
          :user="member"
          field="hasRead"
        />
      </li>
      <li
        v-for="member in sortedUnReadMembers"
        :key="member.userId"
      >
        <InfoModalUser
          :user="member"
          field="hasRead"
        />
      </li>
    </ul>
  </Transition>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import InfoModalUser from '@components/Dashboard/ReadInfos/InfoModalUser.vue'
import { getFullName } from '@utils/commons.util'
import WeprodeUtils from '@utils/weprode.utils'

export default {
  name: 'ReadInfoModalPopulation',
  components: { CustomIcon, InfoModalUser },
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
      return WeprodeUtils.sortArrayWithString(this.populationReadMembers, false, 'fullName')
    },
    sortedUnReadMembers () {
      return WeprodeUtils.sortArrayWithString(this.populationUnReadMembers, false, 'fullName')
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

.right {
  display: flex;
  align-items: center;
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
  margin-left: 0.5rem;
}

.icon-chevron-right-s {
  font-size: 1.5rem;
}

.icon-extend {
  transform: rotate(90deg);
}

.icon-collapse {
  transform: rotate(0);
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
