<template>
  <Layout :is-allowed="$store.state.user.isAdministrator">
    <PentilaTabList class="tablist">
      <PentilaTabItem
        :title="$t('administration')"
        class="tab"
      >
        <Administration />
      </PentilaTabItem>
      <PentilaTabItem
        :title="$t('groups')"
        class="tab"
      >
        <GroupsMaintenance />
      </PentilaTabItem>
      <PentilaTabItem
        :title="$t('one-shot-tools')"
        class="tab"
      >
        <OneShotMaintenance />
      </PentilaTabItem>
      <PentilaTabItem
        :title="$t('password-update')"
        class="tab"
      >
        <PasswordUpdate />
      </PentilaTabItem>
    </PentilaTabList>
  </Layout>
</template>

<script>

import GroupsMaintenance from '@components/Maintenance/GroupsMaintenance.vue'
import OneShotMaintenance from '@components/Maintenance/OneShotMaintenance.vue'
import PasswordUpdate from '@components/Maintenance/PasswordUpdate.vue'

import Administration from '@/components/Maintenance/Administration.vue'
import Layout from '@/router/layouts/BannerLayout'

export default {
  name: 'Maintenance',
  components: {
    Layout,
    Administration,
    GroupsMaintenance,
    OneShotMaintenance,
    PasswordUpdate
  },
  inject: ['mq'],
  computed: {
  },
  methods: {
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
