<template>
  <PentilaWindow
    :modal="true"
    :is-full-screen="mq.phone"
    :hidden-footer="true"
    data-test="contactPickerModal"
    @close="onClose"
  >
    <template #header>
      <h1 v-t="'header'" />
    </template>

    <template #body>
      <div
        class="container"
        :class="{'phone': mq.phone}"
      >
        <div class="left">
          <PentilaTabList>
            <PentilaTabItem :title="$t('addressBook')">
              <ContactAddressBook @setUserList="setUserList" />
            </PentilaTabItem>
            <PentilaTabItem :title="$t('advancedSearch')">
              <ContactAdvancedSearch @setUserList="setUserList" />
            </PentilaTabItem>
          </PentilaTabList>
        </div>

        <ContactUserList
          class="user-list"
          :class="{'collapsed': (mq.phone && !isMobileUserListDisplayed)}"
          :selected-users="selectedUsers"
        />
      </div>
    </template>
  </PentilaWindow>
</template>

<script>
import ContactAddressBook from '@components/ContactPicker/ContactAddressBook.vue'
import ContactAdvancedSearch from '@components/ContactPicker/ContactAdvancedSearch.vue'
import ContactUserList from '@components/ContactPicker/ContactUserList.vue'

export default {
  name: 'ContactPickerModal',
  components: { ContactUserList, ContactAdvancedSearch, ContactAddressBook },
  inject: ['mq'],
  props: {
    selectedContacts: {
      type: Array,
      required: true
    }
  },
  emits: ['close'],
  data () {
    return {
      userList: []
    }
  },
  computed: {
    selectedUsers () {
      return this.selectedContacts.filter((contact) => contact.userId !== undefined)
    },
    isMobileUserListDisplayed () {
      return this.$store.state.contact.isMobileUserListDisplayed
    }
  },
  methods: {
    setUserList (newUserList) {
      this.userList = newUserList
    },
    onClose () {
      this.$store.dispatch('contact/resetContactStore')
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
h1 {
  margin: 0;
  font-size: 1em;
  line-height: 1.25em;
}

.container {
  position: relative;
  overflow-x: hidden;

  .user-list {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    transition: all .3s ease-in-out;

    &.collapsed {
      transform: translateX(100%);
    }
  }
}

.container:not(.phone) {
  display: flex;

  .user-list {
    position: relative;
  }

  .left, .user-list {
    width: 50%;
  }
}

</style>

<i18n locale="fr">
{
  "header": "Sélection de contact",
  "addressBook": "Carnet d'adresses",
  "advancedSearch": "Annuaire"
}
</i18n>
