<template>
  <WeprodeWindow
    :modal="true"
    :draggable="true"
    :full-screen="mq.phone || mq.tablet"
    @close="closeModal"
  >
    <template #header>
      <span>{{ application.applicationName }}</span>
    </template>
    <template #body>
      <div class="details">
        <ApplicationDetails />
      </div>
    </template>

    <template #footer />
  </WeprodeWindow>
</template>

<script>
import { defineAsyncComponent } from 'vue'

import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'
const ApplicationDetails = defineAsyncComponent(() => import('@/components/ApplicationManager/ApplicationDetails'))

export default {
  name: 'ApplicationDetailsModal',
  components: {
    ApplicationDetails,
    WeprodeWindow
  },
  inject: ['mq'],
  emits: ['close'],
  computed: {
    application () {
      return this.$store.state.applicationManager.selectedApplication
    }
  },
  methods: {
    closeModal () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.details {
  display: flex;
  flex-direction: column-reverse;
}
</style>
