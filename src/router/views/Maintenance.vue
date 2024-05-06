<template>
  <ServicesWrapper
    :is-title-visible="false"
  >
    <WeprodeTabList class="tablist">
      <WeprodeTabItem
        :title="$t('Maintenance.administration')"
        class="tab"
      >
        <Administration />
      </WeprodeTabItem>
      <WeprodeTabItem
        :title="$t('Maintenance.groups')"
        class="tab"
      >
        <GroupsMaintenance />
      </WeprodeTabItem>
      <WeprodeTabItem
        :title="$t('Maintenance.oneShotTools')"
        class="tab"
      >
        <OneShotMaintenance />
      </WeprodeTabItem>
      <WeprodeTabItem
        :title="$t('Maintenance.passwordUpdate')"
        class="tab"
      >
        <PasswordUpdate />
      </WeprodeTabItem>
    </WeprodeTabList>
  </ServicesWrapper>
</template>

<script>

import GroupsMaintenance from '@components/Maintenance/GroupsMaintenance.vue'
import OneShotMaintenance from '@components/Maintenance/OneShotMaintenance.vue'
import PasswordUpdate from '@components/Maintenance/PasswordUpdate.vue'

import WeprodeTabItem from '@/components/Base/Weprode/WeprodeTabItem.vue'
import WeprodeTabList from '@/components/Base/Weprode/WeprodeTabList.vue'
import Administration from '@/components/Maintenance/Administration.vue'

export default {
  name: 'Maintenance',
  components: {
    Administration,
    GroupsMaintenance,
    OneShotMaintenance,
    PasswordUpdate,
    WeprodeTabList,
    WeprodeTabItem
  },
  inject: ['mq'],
  emits: ['update:layout'],
  beforeCreate () {
    this.$emit('update:layout', 'BannerLayout')
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.tablist {
  height: 100%;
  display: flex;
  margin-left: 30px;
  margin-top: 30px;
}
</style>
