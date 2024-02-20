<template>
  <section
    class="user-list"
    :class="{'phone': mq.phone}"
  >
    <ContactUserListHeader
      :user-list-length="userList ? userList.length : 0"
      :is-all-list-selected="isAllListSelected"
      @update-filter="updateFilter"
      @toggle-all="toggleAll"
    />
    <div
      v-if="isLoadingUserList"
      class="placeholder"
    >
      <WeprodeSpinner />
    </div>
    <div
      v-else-if="error"
      v-t="'ContactPicker.ContactUserList.errorPlaceholder'"
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
    <div
      v-else
      class="user-list-container"
    >
      <ul :style="'max-height: ' + maxHeight">
        <li
          v-for="user in sortedUserList"
          :key="user.userId"
        >
          <ContactUserListItem
            :selected-users="selectedUsers"
            :user="user"
            @add-contact="addContact"
            @remove-contact="removeContact"
          />
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import ContactUserListHeader from '@components/ContactPicker/UserList/ContactUserListHeader.vue'
import ContactUserListItem from '@components/ContactPicker/UserList/ContactUserListItem.vue'
import { getFullName } from '@utils/commons.util'
import WeprodeUtils from '@utils/weprode.utils'

import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'

export default {
  name: 'ContactUserList',
  components: { ContactUserListItem, ContactUserListHeader, WeprodeSpinner },
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
          return getFullName(user).normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().includes(this.filter.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase())
        })
        : []
    },
    sortedUserList () {
      return WeprodeUtils.sortArrayWithString(this.filteredUserList, false, 'text')
    },
    isAllListSelected () {
      if (this.filteredUserList.length > 0) {
        for (const filteredUser of this.filteredUserList) {
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
        this.$emit('removeContacts', this.filteredUserList)
      } else {
        const contactsToAdd = []
        for (const filteredUser of this.filteredUserList) {
          if (this.selectedUsers.map(user => user.userId).indexOf(filteredUser.userId) === -1) { // if user is not selected
            contactsToAdd.push(filteredUser)
          }
        }
        this.$emit('addContacts', contactsToAdd)
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

  &.phone {
    height: 100%;

    .user-list-container {
      margin-top: 10px;
      height: calc(100% - 60px);
    }
  }

  &:not(.phone) {
    padding-left: 1rem;
  }
}

ul {
  margin: 0;
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
