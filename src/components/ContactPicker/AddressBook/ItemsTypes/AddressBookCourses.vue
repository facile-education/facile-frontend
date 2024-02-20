<template>
  <AddressBookItem
    :title="$t('ContactPicker.AddressBookCourses.courses')"
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

import AddressBookItem from '@components/ContactPicker/AddressBook/AddressBookItem.vue'
import WeprodeUtils from '@utils/weprode.utils'

export default {
  name: 'AddressBookCourses',
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
      return WeprodeUtils.sortArrayWithString(this.courses.cours, false, 'groupName')
    }
  },
  methods: {
    sortedPopulations (course) {
      return WeprodeUtils.sortArrayWithString(course.populations, false, 'populationName')
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
      formattedContact.text = population.populationName
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
</style>
