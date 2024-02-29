<template>
  <WeprodeWindow
    :modal="true"
    :hidden-footer="true"
    :draggable="true"
    :width="500"
    class="userCardModal"
    @close="onClose"
    @click.stop
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
  methods: {
    onClose () {
      this.$store.dispatch('userCard/initUserCard', undefined)
    }
  }
}
</script>
