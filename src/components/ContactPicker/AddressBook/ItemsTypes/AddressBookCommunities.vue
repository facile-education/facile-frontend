<template>
  <AddressBookItem
    :title="$t('ContactPicker.AddressBookCommunities.communities')"
    :icon="require('@assets/icons/users.svg')"
  >
    <AddressBookItem
      v-for="community in sortedCommunities"
      :key="community.groupName"
      :title="community.groupName"
      :is-leaf="true"
      :is-selected="isSelected(community)"
      @add="addContacts(community)"
      @remove="removeContacts(community)"
      @select="getMembers(community)"
    />
  </AddressBookItem>
</template>

<script>
import AddressBookItem from '@components/ContactPicker/AddressBook/AddressBookItem.vue'
import WeprodeUtils from '@utils/weprode.utils'

export default {
  name: 'AddressBookCommunities',
  components: {
    AddressBookItem
  },
  inject: ['mq'],
  props: {
    communities: {
      type: Array,
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
      isExpanded: false
    }
  },
  computed: {
    sortedCommunities () {
      return WeprodeUtils.sortArrayWithString(this.communities, false, 'groupName')
    }
  },
  methods: {
    isSelected (community) {
      return this.selectedLists.map(list => list.id).indexOf(this.formatContact(community).id) !== -1
    },
    getMembers (community) {
      this.$store.dispatch('contact/getCommunityMembers', community.groupId)
    },
    formatContact (community) {
      const formattedContact = { ...community }
      formattedContact.id = community.groupId
      formattedContact.text = community.groupName
      return formattedContact
    },
    addContacts (community) {
      this.$emit('addContacts', [this.formatContact(community)])
    },
    removeContacts (community) {
      this.$emit('removeContacts', [this.formatContact(community)])
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
