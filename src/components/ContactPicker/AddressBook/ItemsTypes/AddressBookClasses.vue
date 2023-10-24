<template>
  <AddressBookItem
    :title="$t('classes')"
    :is-theme-color="true"
    :begin-extended="classes.isExpanded"
  >
    <AddressBookItem
      v-for="volee in sortedVolees"
      :key="volee.groupName"
      :title="volee.groupName"
    >
      <AddressBookItem
        v-for="classe in sortedClasses(volee)"
        :key="classe.groupName"
        :title="classe.groupName"
      >
        <AddressBookItem
          v-for="population in sortedPopulations(classe)"
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
  </AddressBookItem>
</template>

<script>
import AddressBookItem from '@components/ContactPicker/AddressBook/AddressBookItem.vue'
import WeprodeUtils from '@utils/weprode.utils'

export default {
  name: 'AddressBookClasses',
  components: {
    AddressBookItem
  },
  inject: ['mq'],
  props: {
    classes: {
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
      localVolees: []
    }
  },
  computed: {
    sortedVolees () {
      return WeprodeUtils.sortArrayWithString(this.localVolees, false, 'groupName')
    }
  },
  created () {
    this.localVolees = WeprodeUtils.deepCopy(this.classes.volees)
  },
  methods: {
    sortedClasses (volee) {
      return WeprodeUtils.sortArrayWithString(volee.classes, false, 'groupName')
    },
    sortedPopulations (classe) {
      return WeprodeUtils.sortArrayWithString(classe.populations, false, 'populationName')
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

<i18n locale="fr">
  {
    "classes": "Classes"
  }
</i18n>
