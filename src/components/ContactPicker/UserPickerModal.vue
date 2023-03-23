<template>
  <div>
    <PentilaWindow
      :modal="true"
      :is-full-screen="mq.phone"
      data-test="userPickerModal"
      class="user-picker-modal"
      :class="{'phone': mq.phone}"
      @close="onClose"
    >
      <template #header>
        <span v-t="'userPickerTitle'" />
      </template>

      <template #body>
        <div
          v-if="mq.phone"
          class="mainPanel"
        >
          <PentilaTabList>
            <PentilaTabItem :title="$t('address-book')">
              <AddressBook />
            </PentilaTabItem>
            <PentilaTabItem
              v-if="hasDirectory"
              :title="$t('directory')"
            >
              <Directory />
            </PentilaTabItem>
          </PentilaTabList>
        </div>
        <div
          v-else
          class="desktop"
        >
          <div class="left">
            <PentilaTabList>
              <PentilaTabItem :title="$t('address-book')">
                <AddressBook />
              </PentilaTabItem>
              <PentilaTabItem
                v-if="hasDirectory"
                :title="$t('directory')"
              >
                <Directory />
              </PentilaTabItem>
            </PentilaTabList>
          </div>
          <div class="right">
            <ResultPanel
              @addContact="addContact"
              @removeContact="removeContact"
            />
          </div>
        </div>
      </template>
    </PentilaWindow>
  </div>
</template>

<script>
import AddressBook from './AddressBook.vue'
import Directory from './Directory.vue'
import ResultPanel from './ResultPanel.vue'

export default {
  name: 'UserPickerModal',
  components: {
    AddressBook,
    Directory,
    ResultPanel
  },
  inject: ['mq'],
  props: {
  },
  emits: ['close', 'addContact', 'removeContact'],
  data () {
    return {
      recipients: []
    }
  },
  computed: {
    hasDirectory () {
      return !this.$store.state.user.isStudent && !this.$store.state.user.isParent
    }
  },
  created () {
  },
  methods: {
    onClose () {
      this.$store.dispatch('misc/decreaseModalCount')
      this.$emit('close')
    },
    addContact (contact) {
      console.log('add contact ' + contact.lastName)
      this.$emit('addContact', contact)
    },
    removeContact (contact) {
      console.log('remove contact ' + contact.lastName)
      this.$emit('removeContact', contact)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.user-picker-modal {
  height: 800px;
}
.desktop {
  display: flex;
  .left, .right {
    width: 50%;
    padding: 10px;
    border: 1px solid black;
  }
}

</style>

<i18n locale="fr">
{
  "userPickerTitle": "Sélection de contact",
  "address-book": "Carnet d'adresses",
  "directory": "Annuaire"
}
</i18n>
