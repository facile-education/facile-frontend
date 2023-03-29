<template>
  <AddressBookItem
    :title="$t('courses')"
    :is-theme-color="true"
    :begin-extended="courses.isExpanded"
  >
    <AddressBookItem
      v-for="course in sortedCourses"
      :key="course.groupName"
      :title="course.groupName"
    >
      <AddressBookItem
        v-for="population in course.populations"
        :key="population.populationName"
        :title="population.populationName"
        :is-leaf="true"
        @select="getMembers(population)"
      />
    </AddressBookItem>
  </AddressBookItem>
</template>

<script>

import PentilaUtils from 'pentila-utils'
import AddressBookItem from '@components/ContactPicker/AddressBookItem.vue'

export default {
  name: 'SchoolCours',
  components: {
    AddressBookItem
  },
  inject: ['mq'],
  props: {
    courses: {
      type: Object,
      required: true
    }
  },
  data: function () {
    return {
      localCourses: []
    }
  },
  computed: {
    sortedCourses () {
      return PentilaUtils.Array.sortWithString(this.localCourses, false, 'groupName')
    }
  },
  created () {
    this.localCourses = PentilaUtils.JSON.deepCopy(this.courses.cours)
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
</style>

<i18n locale="fr">
  {
    "courses": "Cours"
  }
</i18n>
