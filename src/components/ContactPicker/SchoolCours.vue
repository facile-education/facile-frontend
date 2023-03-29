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
        v-for="population in sortedPopulations(course)"
        :key="population.populationName"
        :title="population.populationName"
        :is-leaf="true"
        :is-selected="isSelected(population)"
        @add="addContacts(population)"
        @remove="removeContacts(population)"
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
    },
    selectedLists: {
      type: Array,
      required: true
    }
  },
  emits: ['addContacts', 'removeContacts'],
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
    sortedPopulations (course) {
      return PentilaUtils.Array.sortWithString(course.populations, false, 'populationName')
    },
    isSelected (population) {
      return this.selectedLists.map(list => list.id).indexOf(this.formatContact(population).id) !== -1
    },
    getMembers (population) {
      this.$store.dispatch('contact/getMembers', population)
    },
    formatContact (population) {
      const formattedContact = { ...population }
      formattedContact.id = Number(String(population.orgId) + String(population.roleId)) // Concat the two primary keys. TODO: backend returned field?
      formattedContact.text = population.groupName
      return formattedContact
    },
    addContacts (population) {
      this.$emit('addContacts', [this.formatContact(population)])
    },
    removeContacts (population) {
      this.$emit('removeContacts', [this.formatContact(population)])
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
