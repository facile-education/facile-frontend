<template>
  <AddressBookItem
    :title="school.schoolName"
    :icon="require('@/assets/icons/school.svg')"
    :begin-extended="school.isExpanded"
  >
    <SchoolPersonals
      v-if="school.Personnels"
      :populations="school.Personnels"
      :selected-lists="selectedLists"
      @addContacts="$emit('addContacts', $event)"
      @removeContacts="$emit('removeContacts', $event)"
    />
    <SchoolClasses
      v-if="school.classes"
      :classes="school.classes"
      :selected-lists="selectedLists"
      @addContacts="$emit('addContacts', $event)"
      @removeContacts="$emit('removeContacts', $event)"
    />
    <SchoolCours
      v-if="school.cours"
      :courses="school.cours"
      :selected-lists="selectedLists"
      @addContacts="$emit('addContacts', $event)"
      @removeContacts="$emit('removeContacts', $event)"
    />
    <SchoolSubjects
      v-if="school.subjects"
      :subjects="school.subjects"
    />
  </AddressBookItem>
</template>

<script>
import SchoolPersonals from '@components/ContactPicker/SchoolPersonals.vue'
import SchoolClasses from '@components/ContactPicker/SchoolClasses.vue'
import SchoolCours from '@components/ContactPicker/SchoolCours.vue'
import SchoolSubjects from '@components/ContactPicker/SchoolSubjects.vue'
import AddressBookItem from '@components/ContactPicker/AddressBookItem.vue'

export default {
  name: 'AddressBookSchool',
  components: { AddressBookItem, SchoolSubjects, SchoolCours, SchoolClasses, SchoolPersonals },
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
  emits: ['addContacts', 'removeContacts']
}
</script>

<style lang="scss" scoped>

</style>
