<template>
  <AddressBookItem
    :title="$t('subjects')"
    :is-theme-color="true"
  >
    <AddressBookItem
      v-for="subject in sortedSubjects"
      :key="subject.orgId"
      :title="subject.groupName"
      :is-leaf="true"
      @select="getMembers(subject)"
    />
  </AddressBookItem>
</template>

<script>

import PentilaUtils from 'pentila-utils'
import AddressBookItem from '@components/ContactPicker/AddressBookItem.vue'

export default {
  name: 'SchoolSubjects',
  components: {
    AddressBookItem
  },
  inject: ['mq'],
  props: {
    subjects: {
      type: Array,
      required: true
    }
  },
  computed: {
    sortedSubjects () {
      return PentilaUtils.Array.sortWithString(this.subjects, false, 'groupName')
    }
  },
  methods: {
    getMembers (subject) {
      this.$store.dispatch('contact/getMembers', subject)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';
</style>

<i18n locale="fr">
  {
    "subjects": "Disciplines"
  }
</i18n>
