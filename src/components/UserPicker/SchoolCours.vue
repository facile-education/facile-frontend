<template>
  <div
    class="cours-header"
    @click="isExpanded = !isExpanded"
  >
    {{ $t('cours') }}
    <div
      class="caret"
    >
      <FontAwesomeIcon
        v-if="isExpanded"
        icon="caret-up"
        class="caret"
      />
      <FontAwesomeIcon
        v-else
        icon="caret-down"
        class="caret"
      />
    </div>
  </div>
  <div
    v-if="isExpanded"
    class="cours"
  >
    <div
      v-for="cour in sortedCours"
      :key="cour.groupName"
    >
      <div
        class="cour-header"
        @click="cour.isExpanded = !cour.isExpanded"
      >
        <span>{{ cour.groupName }}</span>
        <div class="caret">
          <FontAwesomeIcon
            v-if="cour.isExpanded"
            icon="caret-up"
          />
          <FontAwesomeIcon
            v-else
            icon="caret-down"
          />
        </div>
      </div>
      <div
        v-if="cour.isExpanded"
        class="cours"
      >
        <div
          v-for="population in cour.populations"
          :key="population.populationName"
          class="population"
          @click="getMembers(population)"
        >
          <span>{{ population.groupName }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import PentilaUtils from 'pentila-utils'

export default {
  name: 'SchoolCours',
  components: {
    FontAwesomeIcon
  },
  inject: ['mq'],
  props: {
    cours: {
      type: Array,
      required: true
    }
  },
  data: function () {
    return {
      isExpanded: false,
      localCours: []
    }
  },
  computed: {
    sortedCours () {
      return PentilaUtils.Array.sortWithString(this.localCours, false, 'groupName')
    }
  },
  created () {
    this.localCours = PentilaUtils.JSON.deepCopy(this.cours)
  },
  methods: {
    toggleCour (cour) {
      for (let i = 0; i < this.localCours.length; i++) {
        const aCours = this.localCours[i]
        if (aCours.groupName === cour.groupName) {
          aCours.isExpanded = !aCours.isExpanded
        }
      }
    },
    getMembers (population) {
      this.$store.dispatch('contact/getMembers', population)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';
.cours-header {
  display: flex;
  justify-content: space-between;
  &:hover {
    background-color: lightgray;
  }
}
.cour-header {
  display: flex;
  justify-content: space-between;
  &:hover {
    background-color: lightgray;
  }
}
.cours {
  margin-left: 10px;
}
.population {
  margin-left: 10px;
  &:hover {
    cursor: pointer;
    background-color: lightgray;
  }
}
</style>

<i18n locale="fr">
  {
    "cours": "Cours"
  }
</i18n>
