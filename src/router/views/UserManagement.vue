<template>
  <ServicesWrapper
    :is-title-visible="true"
    :title="$t('UserManagement.serviceTitle')"
  >
    <div
      v-if="schoolList.length > 1"
      class="header"
    >
      <WeprodeDropdown
        v-model="selectedSchool"
        class="dropdown"
        :list="schoolList"
        display-field="schoolName"
      />
    </div>

    <WeprodeTabList>
      <WeprodeTabItem
        :title="$t('UserManagement.manual-users')"
        class="tab"
      >
        <ManualUsers />
      </WeprodeTabItem>
      <WeprodeTabItem
        :title="$t('UserManagement.delegations')"
        class="tab"
      >
        <Delegations />
      </WeprodeTabItem>
      <WeprodeTabItem
        :title="$t('UserManagement.affectations')"
        class="tab"
      >
        <Affectations />
      </WeprodeTabItem>
    </WeprodeTabList>
  </ServicesWrapper>
</template>

<script>
import WeprodeDropdown from '@/components/Base/Weprode/WeprodeDropdown.vue'
import WeprodeTabItem from '@/components/Base/Weprode/WeprodeTabItem.vue'
import WeprodeTabList from '@/components/Base/Weprode/WeprodeTabList.vue'
import Affectations from '@/components/UserManagement/Affectations.vue'
import Delegations from '@/components/UserManagement/Delegations'
import ManualUsers from '@/components/UserManagement/ManualUsers'

import ServicesWrapper from '../../components/ServicesWrapper/ServicesWrapper.vue'
export default {
  name: 'UserManagement',
  components: {
    ManualUsers,
    Delegations,
    Affectations,
    WeprodeTabList,
    WeprodeTabItem,
    WeprodeDropdown,
    ServicesWrapper
  },
  emits: ['update:layout'],
  computed: {
    schoolList () {
      return this.$store.getters['user/adminSchoolList']
    },
    selectedSchool: {
      get () {
        return this.$store.state.user.selectedSchool
      },
      set (school) {
        this.$store.commit('user/setSelectedSchool', school)
      }
    }
  },
  beforeCreate () {
    this.$emit('update:layout', 'BannerLayout')
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.header {
  width: 100%;
  height: $um-ĥeader-height;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  p {
    font-weight: 600;
    font-size: 1.125em;
  }

  .dropdown {
    margin-left: 1em;
  }
}

.tabs {
  height: 32px;
}

.tab-content {
  padding: 0;
}

.tab {
  height: calc(100% - #{$um-ĥeader-height} - 32px);
}
</style>
