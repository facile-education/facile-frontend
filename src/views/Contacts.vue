<template>
  <div>
    <ContactsToolbar />
    <ContactList />
  </div>
</template>

<script>
import ContactList from '@/components/Contacts/ContactList'
import ContactsToolbar from '@/components/Contacts/ContactsToolbar'

export default {
  name: 'Contacts',
  components: {
    ContactList,
    ContactsToolbar
  }
}
</script>

<style lang="scss" scoped>

</style>
