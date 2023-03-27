<template>
  <div class="results-panel">
    <div
      v-for="contact in searchResults"
      :key="contact.userId"
    >
      <div
        class="contact"
        @click="toggleUserSelection(contact)"
      >
        <span>{{ contact.lastName }} {{ contact.firstName }}</span>
        <PentilaCheckbox
          :model-value="contact.isSelected"
          class="selected"
          label=""
          @update:modelValue="toggleUserSelection(contact)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import PentilaUtils from 'pentila-utils'

export default {
  name: 'ResultPanel',
  components: {
  },
  inject: ['mq'],
  props: {
  },
  emits: ['addContact', 'removeContact'],
  data: function () {
    return {
      roles: []
    }
  },
  computed: {
    searchResults () {
      return PentilaUtils.Array.sortWithString(this.$store.state.contact.userList, false, 'lastName')
    }
  },
  methods: {
    toggleUserSelection (contact) {
      console.log('contact=', contact)
      if (contact.isSelected) {
        this.$emit('addContact', { contact })
      } else {
        this.$emit('removeContact', contact)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';
.results-panel {
  max-height: 600px;;
  overflow-y: auto;
}
.contact {
  display: flex;
  justify-content: space-between;
  &:hover {
    cursor: pointer;
    background-color: lightgray;
  }
}
</style>

<i18n locale="fr">
  {
    "isSelected": "Sélectionné"
  }
</i18n>
