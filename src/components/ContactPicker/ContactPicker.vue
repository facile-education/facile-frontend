<template>
  <div
    class="container"
    :class="{'phone': mq.phone}"
  >
    <div
      class="left"
      :class="{'contains-tabs': hasAdvancedSearchPanel}"
    >
      <PentilaTabList v-if="hasAdvancedSearchPanel">
        <PentilaTabItem
          :title="$t('addressBook')"
          :icon="require('@assets/icons/communities.svg')"
        >
          <AddressBook
            :selected-lists="selectedLists"
            :max-height="maxHeight"
            :min-height="minHeight"
            class="contains-tabs"
            @addContacts="$emit('addContacts', $event)"
            @removeContacts="$emit('removeContacts', $event)"
          />
        </PentilaTabItem>
        <PentilaTabItem
          :title="$t('advancedSearch')"
          :icon="require('@assets/icons/contact-book.svg')"
        >
          <ContactAdvancedSearch
            :min-height="minHeight"
          />
        </PentilaTabItem>
      </PentilaTabList>

      <!-- Do not display tab list if only one tab -->
      <AddressBook
        v-else
        :selected-lists="selectedLists"
        :max-height="maxHeight"
        :min-height="minHeight"
        @addContacts="$emit('addContacts', $event)"
        @removeContacts="$emit('removeContacts', $event)"
      />
    </div>

    <ContactUserList
      class="user-list"
      :class="{'collapsed': (mq.phone && !isMobileUserListDisplayed)}"
      :max-height="maxHeight"
      :selected-users="selectedUsers"
      @addContacts="$emit('addContacts', $event)"
      @removeContacts="$emit('removeContacts', $event)"
    />
  </div>
</template>

<script>
import ContactAdvancedSearch from '@components/ContactPicker/AdvancedSearch/ContactAdvancedSearch.vue'
import ContactUserList from '@components/ContactPicker/UserList/ContactUserList.vue'
import AddressBook from '@components/ContactPicker/AddressBook/AddressBook.vue'

export default {
  name: 'ContactPicker',
  components: { AddressBook, ContactUserList, ContactAdvancedSearch },
  inject: ['mq'],
  props: {
    selectedContacts: {
      type: Array,
      required: true
    },
    maxHeight: {
      type: String,
      default: '70vh'
    },
    minHeight: {
      type: String,
      default: '20vh'
    }
  },
  emits: ['addContacts', 'removeContacts'],
  computed: {
    hasAdvancedSearchPanel () {
      return !this.$store.state.user.isStudent && !this.$store.state.user.isParent
    },
    selectedUsers () {
      return this.selectedContacts.filter((contact) => contact.userId !== undefined)
    },
    selectedLists () {
      return this.selectedContacts.filter((contact) => contact.userId === undefined)
    },
    isMobileUserListDisplayed () {
      return this.$store.state.contact.isMobileUserListDisplayed
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;

  .user-list {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    transition: all .4s ease-in-out;

    &.collapsed {
      transform: translateX(100vw);
    }
  }
}

.container:not(.phone) {
  display: flex;

  .user-list {
    position: relative;
  }

  .left {
    &.contains-tabs {
      margin-top: 13px;
    }
  }

  .left, .user-list {
    width: 50%;
  }
}
</style>

<i18n locale="fr" >
{
  "addressBook": "Carnet d'adresses",
  "advancedSearch": "Annuaire"
}
</i18n>