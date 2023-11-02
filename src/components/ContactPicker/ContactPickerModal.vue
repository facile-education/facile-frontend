<template>
  <WeprodeWindow
    :modal="true"
    :full-screen="mq.phone || mq.tablet"
    :hidden-footer="true"
    :draggable="true"
    data-test="contactPickerModal"
    @close="onClose"
  >
    <template #header>
      <h1 v-t="'header'" />
    </template>

    <template #body>
      <ContactPicker
        :max-height="mq.phone ? '100%' : undefined"
        :selected-contacts="selectedContacts"
        @add-contacts="$emit('addContacts', $event)"
        @remove-contacts="$emit('removeContacts', $event)"
      />
    </template>
  </WeprodeWindow>
</template>

<script>
import ContactPicker from '@components/ContactPicker/ContactPicker.vue'

import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'
export default {
  name: 'ContactPickerModal',
  components: { ContactPicker, WeprodeWindow },
  inject: ['mq'],
  props: {
    selectedContacts: {
      type: Array,
      required: true
    }
  },
  emits: ['addContacts', 'removeContacts', 'close'],
  created () {
    this.$store.dispatch('misc/incrementModalCount')
  },
  methods: {
    onClose () {
      this.$store.dispatch('contact/resetContactStore')
      this.$store.dispatch('misc/decreaseModalCount')
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

</style>

<i18n locale="fr">
{
  "header": "Sélection de contact"
}
</i18n>
