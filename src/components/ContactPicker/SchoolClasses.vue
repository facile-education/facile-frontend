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
          v-for="population in classe.populations"
          :key="population.populationName"
          :title="population.populationName"
          :is-leaf="true"
          @select="getMembers(population)"
        />
      </AddressBookItem>
    </AddressBookItem>
  </AddressBookItem>
</template>

<script>
import PentilaUtils from 'pentila-utils'
import AddressBookItem from '@components/ContactPicker/AddressBookItem.vue'

export default {
  name: 'SchoolClasses',
  components: {
    AddressBookItem
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
