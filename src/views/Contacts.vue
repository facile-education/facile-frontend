<template>
  <div>
    <ContactsToolbar />
    <ContactList />
  </div>
</template>

<script>
import contactsStore from '@/store/modules/contacts.store'

import ContactList from '@/components/Contacts/ContactList'
import ContactsToolbar from '@/components/Contacts/ContactsToolbar'

export default {
  name: 'Contacts',
  components: {
    ContactList,
    ContactsToolbar
  },
  beforeCreate () {
    this.$store.registerModule('contacts', contactsStore)
  },
  destroyed () {
    this.$store.unregisterModule('contacts')
  }
}
</script>

<style lang="scss" scoped>

</style>
