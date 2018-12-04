<template>
  <div>
    <div class="header">
      <div class="info">
        Lastname
      </div>
      <div class="info">
        Firstname
      </div>
      <div class="info">
        Role
      </div>
      <div class="info">
        School
      </div>
    </div>
    <ContactItem
      v-for="contact in contactList"
      :key="contact.userId"
      :contact="contact"
    />
  </div>
</template>

<script>
import ContactItem from '@/components/Contacts/ContactItem'

export default {
  name: 'ContactList',
  components: {
    ContactItem
  },
  computed: {
    contactList () {
      return this.$store.state.contacts.contactList
    }
  },
  created () {
    if (this.contactList === undefined) {
      this.$store.dispatch('contacts/getContactList', {})
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  background-color: orange;
}

.info {
  display: inline-block;
  width: 25%;
  vertical-align: top;
  font-size: 0.8em;
}
</style>
