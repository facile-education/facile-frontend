<template>
  <NeroToolbar class="toolbar">
    <PentilaButton
      class="create-button"
      @click="toggleEditGroupModal"
    >
      <NeroIcon
        name="fa-plus"
      />
      <span>{{ $t('add') }}</span>
    </PentilaButton>

    <PentilaInput
      v-model="searchInput"
      :placeholder="$t('SearchPlaceholder')"
      :maxlength="75"
    />

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
      isEditGroupModalDisplayed: false,
      searchInput: ''
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
@import "@design";
.toolbar {
  height: $groups-header-height;
  display: flex;
  justify-content: space-between;
  padding: 0 30px;

  .create-button {
    width: 140px;
    border-radius: 6px;

    span {
      margin-left: 12px;
    }
  }

  .filters {
    margin-left: auto;
  }

  .filter {
    margin: 0 5px;
    min-width: 200px;
  }
}
</style>

<i18n locale="fr">
{
  "add": "NOUVEAU",
  "SearchPlaceholder": "Filtrer par nom"
}
</i18n>
