<template>
  <section
    class="address-book"
    :style="'max-height: ' + maxHeight + '; min-height: ' + minHeight"
  >
    <div
      v-if="isLoadingContactTree"
      class="placeholder"
    >
      <WeprodeSpinner />
    </div>
    <div
      v-else-if="error"
      v-t="'errorPlaceholder'"
      class="placeholder"
    />
    <div v-else>
      <AddressBookSchool
        v-for="(school) in schools"
        :key="school.schoolOrgId"
        :school="school"
        :selected-lists="selectedLists"
        @add-contacts="$emit('addContacts', $event)"
        @remove-contacts="$emit('removeContacts', $event)"
      />
      <!-- Dedicated component for the list because this list can be folded-->
      <AddressBookCommunities
        v-if="communities.length > 0"
        :communities="communities"
        :selected-lists="selectedLists"
        @add-contacts="$emit('addContacts', $event)"
        @remove-contacts="$emit('removeContacts', $event)"
      />
    </div>
  </section>
</template>

<script>
import AddressBookCommunities from '@components/ContactPicker/AddressBook/ItemsTypes/AddressBookCommunities.vue'
import AddressBookSchool from '@components/ContactPicker/AddressBook/ItemsTypes/AddressBookSchool.vue'

import { getContactTree } from '@/api/contact.service'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'

export default {
  name: 'AddressBook',
  components: { AddressBookSchool, AddressBookCommunities, WeprodeSpinner },
  props: {
    selectedLists: {
      type: Array,
      required: true
    },
    maxHeight: {
      type: String,
      default: undefined
    },
    minHeight: {
      type: String,
      default: undefined
    }
  },
  emits: ['addContacts', 'removeContacts'],
  data () {
    return {
      categories: [],
      isLoadingContactTree: false,
      error: undefined
    }
  },
  computed: {
    schools () {
      return this.categories.filter((category) => category.schoolOrgId !== 0)
    },
    communities () {
      const communitiesItem = this.categories.find((category) => category.schoolOrgId === 0)
      return communitiesItem ? communitiesItem.groups : []
    }
  },
  created () {
    this.getContactTree()
    this.$store.dispatch('contact/resetUserList')
    this.$store.dispatch('contact/setActiveTab', 'addressBook')
  },
  methods: {
    getContactTree () {
      this.isLoadingContactTree = true
      getContactTree().then((data) => {
        this.isLoadingContactTree = false
        if (data.success) {
          this.categories = data.categories
        } else {
          this.error = true
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.address-book {
  position: relative;
  overflow-y: auto;
}

.contains-tabs {
  margin-top: 5px;
}

.placeholder {
  height: 20vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.25em;
}
</style>

<i18n locale="fr">
{
  "errorPlaceholder": "Oups, une erreur est survenue..."
}
</i18n>
