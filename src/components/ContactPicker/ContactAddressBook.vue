<template>
  <section class="address-book">
    <div
      v-if="isLoadingContactTree"
      class="placeholder"
    >
      <PentilaSpinner />
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
        @addContacts="$emit('addContacts', $event)"
        @removeContacts="$emit('removeContacts', $event)"
      />
      <!-- Dedicated component for the list because this list can be folded-->
      <AddressBookCommunities
        v-if="communities.length > 0"
        :communities="communities"
        :selected-lists="selectedLists"
        @addContacts="$emit('addContacts', $event)"
        @removeContacts="$emit('removeContacts', $event)"
      />
    </div>
  </section>
</template>

<script>
import { getContactTree } from '@/api/contact.service'
import AddressBookCommunities from '@components/ContactPicker/AddressBookCommunities.vue'
import AddressBookSchool from '@components/ContactPicker/AddressBookSchool.vue'

export default {
  name: 'ContactAddressBook',
  components: { AddressBookSchool, AddressBookCommunities },
  props: {
    selectedLists: {
      type: Array,
      required: true
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
  min-height: 20vh;
  max-height: 70vh;
  overflow-y: auto;
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

<i18n locale="fr" >
{
  "errorPlaceholder": "Oups, une erreur est survenue..."
}
</i18n>
