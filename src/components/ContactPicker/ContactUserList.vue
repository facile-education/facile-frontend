<template>
  <section class="user-list">
    <ContactUserListHeader class="header" />
    <div
      v-if="isLoadingUserList"
      class="placeholder"
    >
      <PentilaSpinner />
    </div>
    <div
      v-else-if="error"
      v-t="'errorPlaceholder'"
      class="placeholder"
    />
    <div
      v-else-if="userList.length === 0"
      v-t="'emptyPlaceholder'"
      class="placeholder"
    />
    <ul v-else>
      <ContactUserListItem
        v-for="user in userList"
        :key="user.userId"
        :selected-users="selectedUsers"
        :user="user"
        @addContact="addContact"
        @removeContact="removeContact"
      />
    </ul>
  </section>
</template>

<script>
import ContactUserListHeader from '@components/ContactPicker/ContactUserListHeader.vue'
import ContactUserListItem from '@components/ContactPicker/ContactUserListItem.vue'

export default {
  name: 'ContactUserList',
  components: { ContactUserListItem, ContactUserListHeader },
  props: {
    selectedUsers: {
      type: Array,
      required: true
    }
  },
  emits: ['addContacts', 'removeContacts'],
  computed: {
    isLoadingUserList () {
      return this.$store.state.contact.isLoadingUsers
    },
    error () {
      return this.$store.state.contact.userListError
    },
    userList () {
      return this.$store.state.contact.userList
    }
  },
  methods: {
    addContact (user) {
      this.$emit('addContacts', [user])
    },
    removeContact (user) {
      this.$emit('removeContacts', [user])
    }
  }
}
</script>

<style lang="scss" scoped>
.user-list {
  position: relative;
  padding-left: 1rem;
  width: 100%;
  background-color: white;
}

.header {
  height: 32px;
}

ul {
  margin:  10px 0 0 0;
  padding: 0;
  list-style-type: none;
  max-height: 70vh;
  overflow-y: auto;
}

.placeholder {
  height: 20vh;
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 20%;
  font-size: 1rem;
}
</style>

<i18n locale="fr" >
{
  "emptyPlaceholder": "Liste vide",
  "errorPlaceholder": "Oups, une erreur est survenue..."
}
</i18n>
