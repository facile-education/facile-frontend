<template>
  <AddressBookItem
    :title="$t('personals')"
    :is-theme-color="true"
  >
    <AddressBookItem
      v-for="population in populations"
      :key="population.rolelId"
      :title="population.groupName"
      :is-leaf="true"
      @select="getMembers(population)"
    />
  </AddressBookItem>
</template>

<script>

import AddressBookItem from '@components/ContactPicker/AddressBookItem.vue'

export default {
  name: 'SchoolPersonals',
  components: {
    AddressBookItem
  },
  props: {
    populations: {
      type: Array,
      required: true
    }
  },
  methods: {
    getMembers (population) {
      this.$store.dispatch('contact/getMembers', population)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

<i18n locale="fr">
  {
    "personals": "Personnels"
  }
</i18n>
