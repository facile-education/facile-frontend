<template>
  <section
    class="user-list"
    :class="{'phone': mq.phone}"
  >
    <ContactUserListHeader
      :user-list-length="userList ? userList.length : 0"
      :is-all-list-selected="isAllListSelected"
      @updateFilter="updateFilter"
      @toggle-all="toggleAll"
    />
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
      v-else-if="!userList"
      v-t="activeTab === 'addressBook' ? 'addressBookPlaceholder' : 'advancedSearchPlaceholder'"
      class="placeholder"
    />
    <div
      v-else-if="userList.length === 0"
      v-t="activeTab === 'addressBook' ? 'addressBookEmptyPlaceholder': 'advancedSearchEmptyPlaceholder'"
      class="placeholder"
    />
    <ul
      v-else
      :style="'max-height: ' + maxHeight"
    >
      <ContactUserListItem
        v-for="user in sortedUserList"
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
import ContactUserListHeader from '@components/ContactPicker/UserList/ContactUserListHeader.vue'
import ContactUserListItem from '@components/ContactPicker/UserList/ContactUserListItem.vue'
import PentilaUtils from 'pentila-utils'

export default {
  name: 'ContactUserList',
  components: { ContactUserListItem, ContactUserListHeader },
  inject: ['mq'],
  props: {
    selectedUsers: {
      type: Array,
      required: true
    },
    maxHeight: {
      type: String,
      default: undefined
    }
  },
  emits: ['addContacts', 'removeContacts'],
  data () {
    return {
      filter: ''
    }
  },
  computed: {
    isLoadingUserList () {
      return this.$store.state.contact.isLoadingUsers
    },
    error () {
      return this.$store.state.contact.userListError
    },
    userList () {
      return this.$store.state.contact.userList
    },
    activeTab () {
      return this.$store.state.contact.activeTab
    },
    filteredUserList () {
      return this.userList
        ? this.userList.filter((user) => {
          return user.fullName.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().includes(this.filter.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase())
        })
        : []
    },
    sortedUserList () {
      return PentilaUtils.Array.sortWithString(this.filteredUserList, false, 'fullName')
    },
    isAllListSelected () {
      if (this.filteredUserList.length > 0) {
        for (let i = 0; i < this.filteredUserList.length; i++) {
          const filteredUser = this.filteredUserList[i]
          if (this.selectedUsers.map(user => user.userId).indexOf(filteredUser.userId) === -1) {
            return false
          }
        }
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    updateFilter (newValue) {
      this.filter = newValue
    },
    toggleAll () {
      if (this.isAllListSelected) {
        // TODO: Remove formatting when back-end will return good data
        const formattedContactsToRemove = this.filteredUserList.map((user) => {
          const formattedContact = { ...user }
          formattedContact.id = user.userId
          formattedContact.text = user.fullName
          return formattedContact
        })
        this.$emit('removeContacts', formattedContactsToRemove)
      } else {
        const contactsToAdd = []
        for (let i = 0; i < this.filteredUserList.length; i++) {
          const filteredUser = this.filteredUserList[i]
          if (this.selectedUsers.map(user => user.userId).indexOf(filteredUser.userId) === -1) { // if user is not selected
            contactsToAdd.push(filteredUser)
          }
        }
        // TODO: Remove formatting when back-end will return good data
        const formattedContactsToAdd = contactsToAdd.map((user) => {
          const formattedContact = { ...user }
          formattedContact.id = user.userId
          formattedContact.text = user.fullName
          return formattedContact
        })
        this.$emit('addContacts', formattedContactsToAdd)
      }
    },
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
  width: 100%;
  background-color: white;

  &:not(.phone) {
    padding-left: 1rem;
  }
}

ul {
  margin:  10px 0 0 0;
  padding: 0;
  list-style-type: none;
  overflow-y: auto;
}

.placeholder {
  height: 20vh;
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 20%;
  font-size: 1rem;
  text-align: center;
}
</style>

<i18n locale="fr" >
{
  "addressBookEmptyPlaceholder": "Aucun contact",
  "advancedSearchEmptyPlaceholder": "Aucun contact ne correspond à la recherche",
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "addressBookPlaceholder": "Sélectionner une liste pour afficher les contacts",
  "advancedSearchPlaceholder": "Effectuer une recherche pour afficher des contacts"
}
</i18n>
