<template>
  <AddressBookItem
    :title="$t('communities')"
    :icon="require('@/assets/icons/communities.svg')"
  >
    <AddressBookItem
      v-for="community in communities"
      :key="community.groupName"
      :title="community.groupName"
      :is-leaf="true"
      @select="getMembers(community)"
    />
  </AddressBookItem>
</template>

<script>
import AddressBookItem from '@components/ContactPicker/AddressBookItem.vue'

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
    }
  },
  data: function () {
    return {
      isExpanded: false
    }
  },
  computed: {
  },
  methods: {
    getMembers (community) {
      this.$store.dispatch('contact/getCommunityMembers', community.groupId)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

<i18n locale="fr">
  {
    "communities": "Communautés"
  }
</i18n>
