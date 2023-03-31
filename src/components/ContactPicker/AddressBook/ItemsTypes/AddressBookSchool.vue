<template>
  <AddressBookItem
    :title="school.schoolName"
    :icon="require('@assets/icons/school.svg')"
    :begin-extended="school.isExpanded"
  >
    <AddressBookPersonals
      v-if="school.Personnels"
      :populations="school.Personnels"
      :selected-lists="selectedLists"
      @addContacts="$emit('addContacts', $event)"
      @removeContacts="$emit('removeContacts', $event)"
    />
    <AddressBookClasses
      v-if="school.classes"
      :classes="school.classes"
      :selected-lists="selectedLists"
      @addContacts="$emit('addContacts', $event)"
      @removeContacts="$emit('removeContacts', $event)"
    />
    <AddressBookCourses
      v-if="school.cours"
      :courses="school.cours"
      :selected-lists="selectedLists"
      @addContacts="$emit('addContacts', $event)"
      @removeContacts="$emit('removeContacts', $event)"
    />
    <!-- Students and parents have student and parents lists -->
    <AddressBookItem
      v-if="isStudent || isParent"
      :title="isStudent ? $t('myClass') : $t('myStudents')"
      :is-leaf="true"
      :is-a-selectable-leaf="false"
      @select="getMyStudents()"
    />
    <AddressBookItem
      v-if="isStudent || isParent"
      :title="isStudent ? $t('myRelatives') : $t('relatives')"
      :is-leaf="true"
      :is-a-selectable-leaf="false"
      @select="getMyRelatives()"
    />
  </AddressBookItem>
</template>

<script>
import AddressBookPersonals from '@components/ContactPicker/AddressBook/ItemsTypes/AddressBookPersonals.vue'
import AddressBookClasses from '@components/ContactPicker/AddressBook/ItemsTypes/AddressBookClasses.vue'
import AddressBookCourses from '@components/ContactPicker/AddressBook/ItemsTypes/AddressBookCourses.vue'
import AddressBookItem from '@components/ContactPicker/AddressBook/AddressBookItem.vue'

export default {
  name: 'AddressBookSchool',
  components: { AddressBookItem, AddressBookCourses, AddressBookClasses, AddressBookPersonals },
  props: {
    school: {
      type: Object,
      required: true
    },
    selectedLists: {
      type: Array,
      required: true
    }
  },
  emits: ['addContacts', 'removeContacts'],
  computed: {
    isStudent () {
      return this.$store.state.user.isStudent
    },
    isParent () {
      return this.$store.state.user.isParent
    }
  },
  methods: {
    getMyStudents () {
      this.$store.dispatch('contact/getMyStudents')
    },
    getMyRelatives () {
      this.$store.dispatch('contact/getMyRelatives')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

<i18n locale="fr">
{
  "myClass": "Ma classe",
  "myStudents": "Elèves en responsabilité",
  "relatives": "Responsables légaux",
  "myRelatives": "Mes responsables légaux"
}
</i18n>
