<template>
  <AddressBookItem
    :title="$t('ContactPicker.AddressBookPersonals.personals')"
    :is-theme-color="true"
  >
    <AddressBookItem
      v-for="population in sortedPopulations"
      :key="population.rolelId"
      :title="population.groupName"
      :is-leaf="true"
      :is-selected="isSelected(population)"
      @add="addContacts(population)"
      @remove="removeContacts(population)"
      @select="getMembers(population)"
    />
  </AddressBookItem>
</template>

<script>

import AddressBookItem from '@components/ContactPicker/AddressBook/AddressBookItem.vue'
import WeprodeUtils from '@utils/weprode.utils'

export default {
  name: 'AddressBookPersonals',
  components: {
    AddressBookItem
  },
  props: {
    populations: {
      type: Array,
      required: true
    },
    selectedLists: {
      type: Array,
      required: true
    }
  },
  emits: ['addContacts', 'removeContacts'],
  computed: {
    sortedPopulations () {
      return WeprodeUtils.sortArrayWithString(this.populations, false, 'groupName')
    }
  },
  methods: {
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
</style>
