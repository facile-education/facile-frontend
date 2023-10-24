<template>
  <WeprodeTabList class="tablist">
    <WeprodeTabItem
      :title="$t('administration')"
      class="tab"
    >
      <Administration />
    </WeprodeTabItem>
    <WeprodeTabItem
      :title="$t('groups')"
      class="tab"
    >
      <GroupsMaintenance />
    </WeprodeTabItem>
    <WeprodeTabItem
      :title="$t('one-shot-tools')"
      class="tab"
    >
      <OneShotMaintenance />
    </WeprodeTabItem>
    <WeprodeTabItem
      :title="$t('password-update')"
      class="tab"
    >
      <PasswordUpdate />
    </WeprodeTabItem>
  </WeprodeTabList>
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

<i18n locale="fr">
{
  "administration": "Administration",
  "groups": "Groupes ",
  "one-shot-tools": "Outils one-shot",
  "password-update": "Codes de secours"
}
</i18n>
