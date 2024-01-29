<template>
  <WeprodeWindow
    :modal="true"
    :hidden-footer="true"
    :draggable="true"
    :width="500"
    class="userCardModal"
    @close="onClose"
  >
    <template #body>
      <UserCard />
    </template>
  </WeprodeWindow>
</template>
<script>
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'
import UserCard from '@/components/UserCard/UserCard.vue'

export default {
  name: 'UserCardModal',
  components: { WeprodeWindow, UserCard },
  emits: ['close'],
  methods: {
    onClose () {
      this.$emit('close')
    }
  }
}
</script>

  <style lang="scss">
  .userCardModal {
    .window-body {
      overflow: hidden !important;
    }
  }
  </style>
