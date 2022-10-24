<template>
  <NeroToolbar>
    <PentilaButton
      class="create-button"
      @click="toggleEditGroupModal"
    >
      <NeroIcon
        name="fa-plus"
      />
      <span>{{ $t('add') }}</span>
    </PentilaButton>

    <teleport to="body">
      <EditGroupModal
        v-if="isEditGroupModalDisplayed"
        :edited-group="undefined"
        win-width="500px"
        @close="toggleEditGroupModal"
      />
    </teleport>
  </NeroToolbar>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import NeroToolbar from '@components/Nero/NeroToolbar'
import NeroIcon from '@components/Nero/NeroIcon'
const EditGroupModal = defineAsyncComponent(() => import('@/components/Groups/EditGroupModal'))

export default {
  name: 'GroupToolbar',
  components: { NeroIcon, NeroToolbar, EditGroupModal },
  data () {
    return {
      isEditGroupModalDisplayed: false
    }
  },
  methods: {
    toggleEditGroupModal () {
      this.isEditGroupModalDisplayed = !this.isEditGroupModalDisplayed
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
