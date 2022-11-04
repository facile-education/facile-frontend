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

    <div class="right-section">
      <PentilaInput
        v-model="filter.label"
        :placeholder="$t('SearchPlaceholder')"
        :maxlength="75"
        @input="updateFilter"
      />

      <button
        v-t="'community'"
        :class="{'theme-background-color': filter.isCommunityActive}"
        @click="toggleCommunityFilter"
      />

      <button
        v-t="'institutional'"
        :class="{'theme-background-color': filter.isInstitutionalActive}"
        @click="toggleInstitutionalFilter"
      />

      <button
        v-t="'pedagogical'"
        :class="{'theme-background-color': filter.isPedagogicalActive}"
        @click="togglePedagogicalFilter"
      />
    </div>

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
      timeout: 0,
      isEditGroupModalDisplayed: false,
      filter: {
        label: '',
        isCommunityActive: false,
        isInstitutionalActive: false,
        isPedagogicalActive: false
      }
    }
  },
  methods: {
    toggleEditGroupModal () {
      this.isEditGroupModalDisplayed = !this.isEditGroupModalDisplayed
    },
    updateFilter () {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.$store.dispatch('groups/updateFilter', { ...this.filter })
      }, 1000)
    },
    toggleCommunityFilter () {
      this.filter.isCommunityActive = !this.filter.isCommunityActive
      this.$store.dispatch('groups/updateFilter', { ...this.filter })
    },
    toggleInstitutionalFilter () {
      this.filter.isInstitutionalActive = !this.filter.isInstitutionalActive
      this.$store.dispatch('groups/updateFilter', { ...this.filter })
    },
    togglePedagogicalFilter () {
      this.filter.isPedagogicalActive = !this.filter.isPedagogicalActive
      this.$store.dispatch('groups/updateFilter', { ...this.filter })
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

  .right-section {
    display: flex;
    button {
      margin-left: 25px;
      height: 50px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
    &:not(.theme-background-color) {
      background-color: #cccccc;
    }
  }
}
</style>

<i18n locale="fr">
{
  "add": "NOUVEAU",
  "SearchPlaceholder": "Filtrer par nom",
  "community": "Communautaire",
  "institutional": "Institutionnel",
  "pedagogical": "Pédagogique"
}
</i18n>
