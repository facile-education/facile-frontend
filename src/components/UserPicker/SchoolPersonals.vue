<template>
  <div
    class="personals-header"
    @click="isExpanded = !isExpanded"
  >
    {{ $t('personals') }}
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
    class="populations"
  >
    <div
      v-for="population in populations"
      :key="population.rolelId"
      class="population"
      @click="getMembers(population)"
    >
      <span>{{ population.groupName }}</span>
    </div>
  </div>
</template>

<script>

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default {
  name: 'SchoolPersonals',
  components: {
    FontAwesomeIcon
  },
  inject: ['mq'],
  props: {
    populations: {
      type: Array,
      required: true
    }
  },
  data: function () {
    return {
      isExpanded: false
    }
  },
  computed: {
  },
  methods: {
    getMembers (population) {
      this.$store.dispatch('contact/getMembers', population)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';
.personals-header {
  display: flex;
  justify-content: space-between;
  &:hover {
    background-color: lightgray;
  }
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
    "personals": "Personnels"
  }
</i18n>
