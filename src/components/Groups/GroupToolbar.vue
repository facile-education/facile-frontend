<template>
  <NeroToolbar class="toolbar">
    <WeprodeButton
      v-if="!mq.phone && canCreateGroup"
      data-test="createGroupButton"
      class="create-button"
      :class="{'phone': mq.phone}"
      @click="toggleEditGroupModal"
    >
      <NeroIcon
        name="fa-plus"
      />
      <span>{{ $t('add') }}</span>
    </WeprodeButton>

    <WeprodeInput
      v-model="filter"
      class="filter-input"
      :placeholder="$t('SearchPlaceholder')"
      :maxlength="75"
      @input="updateFilter"
    />

    <WeprodeDropdown
      v-if="!mq.phone && hasScopeList"
      v-model="selectedScope"
      :list="scopeList"
      :sort="false"
      display-field="name"
      @update:modelValue="onScopeChange"
    />

    <teleport to="body">
      <EditGroupModal
        v-if="isEditGroupModalDisplayed"
        :edited-group="undefined"
        win-width="500px"
        @close="isEditGroupModalDisplayed=false"
      />
    </teleport>
  </NeroToolbar>
</template>

<script>
import NeroIcon from '@components/Nero/NeroIcon'
import NeroToolbar from '@components/Nero/NeroToolbar'
import { defineAsyncComponent } from 'vue'

import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'
import WeprodeDropdown from '@/components/Base/Weprode/WeprodeDropdown.vue'
import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'
const EditGroupModal = defineAsyncComponent(() => import('@components/Groups/EditGroupModal/EditGroupModal'))

export default {
  name: 'GroupToolbar',
  components: { NeroIcon, NeroToolbar, EditGroupModal, WeprodeButton, WeprodeDropdown, WeprodeInput },
  inject: ['mq'],
  data () {
    return {
      timeout: 0,
      isEditGroupModalDisplayed: false,
      filter: '',
      selectedScope: {},
      scopeList: [
        { name: this.$t('spaces') },
        { name: this.$t('community'), isCommunity: true },
        { name: this.$t('institutional'), isInstitutional: true },
        { name: this.$t('pedagogical'), isPedagogical: true }
      ]
    }
  },
  computed: {
    canCreateGroup () {
      return !this.$store.state.user.isStudent && !this.$store.state.user.isParent
    },
    hasScopeList () {
      return (this.$store.state.user.isDirectionMember || this.$store.state.user.isPat || this.$store.state.user.isMPS)
    },
    params () {
      return {
        label: this.filter,
        isCommunityActive: this.selectedScope.isCommunity || false,
        isInstitutionalActive: this.selectedScope.isInstitutional || false,
        isPedagogicalActive: this.selectedScope.isPedagogical || false
      }
    }
  },
  created () {
    this.$store.commit('groups/setFilter', this.params)
    if (this.hasScopeList) {
      this.selectedScope = this.scopeList[0]
    }
  },
  methods: {
    onScopeChange () {
      this.$store.dispatch('groups/closePanel')
      this.$store.dispatch('groups/updateFilter', this.params)
    },
    toggleEditGroupModal () {
      this.isEditGroupModalDisplayed = !this.isEditGroupModalDisplayed
    },
    updateFilter () {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.$store.dispatch('groups/updateFilter', this.params)
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.create-button {
  @extend %create-button;
}

.filter-input {
  margin-left: auto;
}

.phone {
  width: 100%;

  .filter-input {
    width: 100%;
  }
}
</style>

<i18n locale="fr">
{
  "add": "NOUVEAU",
  "community": "Personnel",
  "institutional": "Institutionnel",
  "pedagogical": "Pédagogique",
  "SearchPlaceholder": "Filtrer par nom",
  "spaces": "Mes espaces"
}
</i18n>
