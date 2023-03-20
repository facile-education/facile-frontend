<template>
  <div
    class="classes-header"
    @click="toggleClasses()"
  >
    {{ $t('classes') }}
    <div class="caret">
      <FontAwesomeIcon
        v-if="isExpanded"
        icon="caret-up"
      />
      <FontAwesomeIcon
        v-else
        icon="caret-down"
      />
    </div>
  </div>
  <div
    v-if="isExpanded"
    class="volees"
  >
    <div
      v-for="volee in sortedVolees"
      :key="volee.groupName"
      class="volee"
    >
      <div
        class="volee-header"
        @click="toggleVolee(volee)"
      >
        <span>{{ volee.groupName }}</span>
        <div class="caret">
          <FontAwesomeIcon
            v-if="volee.isExpanded"
            icon="caret-up"
          />
          <FontAwesomeIcon
            v-else
            icon="caret-down"
          />
        </div>
      </div>
      <div
        v-if="volee.isExpanded"
        class="volee"
      >
        <div
          v-for="classe in sortedClasses(volee)"
          :key="classe.groupName"
        >
          <div
            class="classe-header"
            @click="classe.isExpanded = !classe.isExpanded"
          >
            <span>{{ classe.groupName }}</span>
            <div class="caret">
              <FontAwesomeIcon
                v-if="classe.isExpanded"
                icon="caret-up"
              />
              <FontAwesomeIcon
                v-else
                icon="caret-down"
              />
            </div>
          </div>
          <div
            v-if="classe.isExpanded"
            class="classe"
          >
            <div
              v-for="population in classe.populations"
              :key="population.populationName"
              class="population"
              @click="getMembers(population)"
            >
              <span>{{ population.groupName }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import PentilaUtils from 'pentila-utils'

export default {
  name: 'SchoolClasses',
  components: {
    FontAwesomeIcon
  },
  inject: ['mq'],
  props: {
    classes: {
      type: Object,
      required: true
    }
  },
  data: function () {
    return {
      isExpanded: true,
      localVolees: []
    }
  },
  computed: {
    sortedVolees () {
      return PentilaUtils.Array.sortWithString(this.localVolees, false, 'groupName')
    }
  },
  created () {
    this.localVolees = PentilaUtils.JSON.deepCopy(this.classes.volees)
  },
  methods: {
    sortedClasses (volee) {
      return PentilaUtils.Array.sortWithString(volee.classes, false, 'groupName')
    },
    getMembers (population) {
      this.$store.dispatch('contact/getMembers', population)
    },
    toggleClasses () {
      this.isExpanded = !this.isExpanded
    },
    toggleVolee (volee) {
      for (let i = 0; i < this.localVolees.length; i++) {
        const aVolee = this.localVolees[i]
        if (aVolee.groupName === volee.groupName) {
          aVolee.isExpanded = !aVolee.isExpanded
        }
      }
    },
    toggleClasse (classe) {
      for (let i = 0; i < this.localVolees.length; i++) {
        const aVolee = this.localVolees[i]
        for (let j = 0; j < aVolee.classes.length; j++) {
          const aClass = aVolee.classes[j]
          if (aClass.groupName === classe.groupName) {
            aClass.isExpanded = !aClass.isExpanded
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';
.classes-header {
  display: flex;
  justify-content: space-between;
  &:hover {
    background-color: lightgray;
  }
}
.volee {
  margin-left: 10px;
}
.volee-header {
  display: flex;
  justify-content: space-between;
  &:hover {
    background-color: lightgray;
  }
}
.classe-header {
  display: flex;
  justify-content: space-between;
  &:hover {
    background-color: lightgray;
  }
}
.classe {
  margin-left: 10px;
}
.population {
  &:hover {
    cursor: pointer;
    background-color: lightgray;
  }
}
</style>

<i18n locale="fr">
  {
    "classes": "Classes"
  }
</i18n>
